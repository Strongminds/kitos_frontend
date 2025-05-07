import { createSelector, MemoizedSelector } from "@ngrx/store";
import { hasValidTwoMinuteCache } from "./date.helpers";

export interface HasPermissionsAndCollectionPermissions {
  permissions: any;
  collectionPermissions: any;
}

export function createHasValidPermissionsCacheSelector<T extends HasPermissionsAndCollectionPermissions>(
  stateSelector: MemoizedSelector<Record<string, any>, T, (featureState: T) => T>
) {
  return createSelector(
    stateSelector,
    () => new Date(),
    (state, now) => {
      return hasValidTwoMinuteCache(state.permissions?.cacheTime, now);
    }
  );
}