import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationSupplierInternalINTERNALService } from 'src/app/api/v2';
import {
  adaptShallowOrganization,
  ShallowOrganization,
} from 'src/app/shared/models/organization/shallow-organization.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { OrganizationSuppliersActions } from './actions';

@Injectable()
export class OrganizationSuppliersEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2OrganizationSupplierInternalINTERNALService)
    private organizationSuppliersService: APIV2OrganizationSupplierInternalINTERNALService
  ) {}

  getSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationSuppliersActions.getOrganizationSuppliers),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.organizationSuppliersService.getManyOrganizationSupplierInternalV2GetSuppliers({ organizationUuid }).pipe(
          map((suppliers) =>
            OrganizationSuppliersActions.getOrganizationSuppliersSuccess(this.adaptShallowOrganizations(suppliers))
          ),
          catchError(() => of(OrganizationSuppliersActions.getOrganizationSuppliersError()))
        )
      )
    );
  });

  getAvailableSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationSuppliersActions.getAvailableOrganizationSuppliers),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.organizationSuppliersService
          .getManyOrganizationSupplierInternalV2GetAvailableSuppliers({ organizationUuid })
          .pipe(
            map((availableSuppliers) =>
              OrganizationSuppliersActions.getAvailableOrganizationSuppliersSuccess(
                this.adaptShallowOrganizations(availableSuppliers)
              )
            ),
            catchError(() => of(OrganizationSuppliersActions.getAvailableOrganizationSuppliersError()))
          )
      )
    );
  });

  addSupplier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationSuppliersActions.addOrganizationSupplier),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ supplierUuid }, organizationUuid]) =>
        this.organizationSuppliersService
          .postSingleOrganizationSupplierInternalV2AddSupplier({ organizationUuid, supplierUuid })
          .pipe(
            map(() => OrganizationSuppliersActions.addOrganizationSupplierSuccess()),
            catchError(() => of(OrganizationSuppliersActions.addOrganizationSupplierError()))
          )
      )
    );
  });

  removeSupplier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationSuppliersActions.removeOrganizationSupplier),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ supplierUuid }, organizationUuid]) =>
        this.organizationSuppliersService
          .deleteSingleOrganizationSupplierInternalV2DeleteSupplier({ organizationUuid, supplierUuid })
          .pipe(
            map(() => OrganizationSuppliersActions.removeOrganizationSupplierSuccess()),
            catchError(() => of(OrganizationSuppliersActions.removeOrganizationSupplierError()))
          )
      )
    );
  });

  private adaptShallowOrganizations(source: any[]): ShallowOrganization[] {
    return source.map((s) => adaptShallowOrganization(s)).filter((x) => x !== undefined);
  }
}
