import { createSelector } from '@ngrx/store';
import { notificationFeature, notificationsAdapter } from './reducer';

const { selectUserNotificationsState } = notificationFeature;

export const selectAllNotifications = createSelector(
  selectUserNotificationsState,
  notificationsAdapter.getSelectors().selectAll
);
