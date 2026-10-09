import { createSelector } from '@ngrx/store';
import { fkOrgFeature } from './reducer';

const { selectFkOrgState } = fkOrgFeature;

export const selectSynchronizationStatus = createSelector(selectFkOrgState, (state) => state.synchronizationStatus);
export const selectCanCreateConnection = createSelector(
  selectSynchronizationStatus,
  (status) => status?.canCreateConnection,
);
export const selectCanModifyConnection = createSelector(
  selectSynchronizationStatus,
  (status) => status?.canUpdateConnection,
);
export const selectCanDeleteConnection = createSelector(
  selectSynchronizationStatus,
  (status) => status?.canDeleteConnection,
);
export const selectAccessError = createSelector(selectFkOrgState, (state) => state.accessError);
export const selectAccessGranted = createSelector(
  selectFkOrgState,
  (state) => state.synchronizationStatus?.accessStatus?.accessGranted,
);
export const selectIsConnected = createSelector(selectFkOrgState, (state) => state.synchronizationStatus?.connected);
export const selectIsLoadingConnectionStatus = createSelector(
  selectFkOrgState,
  (state) => state.isLoadingConnectionStatus,
);

export const selectIsDeleteLoading = createSelector(selectFkOrgState, (state) => state.isDeleteLoading);

export const selectSnapshot = createSelector(selectFkOrgState, (state) => state.snapshot);
export const selectIsSynchronizationDialogLoading = createSelector(
  selectFkOrgState,
  (state) => state.isSynchronizationDialogLoading,
);
export const selectHasSnapshotFailed = createSelector(selectFkOrgState, (state) => state.hasSnapshotFailed);

export const selectUpdateConsequences = createSelector(selectFkOrgState, (state) => state.updateConsequences);

export const selectIsLoadingChangelogs = createSelector(selectFkOrgState, (state) => state.isLoadingChangelogs);
export const selectAvailableChangeLogs = createSelector(selectFkOrgState, (state) => state.availableChangelogOptions);
export const selectChangelogDictionary = createSelector(selectFkOrgState, (state) => state.changelogDictionary);

export const selectUserSynchronizationStatus = createSelector(
  selectFkOrgState,
  (state) => state.userSynchronizationStatus,
);
export const selectUserAccessError = createSelector(selectFkOrgState, (state) => state.userAccessError);
export const selectUserAccessGranted = createSelector(
  selectUserSynchronizationStatus,
  (status) => status?.accessStatus?.accessGranted,
);
export const selectIsUserConnected = createSelector(selectUserSynchronizationStatus, (status) => status?.connected);
export const selectCanCreateUserConnection = createSelector(
  selectUserSynchronizationStatus,
  (status) => status?.canCreateConnection,
);
export const selectCanDeleteUserConnection = createSelector(
  selectUserSynchronizationStatus,
  (status) => status?.canDeleteConnection,
);
export const selectIsLoadingUserConnectionStatus = createSelector(
  selectFkOrgState,
  (state) => state.isLoadingUserConnectionStatus,
);
export const selectHasUserConnectionStatusFailed = createSelector(
  selectFkOrgState,
  (state) => state.hasUserConnectionStatusFailed,
);
export const selectIsUserConnectionActionLoading = createSelector(
  selectFkOrgState,
  (state) => state.isUserConnectionActionLoading,
);
