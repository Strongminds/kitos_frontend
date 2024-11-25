import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, combineLatestWith, filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { APIUserResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectUIRootConfig } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasMultipleOrganizations, selectOrganizationName, selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';
import { UIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

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

  constructor(private store: Store, private dialog: MatDialog, private router: Router, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(UserActions.resetOnOrganizationUpdate),
          withLatestFrom(this.user$, this.uiRootConfig$)
        )
        .subscribe(([_, user, uiRootConfig]) => {
          const userDefaultStartPage = user?.defaultStartPage;
          if (!userDefaultStartPage || this.userDefaultStartPageDisabledInOrganization(userDefaultStartPage, uiRootConfig)) return;
          this.navigateToUserDefaultStartPage(userDefaultStartPage);
        })
    );

    this.subscriptions.add(
      combineLatest([this.user$, this.router.events])
        .pipe(
          filter(([user, event]) => user !== undefined && event instanceof NavigationEnd),
          tap(() => this.store.dispatch(OrganizationActions.getUIRootConfig()))
        )
        .subscribe()
    );
  }

  private userDefaultStartPageDisabledInOrganization(userDefaultStartPage: StartPreferenceChoice, uiRootConfig: UIRootConfig): boolean {
    const startPageValue = userDefaultStartPage.value;
    switch (startPageValue){
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog:
        return !uiRootConfig.showItSystemModule;
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
        return '';
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
