import { createSelector } from '@ngrx/store';
import {
  contractNotificationsAdapter,
  dprNotificationsAdapter,
  notificationFeature,
  systemNotificationsAdapter,
} from './reducer';

const { selectUserNotificationsState } = notificationFeature;

import { APIOwnerResourceType } from 'src/app/api/v2';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { NotificationState } from './state';

const { selectAll: selectAllUsageNotifications } = systemNotificationsAdapter.getSelectors<NotificationState>(
  (state) => state.usageNotifications,
);

const { selectAll: selectAllContractNotifications } = contractNotificationsAdapter.getSelectors<NotificationState>(
  (state) => state.contractNotifications,
);

const { selectAll: selectAllDprNotifications } = dprNotificationsAdapter.getSelectors<NotificationState>(
  (state) => state.dataProcessingNotifications,
);

export const selectHasValidCacheForResourceType = (resourceType: APIOwnerResourceType) =>
  createSelector(
    selectUserNotificationsState,
    () => new Date(),
    (state, time) => {
      const cacheTime = state.cacheTime[resourceType];
      return hasValidCache(cacheTime, time);
    },
  );

// A selector factory that returns a selector based on the notification type
export function selectNotificationsByType(type: APIOwnerResourceType) {
  return createSelector(selectUserNotificationsState, (state: NotificationState) => {
    switch (type) {
      case APIOwnerResourceType.NUMBER_1:
        return selectAllUsageNotifications(state);
      case APIOwnerResourceType.NUMBER_0:
        return selectAllContractNotifications(state);
      case APIOwnerResourceType.NUMBER_2:
        return selectAllDprNotifications(state);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  });
}
