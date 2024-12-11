import { createSelector } from '@ngrx/store';
import {
  contractNotificationsAdapter,
  dprNotificationsAdapter,
  notificationFeature,
  systemNotificationsAdapter,
} from './reducer';

const { selectUserNotificationsState } = notificationFeature;

import { NotificationState } from './state';
import { APINotificationResponseDTO } from 'src/app/api/v2';

const { selectAll: selectAllUsageNotifications } = systemNotificationsAdapter.getSelectors<NotificationState>(
  (state) => state.usageNotifications
);

const { selectAll: selectAllContractNotifications } = contractNotificationsAdapter.getSelectors<NotificationState>(
  (state) => state.contractNotifications
);

const { selectAll: selectAllDprNotifications } = dprNotificationsAdapter.getSelectors<NotificationState>(
  (state) => state.dataProcessingNotifications
);

// A selector factory that returns a selector based on the notification type
export function selectNotificationsByType(type: APINotificationResponseDTO.OwnerResourceTypeEnum) {
  return createSelector(selectUserNotificationsState, (state: NotificationState) => {
    switch (type) {
      case 'ItSystemUsage':
        return selectAllUsageNotifications(state);
      case 'ItContract':
        return selectAllContractNotifications(state);
      case 'DataProcessingRegistration':
        return selectAllDprNotifications(state);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  });
}
