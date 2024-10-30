import { Component } from '@angular/core';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-global-admin',
  templateUrl: './global-admin.component.html',
  styleUrl: './global-admin.component.scss'
})
export class GlobalAdminComponent {
  public readonly globalAdminNavigationItems: NavigationDrawerItem[] = [
    {
      label: 'Organisationer',
      iconType: 'organization',
      route: AppPath.organization
    }
  ];
}
