import { createSelector } from '@ngrx/store';
import { hasValidTwoMinuteCache } from 'src/app/shared/helpers/date.helpers';
import { mapToRoleAssignmentsRequests } from 'src/app/shared/helpers/role-helpers';
import { dataProcessingAdapter, dataProcessingFeature } from './reducer';

const { selectDataProcessingState } = dataProcessingFeature;

export const selectAll = createSelector(selectDataProcessingState, dataProcessingAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectDataProcessingState, (state) => state.total);
export const selectDataProcessingGridLoading = createSelector(
  selectDataProcessingState,
  (state) => state.isLoadingDataProcessingsQuery
);
export const selectDataProcessingGridState = createSelector(selectDataProcessingState, (state) => state.gridState);
export const selectPreviousGridState = createSelector(selectDataProcessingState, (state) => state.previousGridState);

export const selectDataProcessingGridData = createSelector(selectAll, selectTotal, (data, total) => ({ data, total }));
export const selectDataProcessingGridColumns = createSelector(selectDataProcessingState, (state) => state.gridColumns);
export const selectDataProcessingRoleColumns = createSelector(
  selectDataProcessingState,
  (state) => state.gridRoleColumns
);

export const selectOverviewRolesCache = createSelector(selectDataProcessingState, (state) => state.overviewRoles);
export const selectOverviewRoles = createSelector(selectOverviewRolesCache, (cache) => cache.value);

export const selectDataProcessingLoading = createSelector(selectDataProcessingState, (state) => state.loading);
export const selectDataProcessing = createSelector(selectDataProcessingState, (state) => state.dataProcessing);

export const selectDataProcessingUuid = createSelector(
  selectDataProcessingState,
  (state) => state.dataProcessing?.uuid
);
export const selectDataProcessingName = createSelector(selectDataProcessing, (dataProcessing) => dataProcessing?.name);

export const selectDataProcessingTransferToCountries = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general.insecureCountriesSubjectToDataTransfer
);
export const selectDataProcessingProcessors = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general.dataProcessors
);
export const selectDataProcessingSubProcessors = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general.subDataProcessors
);
export const selectDataProcessingSystems = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.systemUsages
);
export const selectDataProcessingExternalReferences = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.externalReferences
);
export const selectDataProcessingItContacts = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general
);
export const selectDataProcessingMainContract = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general.mainContract
);
export const selectDataProcessingAssociatedContracts = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general.associatedContracts
);
export const selectDataProcessingIsValid = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.general.valid
);

export const selectDataProcessingHasReadPermissions = createSelector(selectDataProcessingState, (state) => {
  return state.permissions?.value?.read;
});
export const selectDataProcessingHasModifyPermissions = createSelector(
  selectDataProcessingState,
  (state) => state.permissions?.value?.modify
);
export const selectDataProcessingHasDeletePermissions = createSelector(
  selectDataProcessingState,
  (state) => state.permissions?.value?.delete
);
export const selectHasValidDataProcessingPermissionsCache = createSelector(
  selectDataProcessingState,
  () => new Date(),
  (state, now) => {
    return hasValidTwoMinuteCache(state.permissions?.cacheTime, now);
  }
);

export const selectDataProcessingHasCreateCollectionPermissions = createSelector(
  selectDataProcessingState,
  (state) => state.collectionPermissions?.value?.create
);
export const selectHasValidDataProcessingCollectionPermissionsCache = createSelector(
  selectDataProcessingState,
  () => new Date(),
  (state, now) => {
    return hasValidTwoMinuteCache(state.collectionPermissions?.cacheTime, now);
  }
);

export const selectDataProcessingOversightOptions = createSelector(
  selectDataProcessing,
  (state) => state?.oversight?.oversightOptions
);
export const selectDataProcessingOversightDates = createSelector(
  selectDataProcessing,
  (state) => state?.oversight?.oversightDates
);

export const selectDataProcessingLastSeenGridConfig = createSelector(
  selectDataProcessingState,
  (state) => state.lastSeenGridConfig
);

export const selectDataProcessingRights = createSelector(
  selectDataProcessing,
  (dataProcessing) => dataProcessing?.roles
);

export const selectDataProcessingRightUuidPairs = createSelector(
  selectDataProcessingRights,
  mapToRoleAssignmentsRequests
);
