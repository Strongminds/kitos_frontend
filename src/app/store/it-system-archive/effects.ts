import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { ItSystemArchiveV2Service } from 'src/app/api/v2';
import { adaptItSystemArchive } from 'src/app/shared/models/it-system/it-system-archive-odata.model';
import { OData } from 'src/app/shared/models/odata.model';
import { ITSystemArchiveActions } from './actions';

@Injectable()
export class ITSystemArchiveEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private archiveService: ItSystemArchiveV2Service,
    private http: HttpClient,
  ) {}

  getArchives$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.getITSystemArchives),
      switchMap(({ gridState }) => {
        return this.http
          .get<OData>(`/odata/ItSystemArchives?$expand=Snapshot($expand=ItSystem($select=Name,Uuid))&$count=true`)
          .pipe(
            map((response) => {
              const dataItems = compact((response.value as any[]).map(adaptItSystemArchive));
              return ITSystemArchiveActions.getITSystemArchivesSuccess(dataItems, response['@odata.count'] || 0);
            }),
            catchError(() => of(ITSystemArchiveActions.getITSystemArchivesSuccess([], 0))),
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

  deleteArchive$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.deleteITSystemArchive),
      switchMap(({ archiveUuid }) =>
        this.archiveService.deleteSingleItSystemArchiveV2Delete({ archiveUuid }).pipe(
          map(() => ITSystemArchiveActions.deleteITSystemArchiveSuccess()),
          catchError(() => of(ITSystemArchiveActions.deleteITSystemArchiveError())),
        ),
      ),
    );
  });

  getCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemArchiveActions.getITSystemArchiveCollectionPermissions),
      map(() => ITSystemArchiveActions.getITSystemArchiveCollectionPermissionsSuccess(undefined)),
    );
  });
}
