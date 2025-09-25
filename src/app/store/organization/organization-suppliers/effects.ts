import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationSupplierInternalINTERNALService } from 'src/app/api/v2';
import { filterUndefined } from 'src/app/shared/helpers/array.helpers';
import {
  adaptShallowOrganization,
  ShallowOrganization,
} from 'src/app/shared/models/organization/shallow-organization.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { filterUndefinedInArray } from 'src/app/shared/pipes/filter-undefined-in-array';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { OrganizationSuppliersActions } from './actions';
import {
  selectAvailableOrganizationSuppliers,
  selectAvailableOrganizationSuppliersHasValidCache,
  selectOrganizationSuppliers,
  selectOrganizationSuppliersHasValidCache,
} from './selectors';

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
      ofType(
        OrganizationSuppliersActions.getOrganizationSuppliers,
        OrganizationSuppliersActions.addOrganizationSupplierSuccess,
        OrganizationSuppliersActions.removeOrganizationSupplierSuccess
      ),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectOrganizationSuppliersHasValidCache),
        this.store.select(selectOrganizationSuppliers),
      ]),
      switchMap(([_, organizationUuid, validCache, cachedSuppliers]) => {
        if (validCache) return of(OrganizationSuppliersActions.getOrganizationSuppliersSuccess(cachedSuppliers));
        return this.organizationSuppliersService
          .getManyOrganizationSupplierInternalV2GetSuppliers({ organizationUuid })
          .pipe(
            map((data) => this.adaptShallowOrganizations(data)),
            filterUndefinedInArray(),
            map((suppliers) =>
              OrganizationSuppliersActions.getOrganizationSuppliersSuccess(filterUndefined(suppliers))
            ),
            catchError(() => of(OrganizationSuppliersActions.getOrganizationSuppliersError()))
          );
      })
    );
  });

  getAvailableSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        OrganizationSuppliersActions.getAvailableOrganizationSuppliers,
        OrganizationSuppliersActions.addOrganizationSupplierSuccess,
        OrganizationSuppliersActions.removeOrganizationSupplierSuccess
      ),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectAvailableOrganizationSuppliersHasValidCache),
        this.store.select(selectAvailableOrganizationSuppliers),
      ]),
      switchMap(([_, organizationUuid, validCache, cachedAvailableSuppliers]) => {
        if (validCache)
          return of(OrganizationSuppliersActions.getAvailableOrganizationSuppliersSuccess(cachedAvailableSuppliers));
        return this.organizationSuppliersService
          .getManyOrganizationSupplierInternalV2GetAvailableSuppliers({ organizationUuid })
          .pipe(
            map((data) => this.adaptShallowOrganizations(data)),
            filterUndefinedInArray(),
            map((availableSuppliers) =>
              OrganizationSuppliersActions.getAvailableOrganizationSuppliersSuccess(availableSuppliers)
            ),
            catchError(() => of(OrganizationSuppliersActions.getAvailableOrganizationSuppliersError()))
          );
      })
    );
  });

  addSupplier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationSuppliersActions.addOrganizationSupplier),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
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
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
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

  private adaptShallowOrganizations(source: any[]): (ShallowOrganization | undefined)[] {
    return source.map((s) => adaptShallowOrganization(s));
  }
}
