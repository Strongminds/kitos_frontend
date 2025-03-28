import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { KITOS_MARKETING_PAGE_URL } from 'src/app/shared/constants/constants';
import { AppPath } from 'src/app/shared/enums/app-path';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectIsAuthenticating, selectUser } from 'src/app/store/user-store/selectors';
import { FrontpageComponentStore } from './frontpage.component-store';
import { PublicMessageConfig } from './public-message/public-message.component';

@Component({
  templateUrl: 'frontpage.component.html',
  styleUrls: ['frontpage.component.scss'],
})
export class FrontpageComponent extends BaseComponent implements OnInit {
  public readonly loading$ = this.frontpageComponentStore.loading$;
  public readonly publicMessages$ = this.frontpageComponentStore.publicMessages$;

  public readonly messageConfigs: PublicMessageConfig[] = (
    [
      { iconType: 'clipboard' },
      { iconType: 'document' },
      { iconType: 'settings' },
      { iconType: 'calendar' },
      { iconType: 'multiple-users' },
      { iconType: 'mail' },
    ] as const
  ).map((config, index) => ({
    ...config,
    index,
  }));

  public readonly user$ = this.store.select(selectUser);
  public readonly isAuthenticating$ = this.store.select(selectIsAuthenticating);
  public isAuthenticated$ = this.store.select(selectUser).pipe(map((user) => !!user));

  constructor(
    private frontpageComponentStore: FrontpageComponentStore,
    private store: Store,
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(UserActions.resetOnOrganizationUpdate), first()).subscribe(() => {
        //StartupGuardService and AppGuardService have to use different methods of including the returnUrl query parameter
        //Because of that we have to check if returnUrl is an array or not
        let returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? [AppPath.root];
        returnUrl = Array.isArray(returnUrl) ? returnUrl[0] : returnUrl;
        if (returnUrl && returnUrl !== '' && returnUrl !== AppPath.root) {
          this.router.navigate([returnUrl]);
        }
      })
    );
    this.frontpageComponentStore.getText();

    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.frontpageComponentStore.getText();
      })
    );
  }

  public goToMarketingPage(): void {
    window.open(KITOS_MARKETING_PAGE_URL, '_blank');
  }
}
