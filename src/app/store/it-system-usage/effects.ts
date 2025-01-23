import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact, uniq } from 'lodash';
import { catchError, interval, map, mergeMap, of, switchMap } from 'rxjs';
import { APIBusinessRoleDTO, APIV1ItSystemUsageOptionsINTERNALService } from 'src/app/api/v1';
import {
  APIItSystemUsageResponseDTO,
  APIUpdateItSystemUsageRequestDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageService,
  APIV2OrganizationGridInternalINTERNALService,
} from 'src/app/api/v2';
import { USAGE_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { usageGridStateToAction } from 'src/app/shared/helpers/grid-filter.helpers';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { convertDataSensitivityLevelStringToNumberMap } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { adaptITSystemUsage, ITSystemUsage } from 'src/app/shared/models/it-system-usage/it-system-usage.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ExternalReferencesApiService } from 'src/app/shared/services/external-references-api-service.service';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { getNewGridColumnsBasedOnConfig } from '../helpers/grid-config-helper';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemUsageActions } from './actions';
import {
  selectGridState,
  selectItSystemUsageExternalReferences,
  selectItSystemUsageLocallyAddedKleUuids,
  selectItSystemUsageLocallyRemovedKleUuids,
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
  selectItSystemUsageUuid,
  selectOverviewSystemRoles,
  selectOverviewSystemRolesCache,
  selectPreviousGridState,
  selectUsageGridColumns,
} from './selectors';

@Injectable()
export class ITSystemUsageEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    @Inject(APIV2ItSystemUsageService)
    private apiV2ItSystemUsageService: APIV2ItSystemUsageService,
    @Inject(APIV2ItSystemUsageInternalINTERNALService)
    private apiV2ItSystemUsageInternalService: APIV2ItSystemUsageInternalINTERNALService,
    private externalReferencesApiService: ExternalReferencesApiService,
    private gridColumnStorageService: GridColumnStorageService,
    @Inject(APIV1ItSystemUsageOptionsINTERNALService)
    private apiItSystemUsageOptionsService: APIV1ItSystemUsageOptionsINTERNALService,
    @Inject(APIV2OrganizationGridInternalINTERNALService)
    private apiV2organizationalGridInternalService: APIV2OrganizationGridInternalINTERNALService,
    private gridDataCacheService: GridDataCacheService
  ) {}

  private readonly twoMinutes = 120000;

  invalidateGridDataCache$ = createEffect(() => {
    return interval(this.twoMinutes).pipe(
      map(() => {
        this.gridDataCacheService.reset();
        return ITSystemUsageActions.invalidateGridDataCacheSuccess();
      })
    );
  });

  getItSystemUsages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getITSystemUsages),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectOverviewSystemRoles),
        this.store.select(selectPreviousGridState)]),
      switchMap(([{ odataString, responsibleUnitUuid, gridState }, organizationUuid, systemRoles, previousGridState]) => {

        console.log(JSON.stringify(gridState) + '  is curr + prev gridstate ' + JSON.stringify(previousGridState))
        //todo turn below into tryResetCache(new, prev) so cacheService handles the bool logic
        if (this.gridDataCacheService.shouldResetOnGridStateChange(gridState!, previousGridState)) {
          console.log('triggered by state change')
          this.gridDataCacheService.reset();
        }

        const skip = gridState?.skip ?? 0;
        const take = gridState?.take ?? 0;

        console.log(JSON.stringify(gridState) + '  is gridstate in get effect')

        const chunkSkip = Math.floor(skip / 50) * 50; //todo expose these conversions from cache service so clients dont need to know chunksize
        //also consider taking skip and take as args to cache.get() so service handles extracting range from chunks
        const chunkTake = Math.ceil((skip + take) / 50) * 50 - chunkSkip;

        const chunkIndexStart = chunkSkip / 50;
        const chunkCount = chunkTake / 50;

        const cachedData = this.gridDataCacheService.get(chunkIndexStart, chunkCount);

        if (cachedData !== undefined) {
          console.log('using cache')
          const startReturnData = skip - chunkSkip;
          const endReturnSlice = startReturnData + take;
          const data = cachedData.slice(startReturnData, endReturnSlice);
          const total = this.gridDataCacheService.getTotal();

          return of(ITSystemUsageActions.getITSystemUsagesSuccess(data, total));
        }

        const newGridState = {
          ...gridState,
          skip: chunkSkip,
          take: chunkTake,
        };
        const newOdataString = toODataString(newGridState, { utcDates: true });

        const convertedString = applyQueryFixes(newOdataString, systemRoles);
        //const convertedString = applyQueryFixes(odataString, systemRoles);
        return this.httpClient
          .get<OData>(
            `/odata/ItSystemUsageOverviewReadModels?organizationUuid=${organizationUuid}&$expand=RoleAssignments,DataProcessingRegistrations,DependsOnInterfaces,IncomingRelatedItSystemUsages,OutgoingRelatedItSystemUsages,AssociatedContracts&responsibleOrganizationUnitUuid=${responsibleUnitUuid}&${convertedString}&$count=true`
          )
          .pipe(
            map((data) => {
              console.log('using api')

              const dataItems = compact(data.value.map(adaptITSystemUsage)) as ITSystemUsage[];
              const total = data['@odata.count'];
              this.gridDataCacheService.set(chunkIndexStart, dataItems, total);

              const startReturnData = skip - chunkSkip;
              const endReturnData = startReturnData + take;
              const returnData = dataItems.slice(startReturnData, endReturnData);
              return ITSystemUsageActions.getITSystemUsagesSuccess(returnData, total);
            }),
            catchError(() => of(ITSystemUsageActions.getITSystemUsagesError()))
          );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.updateGridState),
      map(({ gridState }) => {
        return usageGridStateToAction(gridState);
      })
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(USAGE_COLUMNS_ID, gridColumns);
        return ITSystemUsageActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  getItSystemUsageOverviewRoles = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsageOverviewRoles),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectOverviewSystemRolesCache),
      ]),
      switchMap(([_, organizationUuid, cache]) => {
        if (hasValidCache(cache.cacheTime)) {
          return of(ITSystemUsageActions.getItSystemUsageOverviewRolesSuccess(cache.value));
        }
        return this.apiItSystemUsageOptionsService.getSingleItSystemUsageOptionsGetByUuid({ organizationUuid }).pipe(
          map((options) => ITSystemUsageActions.getItSystemUsageOverviewRolesSuccess(options.response.systemRoles)),
          catchError(() => of(ITSystemUsageActions.getItSystemUsageOverviewRolesError()))
        );
      })
    );
  });

  getItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getITSystemUsage),
      switchMap(({ systemUsageUuid }) =>
        this.apiV2ItSystemUsageService.getSingleItSystemUsageV2GetItSystemUsage({ systemUsageUuid }).pipe(
          map((itSystemUsage) => ITSystemUsageActions.getITSystemUsageSuccess(itSystemUsage)),
          catchError(() => of(ITSystemUsageActions.getITSystemUsageError()))
        )
      )
    );
  });

  removeItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeITSystemUsage),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid)),
      switchMap(([_, systemUsageUuid]) => {
        if (!systemUsageUuid) return of(ITSystemUsageActions.removeITSystemUsageError());

        return this.apiV2ItSystemUsageService.deleteSingleItSystemUsageV2DeleteItSystemUsage({ systemUsageUuid }).pipe(
          map(() => ITSystemUsageActions.removeITSystemUsageSuccess()),
          catchError(() => of(ITSystemUsageActions.removeITSystemUsageError()))
        );
      })
    );
  });

  removeItSystemUsageUsingUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeITSystemUsageUsingUnit),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageResponsibleUnit),
        this.store.select(selectItSystemUsageUsingOrganizationUnits),
      ]),
      mergeMap(([{ usingUnitToRemoveUuid }, responsibleUnit, usingUnits]) => {
        const unitUuids = usingUnits?.filter((x) => x.uuid !== usingUnitToRemoveUuid).map((x) => x.uuid);
        const requestBody = {
          organizationUsage: {
            usingOrganizationUnitUuids: unitUuids,
            responsibleOrganizationUnitUuid: responsibleUnit?.uuid === usingUnitToRemoveUuid ? null : undefined,
          },
        } as APIUpdateItSystemUsageRequestDTO;

        return of(ITSystemUsageActions.patchITSystemUsage(requestBody, $localize`Relevant organisationsenhed fjernet`));
      })
    );
  });

  patchItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.patchITSystemUsage),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid)),
      mergeMap(([{ itSystemUsage, customSuccessText, customErrorText }, systemUsageUuid]) => {
        if (!systemUsageUuid) return of(ITSystemUsageActions.patchITSystemUsageError(customErrorText));

        return this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid,
            request: itSystemUsage,
          })
          .pipe(
            map((itSystemUsage) => {
              return ITSystemUsageActions.patchITSystemUsageSuccess(itSystemUsage, customSuccessText);
            }),
            catchError(() => of(ITSystemUsageActions.patchITSystemUsageError(customErrorText)))
          );
      })
    );
  });

  getItSystemUsagePermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getITSystemUsagePermissions),
      switchMap(({ systemUsageUuid }) =>
        this.apiV2ItSystemUsageService.getSingleItSystemUsageV2GetItSystemUsagePermissions({ systemUsageUuid }).pipe(
          map((permissions) => ITSystemUsageActions.getITSystemUsagePermissionsSuccess(permissions)),
          catchError(() => of(ITSystemUsageActions.getITSystemUsagePermissionsError()))
        )
      )
    );
  });

  getItSystemUsageCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getITSystemUsageCollectionPermissions),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiV2ItSystemUsageService
          .getSingleItSystemUsageV2GetItSystemUsageCollectionPermissions({ organizationUuid })
          .pipe(
            map((permissions) => ITSystemUsageActions.getITSystemUsageCollectionPermissionsSuccess(permissions)),
            catchError(() => of(ITSystemUsageActions.getITSystemUsageCollectionPermissionsError()))
          )
      )
    );
  });

  addItSystemUsageRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addItSystemUsageRole),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ userUuid, roleUuid }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchAddRoleAssignment({
            systemUsageUuid: usageUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) => ITSystemUsageActions.addItSystemUsageRoleSuccess(usage)),
            catchError(() => of(ITSystemUsageActions.addItSystemUsageRoleError()))
          )
      )
    );
  });

  removeItSystemUsageRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageRole),
      mergeMap(({ userUuid, roleUuid, itSystemUsageUuid }) =>
        this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchRemoveRoleAssignment({
            systemUsageUuid: itSystemUsageUuid,
            request: { userUuid: userUuid, roleUuid: roleUuid },
          })
          .pipe(
            map((usage) =>
              ITSystemUsageActions.removeItSystemUsageRoleSuccess(usage, userUuid, roleUuid, itSystemUsageUuid)
            ),
            catchError(() => of(ITSystemUsageActions.removeItSystemUsageRoleError()))
          )
      )
    );
  });

  addLocalKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addLocalKLE),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyAddedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([addedKle, currentLocallyAddedKleUuids, systemUsageUuid]) => {
        if (addedKle && currentLocallyAddedKleUuids && systemUsageUuid) {
          const currentKle = currentLocallyAddedKleUuids ?? [];
          const allAddedKleIncludingCurrent = [...currentKle, addedKle.kleUuid];

          return of(
            ITSystemUsageActions.patchITSystemUsage(
              {
                localKleDeviations: {
                  addedKLEUuids: uniq(allAddedKleIncludingCurrent),
                },
              },
              $localize`Opgaven blev tilknyttet`,
              $localize`Opgaven kunne ikke tilknyttets`
            )
          );
        }
        return of();
      })
    );
  });

  removeLocalKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeLocalKLE),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyAddedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([addedKleToRemove, currentLocallyAddedKleUuids, systemUsageUuid]) => {
        if (addedKleToRemove && currentLocallyAddedKleUuids && systemUsageUuid) {
          const currentKle = currentLocallyAddedKleUuids ?? [];
          const allAddedKleIncludingCurrent = currentKle.filter((uuid) => uuid !== addedKleToRemove.kleUuid);

          return of(
            ITSystemUsageActions.patchITSystemUsage(
              {
                localKleDeviations: {
                  addedKLEUuids: uniq(allAddedKleIncludingCurrent),
                },
              },
              $localize`Den lokalt tilknyttede opgave blev fjernet`,
              $localize`Den lokalt tilknyttede opgave kunne ikke fjernes`
            )
          );
        }
        return of();
      })
    );
  });

  removeInheritedKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeInheritedKLE),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyRemovedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([inheritedKleToRemove, currentRemovedInheritedKleUuids, systemUsageUuid]) => {
        if (inheritedKleToRemove && currentRemovedInheritedKleUuids && systemUsageUuid) {
          const currentState = currentRemovedInheritedKleUuids ?? [];
          const removedKleUuids = [...currentState, inheritedKleToRemove.kleUuid];

          return of(
            ITSystemUsageActions.patchITSystemUsage(
              {
                localKleDeviations: {
                  removedKLEUuids: uniq(removedKleUuids),
                },
              },
              $localize`Den nedarvede opgave blev fjernet`,
              $localize`Den nedarvede opgave kunne ikke fjernes`
            )
          );
        }
        return of();
      })
    );
  });

  restoreInheritedKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.restoreInheritedKLE),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageLocallyRemovedKleUuids),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([inheritedKleToRestore, currentRemovedInheritedKleUuids, systemUsageUuid]) => {
        if (inheritedKleToRestore && currentRemovedInheritedKleUuids && systemUsageUuid) {
          const currentState = currentRemovedInheritedKleUuids ?? [];
          const removedKleUuids = currentState.filter((uuid) => uuid !== inheritedKleToRestore.kleUuid);

          return of(
            ITSystemUsageActions.patchITSystemUsage(
              {
                localKleDeviations: {
                  removedKLEUuids: uniq(removedKleUuids),
                },
              },
              $localize`Den nedarvede opgave blev gendannet`,
              $localize`Den nedarvede opgave kunne ikke gendannes`
            )
          );
        }
        return of();
      })
    );
  });

  addItSystemUsageRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addItSystemUsageRelation),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ request }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .postSingleItSystemUsageV2PostSystemUsageRelation({
            systemUsageUuid: usageUuid,
            request,
          })
          .pipe(
            map((relation) => ITSystemUsageActions.addItSystemUsageRelationSuccess(usageUuid, relation)),
            catchError(() => of(ITSystemUsageActions.addItSystemUsageRelationError()))
          )
      )
    );
  });

  patchItSystemUsageRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.patchItSystemUsageRelation),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ relationUuid, request }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .putSingleItSystemUsageV2PutSystemUsageRelation({
            systemUsageUuid: usageUuid,
            systemRelationUuid: relationUuid,
            request: request,
          })
          .pipe(
            map((relation) => ITSystemUsageActions.patchItSystemUsageRelationSuccess(usageUuid, relation)),
            catchError(() => of(ITSystemUsageActions.patchItSystemUsageRelationError()))
          )
      )
    );
  });

  removeItSystemUsageRelation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageRelation),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ relationUuid }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .deleteSingleItSystemUsageV2DeleteSystemUsageRelation({
            systemUsageUuid: usageUuid,
            systemRelationUuid: relationUuid,
          })
          .pipe(
            map(() => ITSystemUsageActions.removeItSystemUsageRelationSuccess(usageUuid)),
            catchError(() => of(ITSystemUsageActions.removeItSystemUsageRelationError()))
          )
      )
    );
  });

  addExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageExternalReferences),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([newExternalReference, externalReferences, systemUsageUuid]) => {
        return this.externalReferencesApiService
          .addExternalReference<APIItSystemUsageResponseDTO>(
            newExternalReference.externalReference,
            externalReferences,
            systemUsageUuid,
            'it-system-usage'
          )
          .pipe(
            map((response) => ITSystemUsageActions.addExternalReferenceSuccess(response)),
            catchError(() => of(ITSystemUsageActions.addExternalReferenceError()))
          );
      })
    );
  });

  editExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.editExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageExternalReferences),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([editData, externalReferences, systemUsageUuid]) => {
        return this.externalReferencesApiService
          .editExternalReference<APIItSystemUsageResponseDTO>(
            editData,
            externalReferences,
            systemUsageUuid,
            'it-system-usage'
          )
          .pipe(
            map((response) => ITSystemUsageActions.editExternalReferenceSuccess(response)),
            catchError(() => of(ITSystemUsageActions.editExternalReferenceError()))
          );
      })
    );
  });

  removeExternalReference$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeExternalReference),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageExternalReferences),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([referenceUuid, externalReferences, systemUsageUuid]) => {
        return this.externalReferencesApiService
          .deleteExternalReference<APIItSystemUsageResponseDTO>(
            referenceUuid.referenceUuid,
            externalReferences,
            systemUsageUuid,
            'it-system-usage'
          )
          .pipe(
            map((response) => ITSystemUsageActions.removeExternalReferenceSuccess(response)),
            catchError(() => of(ITSystemUsageActions.removeExternalReferenceError()))
          );
      })
    );
  });

  removeItSystemUsageJournalPeriod$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageJournalPeriod),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ journalPeriodUuid }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .deleteSingleItSystemUsageV2DeleteJournalPeriod({
            systemUsageUuid: usageUuid,
            journalPeriodUuid: journalPeriodUuid,
          })
          .pipe(
            map(() => ITSystemUsageActions.removeItSystemUsageJournalPeriodSuccess(usageUuid)),
            catchError(() => of(ITSystemUsageActions.removeItSystemUsageJournalPeriodError()))
          )
      )
    );
  });

  addItSystemUsageJournalPeriod$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.addItSystemUsageJournalPeriod),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ journalPeriod }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .postSingleItSystemUsageV2PostJournalPeriod({
            systemUsageUuid: usageUuid,
            request: journalPeriod,
          })
          .pipe(
            map((_) => ITSystemUsageActions.addItSystemUsageJournalPeriodSuccess(usageUuid)),
            catchError(() => of(ITSystemUsageActions.addItSystemUsageJournalPeriodError()))
          )
      )
    );
  });

  patchItSystemUsageJournalPeriod$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.patchItSystemUsageJournalPeriod),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid).pipe(filterNullish())),
      mergeMap(([{ journalPeriodUuid, journalPeriod }, usageUuid]) =>
        this.apiV2ItSystemUsageService
          .putSingleItSystemUsageV2PutJournalPeriod({
            systemUsageUuid: usageUuid,
            journalPeriodUuid: journalPeriodUuid,
            request: journalPeriod,
          })
          .pipe(
            map((_) => ITSystemUsageActions.patchItSystemUsageJournalPeriodSuccess(usageUuid)),
            catchError(() => of(ITSystemUsageActions.patchItSystemUsageJournalPeriodError()))
          )
      )
    );
  });

  createItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.createItSystemUsage),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ itSystemUuid }, organizationUuid]) =>
        this.apiV2ItSystemUsageService
          .postSingleItSystemUsageV2PostItSystemUsage({ request: { systemUuid: itSystemUuid, organizationUuid } })
          .pipe(
            map((usage: APIItSystemUsageResponseDTO) =>
              ITSystemUsageActions.createItSystemUsageSuccess(itSystemUuid, usage.uuid)
            ),
            catchError(() => of(ITSystemUsageActions.createItSystemUsageError()))
          )
      )
    );
  });

  deleteItSystemUsageByItSystemAndOrganization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ itSystemUuid }, organizationUuid]) =>
        this.apiV2ItSystemUsageInternalService
          .deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid({
            organizationUuid,
            systemUuid: itSystemUuid,
          })
          .pipe(
            map(() => ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess(itSystemUuid)),
            catchError(() => of(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationError()))
          )
      )
    );
  });

  saveOrganizationalITSystemUsageColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ columnConfig }, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .postSingleOrganizationGridInternalV2SaveGridConfiguration({
            organizationUuid,
            overviewType: 'ItSystemUsage',
            config: {
              visibleColumns: columnConfig,
            },
          })
          .pipe(
            map(() => ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationSuccess()),
            catchError(() => of(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationError()))
          )
      )
    );
  });

  deleteOrganizationalITSystemUsageColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .deleteSingleOrganizationGridInternalV2DeleteGridConfiguration({
            organizationUuid,
            overviewType: 'ItSystemUsage',
          })
          .pipe(
            map(() => ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfigurationSuccess()),
            catchError(() => of(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfigurationError()))
          )
      )
    );
  });

  resetToOrganizationalITSystemUsageColumnConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'ItSystemUsage',
          })
          .pipe(
            map((response) =>
              ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationSuccess(response)
            ),
            catchError(() => of(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationError()))
          )
      )
    );
  });

  resetToOrganizationITSystemUsageColumnConfigurationSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationSuccess),
      concatLatestFrom(() => [this.store.select(selectUsageGridColumns)]),
      map(([{ response }, columns]) => {
        const configColumns = response?.visibleColumns;
        if (!configColumns) return ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationError();
        const newColumns = getNewGridColumnsBasedOnConfig(configColumns, columns);
        return ITSystemUsageActions.updateGridColumns(newColumns);
      })
    );
  });

  initializeITSystemUsageLastSeenGridConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfiguration),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.apiV2organizationalGridInternalService
          .getSingleOrganizationGridInternalV2GetGridConfiguration({
            organizationUuid,
            overviewType: 'ItSystemUsage',
          })
          .pipe(
            map((response) => ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfigurationSuccess(response)),
            catchError(() => of(ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfigurationError()))
          )
      )
    );
  });
}

function applyQueryFixes(odataString: string, systemRoles: APIBusinessRoleDTO[] | undefined) {
  let convertedString = odataString
    .replace(/(\w+\()ItSystemKLEIdsAsCsv(.*\))/, 'ItSystemTaskRefs/any(c: $1c/KLEId$2)')
    .replace(/(\w+\()ItSystemKLENamesAsCsv(.*\))/, 'ItSystemTaskRefs/any(c: $1c/KLEName$2)')
    .replace(
      new RegExp(`SensitiveDataLevelsAsCsv eq ('\\w+')`, 'i'),
      (_, p1) =>
        `SensitiveDataLevels/any(c: c/SensitivityDataLevel eq '${convertDataSensitivityLevelStringToNumberMap(
          p1.replace(/'/g, '')
        )}')`
    )
    .replace(
      /(\w+\()DataProcessingRegistrationNamesAsCsv(.*\))/,
      'DataProcessingRegistrations/any(c: $1c/DataProcessingRegistrationName$2)'
    )
    .replace(/(\w+\()DependsOnInterfacesNamesAsCsv(.*\))/, 'DependsOnInterfaces/any(c: $1c/InterfaceName$2)')
    .replace(
      /(\w+\()IncomingRelatedItSystemUsagesNamesAsCsv(.*\))/,
      'IncomingRelatedItSystemUsages/any(c: $1c/ItSystemUsageName$2)'
    )
    .replace(
      /RelevantOrganizationUnitNamesAsCsv eq '([\w-]+)'/,
      'RelevantOrganizationUnits/any(c: c/OrganizationUnitUuid eq $1)'
    )
    .replace(/(\w+\()AssociatedContractsNamesCsv(.*\))/, 'AssociatedContracts/any(c: $1c/ItContractName$2)')
    .replace(/ItSystemBusinessTypeUuid eq '([\w-]+)'/, 'ItSystemBusinessTypeUuid eq $1')
    .replace(/ItSystemCategoriesUuid eq '([\w-]+)'/, 'ItSystemCategoriesUuid eq $1');

  convertedString = convertedString.replace(
    new RegExp(`DataProcessingRegistrationsConcludedAsCsv eq ('[^']+')`, 'i'),
    'contains(DataProcessingRegistrationsConcludedAsCsv, $1)'
  );

  systemRoles?.forEach((role) => {
    convertedString = convertedString.replace(
      new RegExp(`(\\w+\\()Roles[./]Role${role.id}(,.*?\\))`, 'i'),
      `RoleAssignments/any(c: $1c/UserFullName$2 and c/RoleId eq ${role.id})`
    );
  });

  return convertedString;
}
