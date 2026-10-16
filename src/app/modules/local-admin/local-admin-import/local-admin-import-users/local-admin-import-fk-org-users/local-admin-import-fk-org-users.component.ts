import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { CardHeaderComponent } from 'src/app/shared/components/card-header/card-header.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { AppDatePipe } from 'src/app/shared/pipes/app-date.pipe';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectCanCreateUserConnection,
  selectCanDeleteUserConnection,
  selectHasUserConnectionStatusFailed,
  selectIsLoadingUserConnectionStatus,
  selectIsUserConnected,
  selectIsUserConnectionActionLoading,
  selectUserAccessError,
  selectUserAccessGranted,
  selectUserSynchronizationStatus,
} from 'src/app/store/local-admin/fk-org/selectors';
import { ExternalUserChangesComponent } from '../../external-user-changes/external-user-changes.component';

@Component({
  selector: 'app-local-admin-import-fk-org-users',
  templateUrl: './local-admin-import-fk-org-users.component.html',
  styleUrl: './local-admin-import-fk-org-users.component.scss',
  imports: [
    AsyncPipe,
    AppDatePipe,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    LoadingComponent,
    ParagraphComponent,
    StandardVerticalContentGridComponent,
    ExternalUserChangesComponent,
  ],
})
export class LocalAdminImportFkOrgUsersComponent extends BaseComponent implements OnInit {
  public readonly status$ = this.store.select(selectUserSynchronizationStatus);
  public readonly isLoading$ = this.store.select(selectIsLoadingUserConnectionStatus);
  public readonly hasStatusFailed$ = this.store.select(selectHasUserConnectionStatusFailed);
  public readonly accessGranted$ = this.store.select(selectUserAccessGranted);
  public readonly accessError$ = this.store.select(selectUserAccessError);
  public readonly isConnected$ = this.store.select(selectIsUserConnected);
  public readonly canCreateConnection$ = this.store.select(selectCanCreateUserConnection);
  public readonly canDeleteConnection$ = this.store.select(selectCanDeleteUserConnection);
  public readonly isActionLoading$ = this.store.select(selectIsUserConnectionActionLoading);

  public pendingCount = 0;

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly confirmActionService: ConfirmActionService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadStatus();
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(FkOrgActions.createUserConnectionSuccess, FkOrgActions.deleteUserConnectionSuccess))
        .subscribe(() => this.loadStatus()),
    );
  }

  public get title(): string {
    return this.pendingCount > 0
      ? $localize`Via FK Organisation (${this.pendingCount} afventer)`
      : $localize`Via FK Organisation`;
  }

  public loadStatus(): void {
    this.pendingCount = 0;
    this.store.dispatch(FkOrgActions.getUserSynchronizationStatus());
  }

  public connect(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      title: $localize`Forbind brugere til FK Organisation`,
      message: $localize`KITOS vil herefter modtage sletninger af brugere fra FK Organisation, som skal behandles af en lokal administrator. Vil du fortsætte?`,
      onConfirm: () => this.store.dispatch(FkOrgActions.createUserConnection()),
    });
  }

  public disconnect(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      title: $localize`Bryd forbindelsen til FK Organisation for brugere`,
      message: $localize`KITOS vil herefter ikke modtage brugerændringer fra FK Organisation, og listen over eksterne brugerændringer skjules. Vil du fortsætte?`,
      onConfirm: () => this.store.dispatch(FkOrgActions.deleteUserConnection()),
    });
  }

  public onPendingCountChange(count: number): void {
    this.pendingCount = count;
  }
}
