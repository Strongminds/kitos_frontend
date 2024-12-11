import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.scss',
})
export class NotificationDetailsComponent {
  public readonly navItems: NavigationDrawerItem[] = [
    {
      label: $localize`IT System`,
      iconType: 'systems',
      route: AppPath.itSystemUsages,
    },
    {
      label: $localize`IT Kontrakt`,
      iconType: 'clipboard',
      route: AppPath.itContracts,
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
    },
  ];

  constructor(private store: Store) {}
}
