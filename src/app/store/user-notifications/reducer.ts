import { createEntityAdapter } from '@ngrx/entity';
import { NotificationState, UserNotification } from './state';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UserNotificationActions } from './actions';

export const systemNotificationsAdapter = createEntityAdapter<UserNotification>({
  selectId: (notification) => notification.uuid,
});
export const contractNotificationsAdapter = createEntityAdapter<UserNotification>({
  selectId: (notification) => notification.uuid,
});
export const dprNotificationsAdapter = createEntityAdapter<UserNotification>({
  selectId: (notification) => notification.uuid,
});

export const initialNotificationsState: NotificationState = {
  usageNotifications: systemNotificationsAdapter.getInitialState(),
  contractNotifications: contractNotificationsAdapter.getInitialState(),
  dataProcessingNotifications: dprNotificationsAdapter.getInitialState(),
};

export const notificationFeature = createFeature({
  name: 'userNotifications',
  reducer: createReducer(
    initialNotificationsState,
    on(UserNotificationActions.getNotificationsSuccess, (state, { ownerResourceType, notifications }) => {
      switch (ownerResourceType) {
        case 'ItSystemUsage':
          return {
            ...state,
            usageNotifications: systemNotificationsAdapter.setAll(notifications, state.usageNotifications),
          };
        case 'ItContract':
          return {
            ...state,
            contractNotifications: contractNotificationsAdapter.setAll(notifications, state.contractNotifications),
          };
        case 'DataProcessingRegistration':
          return {
            ...state,
            dataProcessingNotifications: dprNotificationsAdapter.setAll(
              notifications,
              state.dataProcessingNotifications
            ),
          };
        default:
          return state;
      }
    })
  ),
});
