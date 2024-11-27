import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, filter, tap, withLatestFrom } from 'rxjs';
import { APIUserResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { UIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectUIRootConfig } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasMultipleOrganizations, selectOrganizationName, selectUser, selectUserIsCurrentlyLocalAdmin } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
})
export class NavBarComponent extends BaseComponent implements OnInit {
  public readonly AppPath = AppPath;

  public readonly user$ = this.store.select(selectUser);
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasMultipleOrganizations$ = this.store.select(selectHasMultipleOrganizations);
  public readonly uiRootConfig$ = this.store.select(selectUIRootConfig).pipe(filterNullish());
  public readonly isUserCurrentyLocalAdmin$ = this.store.select(selectUserIsCurrentlyLocalAdmin);

  constructor(private store: Store, private dialog: MatDialog, private router: Router, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.setupUseUserDefaultStartPage();
    this.setupGetUIRootConfigOnNavigation();
  }

  private setupUseUserDefaultStartPage() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.resetOnOrganizationUpdate), withLatestFrom(this.user$, this.uiRootConfig$))
        .subscribe(([_, user, uiRootConfig]) => {
          const userDefaultStartPage = user?.defaultStartPage;
          if (this.shouldGoToUserDefaultStartPage(userDefaultStartPage, uiRootConfig)) this.navigateToUserDefaultStartPage(userDefaultStartPage!);
        })
    );
  }

  private shouldGoToUserDefaultStartPage(userDefaultStartPage: StartPreferenceChoice | undefined, uiRootConfig: UIRootConfig): boolean {
    return this.isOnStartPage() &&
      userDefaultStartPage !== undefined &&
      !this.userDefaultStartPageDisabledInOrganization(userDefaultStartPage, uiRootConfig);
  }

  private isOnStartPage(): boolean {
    return this.router.url.replace('/', '') === AppPath.root;
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

  private userDefaultStartPageDisabledInOrganization(
    userDefaultStartPage: StartPreferenceChoice,
    uiRootConfig: UIRootConfig
  ): boolean {
    const startPageValue = userDefaultStartPage.value;
    switch (startPageValue) {
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog:
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemUsage:
        return !uiRootConfig.showItSystemModule;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract:
        return !uiRootConfig.showItContractModule;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.DataProcessing:
        return !uiRootConfig.showDataProcessing;
      default:
        return false;
    }
  }

  private navigateToUserDefaultStartPage(userDefaultStartPage: StartPreferenceChoice) {
    const path = this.getUserDefaultStartPagePath(userDefaultStartPage);
    this.router.navigate([path]);
  }

  private getUserDefaultStartPagePath(userDefaultStartPage: StartPreferenceChoice): string {
    const startPageValue = userDefaultStartPage.value;
    switch (startPageValue) {
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.StartSite:
        return AppPath.root;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.Organization:
        return `${AppPath.organization}/${AppPath.structure}`;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog:
        return `${AppPath.itSystems}/${AppPath.itSystemCatalog}`;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemUsage:
        return `${AppPath.itSystems}/${AppPath.itSystemUsages}`;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract:
        return AppPath.itContracts;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.DataProcessing:
        return AppPath.dataProcessing;
      default:
        throw new Error(`Unknown start page: ${startPageValue}`);
    }
  }

  public showOrganizationDialog() {
    this.dialog.open(ChooseOrganizationComponent);
  }

  public goToOldKitos() {
    window.location.href = '/';
  }

  public logout() {
    this.store.dispatch(UserActions.logout());
  }
}
