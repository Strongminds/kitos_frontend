import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { CONTRACT_SUPPLIERS_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { adaptITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';
import { OData } from 'src/app/shared/models/odata.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { ITContractSupplierActions } from './actions';
import { selectSupplierPreviousGridState } from './selectors';

@Injectable()
export class ITContractSupplierEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private gridDataCacheService: GridDataCacheService,
    private httpClient: HttpClient,
    private gridColumnStorageService: GridColumnStorageService,
  ) {}

  getSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.getSuppliers),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid),
        this.store.select(selectSupplierPreviousGridState),
      ]),
      switchMap(([{ gridState }, organizationUuid, previousGridState]) => {
        this.gridDataCacheService.tryResetOnGridStateChange(gridState, previousGridState);

        const cachedRange = this.gridDataCacheService.get(gridState);
        if (cachedRange.data !== undefined) {
          return of(ITContractSupplierActions.getSuppliersSuccess(cachedRange.data, cachedRange.total));
        }

        const cacheableOdataString = this.gridDataCacheService.toChunkedODataString(gridState);

        return this.httpClient
          .get<OData>(
            `/odata/Organizations(${organizationUuid})/ItContractSupplierOverviewReadModels?$expand=Organization($select=Name,Uuid)&${cacheableOdataString}&$count=true`,
          )
          .pipe(
            map((data) => {
              const suppliers = compact(data.value.map(adaptITContractSupplier));
              const total = data['@odata.count'];
              this.gridDataCacheService.set(gridState, suppliers, total);

              const returnData = this.gridDataCacheService.gridStateSliceFromArray(suppliers, gridState);
              return ITContractSupplierActions.getSuppliersSuccess(returnData, total);
            }),
            catchError(() => of(ITContractSupplierActions.getSuppliersError())),
          );
      }),
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(CONTRACT_SUPPLIERS_COLUMNS_ID, gridColumns);
        return ITContractSupplierActions.updateGridColumnsSuccess(gridColumns);
      }),
    );
  });
}
