import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectAllAlertCount } from 'src/app/store/alerts/selectors';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectUIRootConfig } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
import {
  selectHasMultipleOrganizations,
  selectOrganizationName,
  selectUser,
  selectUserIsCurrentlyLocalAdmin,
} from 'src/app/store/user-store/selectors';
import { LogoutIconComponent } from '../../../shared/components/icons/logout-icon.component';
import { TableIconComponent } from '../../../shared/components/icons/table-icon.component';
import { SpacerComponent } from '../../../shared/components/spacer/spacer.component';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuComponent } from '../menu/menu.component';
import { NotificationsButtonComponent } from '../notifications-button/notifications-button.component';
import { TestEnvironmentRibbonComponent } from '../test-environment-ribbon/test-environment-ribbon.component';
import { EnvironmentService } from 'src/app/shared/services/environment.service';
import { PRODUCTION_ENVIRONMENT } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
  imports: [
    MatToolbar,
    RouterLink,
    NgIf,
    SpacerComponent,
    MenuComponent,
    MenuItemComponent,
    TableIconComponent,
    NotificationsButtonComponent,
    LogoutIconComponent,
    AsyncPipe,
    TestEnvironmentRibbonComponent,
  ],
})
export class NavBarComponent extends BaseComponent implements OnInit {
  public readonly AppPath = AppPath;

  public readonly user$ = this.store.select(selectUser);
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasMultipleOrganizations$ = this.store.select(selectHasMultipleOrganizations);
  public readonly uiRootConfig$ = this.store.select(selectUIRootConfig).pipe(filterNullish());
  public readonly isUserCurrentyLocalAdmin$ = this.store.select(selectUserIsCurrentlyLocalAdmin);

  public readonly alertsCount$ = this.store.select(selectAllAlertCount);

  constructor(private store: Store, private dialog: MatDialog, private router: Router, private environmentService: EnvironmentService) {
    super();
  }

  ngOnInit(): void {
    this.setupGetUIRootConfigOnNavigation();
  }

  public useTestEnvironmentNavBarBackground() {
    return this.environmentService.current.env !== PRODUCTION_ENVIRONMENT;
  }

  private setupGetUIRootConfigOnNavigation() {
    this.subscriptions.add(
      combineLatest([this.user$, this.router.events])
        .pipe(
          filter(([user, event]) => user !== undefined && event instanceof NavigationEnd),
          tap(() => this.store.dispatch(OrganizationActions.getUIRootConfig()))
        )
        .subscribe()
    );
  }

  public showOrganizationDialog() {
    this.dialog.open(ChooseOrganizationComponent);
  }

  public goToOldKitos() {
    window.location.href = '/old';
  }

  public logout() {
    this.store.dispatch(UserActions.logout());
  }
}
