import { Component, Input } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

enum NotificationSegmentType {
  Notifications = 'notifications',
  Alerts = 'alerts',
}

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent {
  @Input() entityType!: RegistrationEntityTypes;

  public selectedSegment = NotificationSegmentType.Notifications;
  public readonly notificationSegmenType = NotificationSegmentType;
  public readonly segmentOptions: SegmentButtonOption<NotificationSegmentType>[] = [
    {
      value: NotificationSegmentType.Notifications,
      text: $localize`Notifikationer`,
    },
    {
      value: NotificationSegmentType.Alerts,
      text: $localize`Advarsler`,
    },
  ];
}
