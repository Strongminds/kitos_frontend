import { createEntityAdapter } from '@ngrx/entity';
import { NotificationState, UserNotification } from './state';
import { createFeature, createReducer } from '@ngrx/store';

export const notificationsAdapter = createEntityAdapter<UserNotification>();

export const initialNotificationsState: NotificationState = notificationsAdapter.getInitialState({});

export const notificationFeature = createFeature({
  name: 'userNotifications',
  reducer: createReducer(initialNotificationsState),
});
