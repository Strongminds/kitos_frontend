import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { ItSystemUsageArchiveV2Service } from 'src/app/api/v2';
import { ARCHIVE_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { adaptItSystemArchive } from 'src/app/shared/models/it-system/it-system-archive-odata.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemArchiveActions } from './actions';
import { selectArchivePreviousGridState } from './selectors';

@Injectable()
export class ITSystemArchiveEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(ItSystemUsageArchiveV2Service) private archiveService: ItSystemUsageArchiveV2Service,
    private httpClient: HttpClient,
    private gridColumnStorageService: GridColumnStorageService,
    private gridDataCacheService: GridDataCacheService,
  ) {}

  getArchives$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.getITSystemArchives),
      concatLatestFrom(() => [
        this.store.select(selectArchivePreviousGridState),
        this.store.select(selectOrganizationUuid),
      ]),
      switchMap(([{ gridState }, previousGridState, organizationUuid]) => {
        this.gridDataCacheService.tryResetOnGridStateChange(gridState, previousGridState);

        const cachedRange = this.gridDataCacheService.get(gridState);
        if (cachedRange.data !== undefined) {
          return of(ITSystemArchiveActions.getITSystemArchivesSuccess(cachedRange.data, cachedRange.total));
        }

        const cacheableOdataString = this.gridDataCacheService.toChunkedODataString(gridState);
        return this.httpClient
          .get<OData>(
            `/odata/ItSystemArchives?organizationUuid=${organizationUuid}&$expand=Snapshot($expand=ItSystem($select=Name,Uuid))&${cacheableOdataString}&$count=true`,
          )
          .pipe(
            map((data) => {
              const dataItems = compact(data.value.map(adaptItSystemArchive));
              const total = data['@odata.count'];
              this.gridDataCacheService.set(gridState, dataItems, total);

              const returnData = this.gridDataCacheService.gridStateSliceFromArray(dataItems, gridState);
              return ITSystemArchiveActions.getITSystemArchivesSuccess(returnData, total);
            }),
            catchError(() => of(ITSystemArchiveActions.getITSystemArchivesError())),
          );
      }),
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.updateGridState),
      map(({ gridState }) => ITSystemArchiveActions.getITSystemArchives(gridState)),
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(ARCHIVE_COLUMNS_ID, gridColumns);
        return ITSystemArchiveActions.updateGridColumnsSuccess(gridColumns);
      }),
    );
  });

  deleteArchive$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.deleteITSystemArchive),
      switchMap(({ archiveUuid }) =>
        this.archiveService.deleteSingleItSystemUsageArchiveV2Delete({ archiveUuid }).pipe(
          map(() => {
            this.gridDataCacheService.reset();
            return ITSystemArchiveActions.deleteITSystemArchiveSuccess();
          }),
          catchError(() => of(ITSystemArchiveActions.deleteITSystemArchiveError())),
        ),
      ),
    );
  });

  getCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.getITSystemArchiveCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.archiveService
          .getSingleItSystemUsageArchiveV2GetItSystemUsageArchiveCollectionPermissions({ organizationUuid })
          .pipe(
            map((permissions) => ITSystemArchiveActions.getITSystemArchiveCollectionPermissionsSuccess(permissions)),
            catchError(() => of(ITSystemArchiveActions.getITSystemArchiveCollectionPermissionsError())),
          ),
      ),
    );
  });
}
