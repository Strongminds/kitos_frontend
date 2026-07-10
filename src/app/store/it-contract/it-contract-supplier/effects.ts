import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { OrganizationGridInternalV2Service } from 'src/app/api/v2';
import { adaptITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { getNewGridColumnsBasedOnConfig } from '../../helpers/grid-config-helper';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { ITContractSupplierActions } from './actions';
import { selectSupplierGridColumns, selectSupplierPreviousGridState } from './selectors';

@Injectable()
export class ITContractSupplierEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private gridDataCacheService: GridDataCacheService,
    private httpClient: HttpClient,
    @Inject(OrganizationGridInternalV2Service)
    private apiV2organizationalGridInternalService: OrganizationGridInternalV2Service,
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

  resetToOrganizationalITContractColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.resetToOrganizationITContractSuppliersColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ disablePopupNotification }, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'ItContract',
          })
          .pipe(
            map((response) =>
              ITContractSupplierActions.resetToOrganizationITContractSuppliersColumnConfigurationSuccess(
                response,
                disablePopupNotification,
              ),
            ),
            catchError(() =>
              of(
                ITContractSupplierActions.resetToOrganizationITContractSuppliersColumnConfigurationError(
                  disablePopupNotification,
                ),
              ),
            ),
          ),
      ),
    );
  });

  resetToOrganizationITContractColumnConfigurationSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.resetToOrganizationITContractSuppliersColumnConfigurationSuccess),
      concatLatestFrom(() => [this.store.select(selectSupplierGridColumns)]),
      map(([{ response }, columns]) => {
        const configColumns = response?.visibleColumns;
        if (!configColumns)
          return ITContractSupplierActions.resetToOrganizationITContractSuppliersColumnConfigurationError();
        const newColumns = getNewGridColumnsBasedOnConfig(configColumns, columns);
        return ITContractSupplierActions.updateGridColumns(newColumns);
      }),
    );
  });
}
