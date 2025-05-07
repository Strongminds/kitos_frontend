import { createSelector } from '@ngrx/store';
import { hasValidTwoMinuteCache } from 'src/app/shared/helpers/date.helpers';
import { organizationUserAdapter, organizationUserFeature } from './reducer';

const { selectOrganizationUserState } = organizationUserFeature;

export const selectAll = createSelector(selectOrganizationUserState, organizationUserAdapter.getSelectors().selectAll);
export const selectTotal = createSelector(selectOrganizationUserState, (state) => state.total);
export const selectOrganizationUserGridLoading = createSelector(
  selectOrganizationUserState,
  (state) => state.isLoadingUsersQuery
);
export const selectOrganizationUserGridState = createSelector(selectOrganizationUserState, (state) => state.gridState);
export const selectPreviousGridState = createSelector(selectOrganizationUserState, (state) => state.previousGridState);
export const selectOrganizationUserGridData = createSelector(selectAll, selectTotal, (data, total) => ({
  data,
  total,
}));
export const selectOrganizationUserGridColumns = createSelector(
  selectOrganizationUserState,
  (state) => state.gridColumns
);

export const selectOrganizationUserByIndex = (index: number) =>
  createSelector(selectAll, (organizationUsers) => organizationUsers[index]);

export const selectOrganizationUserByUuid = (uuid: string) =>
  createSelector(selectAll, (organizationUsers) => organizationUsers.find((user) => user.Uuid === uuid));

export const selectOrganizationUserCreatePermissions = createSelector(
  selectOrganizationUserState,
  (state) => state.permissions?.value?.create
);
export const selectOrganizationUserModifyPermissions = createSelector(
  selectOrganizationUserState,
  (state) => state.permissions?.value?.modify
);
export const selectOrganizationUserDeletePermissions = createSelector(
  selectOrganizationUserState,
  (state) => state.permissions?.value?.delete
);
export const selectHasValidOrganizationUserPermissionsCache = createSelector(
  selectOrganizationUserState,
  () => new Date(),
  (state, now) => {
    return hasValidTwoMinuteCache(state.permissions?.cacheTime, now);
  }
);
export const selectOrganizationUserIsCreateLoading = createSelector(
  selectOrganizationUserState,
  (state) => state.createLoading
);
