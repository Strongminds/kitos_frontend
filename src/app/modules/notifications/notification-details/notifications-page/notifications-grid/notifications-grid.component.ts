import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { selectAllNotifications } from 'src/app/store/user-notifications/selectors';

@Component({
  selector: 'app-notifications-grid',
  templateUrl: './notifications-grid.component.html',
  styleUrl: './notifications-grid.component.scss',
})
export class NotificationsGridComponent {
  @Input() entityType!: RegistrationEntityTypes;

  public readonly notifications = this.store.select(selectAllNotifications);

  constructor(private store: Store) {}
}
