import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppPath } from 'src/app/shared/enums/app-path';
import { selectAllAlertCount } from 'src/app/store/alerts/selectors';

@Component({
  selector: 'app-notifications-button',
  templateUrl: './notifications-button.component.html',
  styleUrl: './notifications-button.component.scss',
})
export class NotificationsButtonComponent {
  public readonly alertsCount$ = this.store.select(selectAllAlertCount);

  constructor(private store: Store, private router: Router) {}

  public navigateToNotifications() {
    console.log('Navigating to notifications');
    const currentRoute = this.router.url;
    console.log('Current route:', currentRoute);
    if (currentRoute.replaceAll('/', '').startsWith(AppPath.itSystems)) {
      this.router.navigate([`${AppPath.notifications}/${AppPath.itSystems}`]);
      return;
    }
    if (currentRoute.replaceAll('/', '').startsWith(AppPath.itContracts)) {
      this.router.navigate([`${AppPath.notifications}/${AppPath.itContracts}`]);
      return;
    }
    if (currentRoute.replaceAll('/', '').startsWith(AppPath.dataProcessing)) {
      this.router.navigate([`${AppPath.notifications}/${AppPath.dataProcessing}`]);
      return;
    }
    this.router.navigate([AppPath.notifications]);
  }
}
