import { createActionGroup, emptyProps } from '@ngrx/store';

export const UserNotificationActions = createActionGroup({
  source: 'UserNotification',
  events: {
    'Get notifications': emptyProps(),
    'Get notifications success': (notifications: object[]) => ({ notifications }),
    'Get notifications error': emptyProps(),
  },
});
