import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs';
import { ItContractSupplierOverviewReadModelsService } from 'src/app/api/v1';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { ITContractSupplierActions } from './actions';
import { selectSupplierGridState } from './selectors';

@Injectable()
export class ITContractSupplierEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private supplierService: ItContractSupplierOverviewReadModelsService,
  ) {}

  getSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.getSuppliers, ITContractSupplierActions.updateGridState),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid),
        this.store.select(selectSupplierGridState),
      ]),
      switchMap(([_, organizationUuid, gridState]) => {
        return this.supplierService
          .getSingleItContractSupplierOverviewReadModelsGet({ organizationUuid })
          .pipe(
            map((response) => {
              const suppliers = response.value || [];
              const total = response['@odata.count'] || suppliers.length;
              return ITContractSupplierActions.getSuppliersSuccess(suppliers, total);
            }),
            catchError(() => [ITContractSupplierActions.getSuppliersError()]),
          );
      }),
    );
  });

  getSupplierCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITContractSupplierActions.getSupplierCollectionPermissions),
      map(() => ITContractSupplierActions.getSupplierCollectionPermissionsSuccess(undefined)),
    );
  });
}
