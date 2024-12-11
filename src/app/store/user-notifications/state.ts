import { EntityState } from '@ngrx/entity';
import { APINotificationResponseDTO, APIRecipientResponseDTO } from 'src/app/api/v2';

export interface NotificationState {
  usageNotifications: EntityState<UserNotification>;
  contractNotifications: EntityState<UserNotification>;
  dataProcessingNotifications: EntityState<UserNotification>;
  cacheTime: {
    [key in APINotificationResponseDTO.OwnerResourceTypeEnum]?: number;
  };
}

export interface UserNotification extends APINotificationResponseDTO {
  uuid: string;
  receiversCsv: string;
  cCsCsv: string;
}

export function adaptUserNotification(notification: APINotificationResponseDTO): UserNotification {
  if (!notification.uuid) throw new Error('Notification must have a uuid');
  return {
    ...notification,
    uuid: notification.uuid ?? '',
    name: notification.name ?? $localize`Ikke angivet`,
    receiversCsv: adaptRecipentsToCsv(notification.receivers),
    cCsCsv: adaptRecipentsToCsv(notification.cCs),
  };
}

function adaptRecipentsToCsv(recipients: APIRecipientResponseDTO | undefined): string {
  if (!recipients) return '';
  return (
    recipients.emailRecipients?.map((x) => x.email).join(', ') ??
    '' + recipients.roleRecipients?.map((x) => x.role).join(', ')
  );
}
