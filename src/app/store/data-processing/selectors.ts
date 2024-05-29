import { createSelector } from '@ngrx/store';
import { dataProcessingAdapter, dataProcessingFeature } from './reducer';

const { selectDataProcessingState } = dataProcessingFeature;

export const selectAll = createSelector(selectDataProcessingState, dataProcessingAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectDataProcessingState, (state) => state.total);
export const selectDataProcessingGridLoading = createSelector(
  selectDataProcessingState,
  (state) => state.isLoadingDataProcessingsQuery
);
export const selectDataProcessingGridState = createSelector(selectDataProcessingState, (state) => state.gridState);
export const selectDataProcessingGridData = createSelector(selectAll, selectTotal, (data, total) => ({ data, total }));

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

export const selectDataProcessingHasReadPermissions = createSelector(
  selectDataProcessingState,
  (state) => state.permissions?.read
);
export const selectDataProcessingHasModifyPermissions = createSelector(
  selectDataProcessingState,
  (state) => state.permissions?.modify
);
export const selectDataProcessingHasDeletePermissions = createSelector(
  selectDataProcessingState,
  (state) => state.permissions?.delete
);
export const selectDataProcessingHasCreateCollectionPermissions = createSelector(
  selectDataProcessingState,
  (state) => state.collectionPermissions?.create
);
