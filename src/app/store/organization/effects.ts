import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { toODataString } from '@progress/kendo-data-query';
import { compact } from 'lodash';
import { catchError, combineLatestWith, filter, map, of, switchMap, tap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { OData } from 'src/app/shared/models/odata.model';
import { adaptOrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { adaptOrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { adaptOrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';
import { adaptOrganization } from 'src/app/shared/models/organization/organization.model';
import { mapUIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { UserActions } from '../user-store/actions';
import { selectOrganizationUuid } from '../user-store/selectors';
import { OrganizationActions } from './actions';
import { selectHasValidUIRootConfigCache } from './selectors';

@Injectable()
export class OrganizationEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient
  ) {}

  getOrganizations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getOrganizations),
      switchMap(({ odataString }) => {
        const fixedOdataString = applyQueryFixes(odataString);

        return this.httpClient.get<OData>(`/odata/Organizations?${fixedOdataString}&$count=true`).pipe(
          map((data) =>
            OrganizationActions.getOrganizationsSuccess(
              compact(data.value.map(adaptOrganization)),
              data['@odata.count']
            )
          ),
          catchError(() => of(OrganizationActions.getOrganizationsError()))
        );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.updateGridState),
      map(({ gridState }) => {
        return OrganizationActions.getOrganizations(toODataString(gridState));
      })
    );
  });

  getOrganizationMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getMasterData),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterData({ organizationUuid })
          .pipe(
            map((organizationMasterDataDto) => {
              const organizationMasterData = adaptOrganizationMasterData(organizationMasterDataDto);
              if (organizationMasterData) return OrganizationActions.getMasterDataSuccess(organizationMasterData);
              else return OrganizationActions.getMasterDataError();
            }),
            catchError(() => of(OrganizationActions.getMasterDataError()))
          )
      )
    );
  });

  patchOrganizationMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchMasterData),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2PatchOrganizationMasterData({ organizationUuid, requestDto: request })
          .pipe(
            map((organizationMasterDataDto) => {
              const organizationMasterData = adaptOrganizationMasterData(organizationMasterDataDto);
              return organizationMasterData
                ? OrganizationActions.patchMasterDataSuccess(organizationMasterData)
                : OrganizationActions.patchMasterDataError();
            }),
            catchError(() => of(OrganizationActions.patchMasterDataError()))
          )
      )
    );
  });

  getOrganizationMasterDataRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getMasterDataRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles({ organizationUuid })
          .pipe(
            map((organizationMasterDataRolesDto) => {
              const organizationMasterDataRoles = adaptOrganizationMasterDataRoles(organizationMasterDataRolesDto);
              return organizationMasterDataRoles
                ? OrganizationActions.getMasterDataRolesSuccess(organizationMasterDataRoles)
                : OrganizationActions.getMasterDataRolesError();
            }),
            catchError(() => of(OrganizationActions.getMasterDataRolesError()))
          )
      )
    );
  });

  patchOrganizationMasterDataRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchMasterDataRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles({
            organizationUuid,
            requestDto: request,
          })
          .pipe(
            map((organizationMasterDataRolesDto) => {
              const organizationMasterDataRoles = adaptOrganizationMasterDataRoles(organizationMasterDataRolesDto);
              return organizationMasterDataRoles
                ? OrganizationActions.patchMasterDataRolesSuccess(organizationMasterDataRoles)
                : OrganizationActions.patchMasterDataRolesError();
            }),
            catchError(() => of(OrganizationActions.patchMasterDataRolesError()))
          )
      )
    );
  });

  getOrganizationPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getOrganizationPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService.getSingleOrganizationsInternalV2GetPermissions({ organizationUuid }).pipe(
          map((permissionsDto) => {
            const permissions = adaptOrganizationPermissions(permissionsDto);
            if (permissions) return OrganizationActions.getOrganizationPermissionsSuccess(permissions);
            else return OrganizationActions.getOrganizationPermissionsError();
          }),
          catchError(() => of(OrganizationActions.getOrganizationPermissionsError()))
        )
      )
    );
  });

  getUIRootConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getUIRootConfig, UserActions.resetOnOrganizationUpdate),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectHasValidUIRootConfigCache()),
      ]),
      filter(([_, __, validCache]) => !validCache),
      switchMap(([_, organizationUuid]) =>
        this.organizationInternalService.getSingleOrganizationsInternalV2GetUIRootConfig({ organizationUuid }).pipe(
          map((responseDto) => {
            const uiRootConfig = mapUIRootConfig(responseDto);
            return OrganizationActions.getUIRootConfigSuccess({ uiRootConfig });
          }),
          catchError(() => of(OrganizationActions.getUIRootConfigError()))
        )
      )
    );
  });

  patchUIRootConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchUIRootConfig),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ dto }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2PatchUIRootConfig({ dto, organizationUuid })
          .pipe(
            map((responseDto) => {
              const uiRootConfig = mapUIRootConfig(responseDto);
              return OrganizationActions.patchUIRootConfigSuccess({ uiRootConfig });
            }),
            catchError(() => of(OrganizationActions.patchUIRootConfigError()))
          )
      )
    );
  });

  patchOrganization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchOrganization),
      switchMap(({ request, organizationUuid }) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2PatchOrganization({ requestDto: request, organizationUuid })
          .pipe(
            map(() => OrganizationActions.patchOrganizationSuccess()),
            catchError(() => of(OrganizationActions.patchOrganizationError()))
          )
      )
    );
  });

  createOrganization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.createOrganization),
      switchMap(({ request }) =>
        this.organizationInternalService.postSingleOrganizationsInternalV2CreateOrganization({ request }).pipe(
          map(() => OrganizationActions.createOrganizationSuccess()),
          catchError(() => of(OrganizationActions.createOrganizationError()))
        )
      )
    );
  });

  deleteOrganization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.deleteOrganization),
      switchMap(({ organizationUuid }) =>
        this.organizationInternalService
          .deleteSingleOrganizationsInternalV2DeleteOrganization({ organizationUuid, enforceDeletion: true })
          .pipe(
            map(() => OrganizationActions.deleteOrganizationSuccess()),
            catchError(() => of(OrganizationActions.deleteOrganizationError()))
          )
      )
    );
  });
}

function applyQueryFixes(odataString: string) {
  return odataString.replaceAll('ForeignBusiness', 'ForeignCvr').replaceAll('OrganizationType', 'TypeId');
}
