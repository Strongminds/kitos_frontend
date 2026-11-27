import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, filter, first, map, Observable, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  BulkActionDialogComponent,
  BulkActionResult,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { getUserRoleSelectionDialogSections } from 'src/app/shared/helpers/bulk-action.helpers';
import { getRoleActionRequest, userHasAnyAvailableRights } from 'src/app/shared/helpers/user-role.helpers';
import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import {
  type UserDeletionReview,
  UserDeletionReviewDecision,
  UserDeletionReviewStatus,
} from 'src/app/shared/models/organization/organization-user/user-deletion-review.types';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
  providers: [RoleSelectionService],
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    LoadingComponent,
    AsyncPipe
],
})
export class DeleteUserDialogComponent extends BaseComponent implements OnInit {
  @Input() user$!: Observable<ODataOrganizationUser>;
  @Input() nested: boolean = false;
  @Input() review?: UserDeletionReview;
  @ViewChild('reviewCancel') private reviewCancel?: ButtonComponent;
  @ViewChild('reviewTransfer') private reviewTransfer?: ButtonComponent;

  public readonly organizationName$: Observable<string | undefined> = this.store.select(selectOrganizationName);
  public readonly reviewStatus = UserDeletionReviewStatus;
  private readonly availableUnitRoles$ = this.store.select(selectRoleOptionTypes('organization-unit'));
  private readonly availableContractRoles$ = this.store.select(selectRoleOptionTypes('it-contract'));
  private readonly availableUsageRoles$ = this.store.select(selectRoleOptionTypes('it-system-usage'));
  private readonly availableDprRoles$ = this.store.select(selectRoleOptionTypes('data-processing'));

  public hasRoles$!: Observable<boolean>;

  public isLoading: boolean = false;

  constructor(
    private store: Store,
    private confirmActionService: ConfirmActionService,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent, UserDeletionReviewDecision>,
    private openerService: DialogOpenerService,
    private actions$: Actions,
    private roleService: RoleOptionTypeService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.review) {
      if (this.review.state$.value.status === UserDeletionReviewStatus.Loading) {
        this.subscriptions.add(this.review.reload().pipe(takeUntil(this.dialogRef.beforeClosed())).subscribe());
      }
      return;
    }

    this.hasRoles$ = combineLatest([
      this.user$,
      this.availableUnitRoles$,
      this.availableUsageRoles$,
      this.availableContractRoles$,
      this.availableDprRoles$,
    ]).pipe(
      map(([user, unitRoles, usageRoles, contractRoles, dprRoles]) =>
        userHasAnyAvailableRights(user, unitRoles, usageRoles, contractRoles, dprRoles)
      )
    );

    this.roleService.dispatchAllGetAvailableOptions();

    // Probably can be fixed with a better solution
    // Subscription is needed to keep the user$ observable alive
    // Otherwise the transfer dialog is flaky
    // https://os2web.atlassian.net/browse/KITOSUDV-5956
    this.subscriptions.add(this.user$.subscribe());

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserError)).subscribe(() => {
        this.isLoading = false;
      })
    );
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.onClose();
      })
    );
  }

  public completeReview(): void {
    const state = this.review?.state$.value;
    if (state?.status !== UserDeletionReviewStatus.Ready) return;
    this.dialogRef.close(
      state.hasRoles ? UserDeletionReviewDecision.ContinueWithoutRemainingRoles : UserDeletionReviewDecision.Continue,
    );
  }

  public onDeleteUser(user: ODataOrganizationUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.deleteUser(user),
      message: $localize`Er du sikker på, at du vil slette brugeren '${this.getUserName(user)}'?`,
    });
  }

  private deleteUser(user: ODataOrganizationUser): void {
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.deleteUser(user.Uuid));
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public getUserName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }

  public openTransferDialog(user: ODataOrganizationUser): void {
    const sections = getUserRoleSelectionDialogSections(
      this.user$,
      this.availableUnitRoles$,
      this.availableContractRoles$,
      this.availableUsageRoles$,
      this.availableDprRoles$
    );
    this.openerService.openUserRoleTransferDialog(user, sections, (result, dialogRef) =>
      this.transferRoles(result, user, dialogRef),
    );
  }

  public openReviewTransfer(): void {
    if (!this.review) return;
    const dialogRef = this.openerService.openDeletionReviewRoleTransfer(this.review);
    if (!dialogRef) return;

    this.subscriptions.add(this.dialogRef.beforeClosed().pipe(takeUntil(dialogRef.afterClosed())).subscribe(() => dialogRef.close()));
    this.subscriptions.add(
      dialogRef.afterClosed().pipe(takeUntil(this.dialogRef.beforeClosed())).subscribe(() => {
        const state = this.review?.state$.value;
        (state?.status === UserDeletionReviewStatus.Ready && state.hasRoles
          ? this.reviewTransfer
          : this.reviewCancel
        )?.focus();
      }),
    );
  }

  private transferRoles(
    result: BulkActionResult,
    user: ODataOrganizationUser,
    dialogRef: MatDialogRef<BulkActionDialogComponent<{ uuid: string }>>,
  ): void {
    const request = getRoleActionRequest(result, user);

    if (!result.selectedEntityId) {
      throw new Error('Selected entity ID is undefined');
    }
    this.store.dispatch(OrganizationUserActions.transferRoles(user.Uuid, result.selectedEntityId, request));

    this.closeDialogIfNoRightsLeftAfterTransfer(dialogRef);
  }

  private closeDialogIfNoRightsLeftAfterTransfer(dialogRef: MatDialogRef<BulkActionDialogComponent<{ uuid: string }>>) {
    const organizationUnitRights$ = this.user$.pipe(map((user) => user.OrganizationUnitRights));
    const itContractRights$ = this.user$.pipe(map((user) => user.ItContractRights));
    const itSystemRights$ = this.user$.pipe(map((user) => user.ItSystemRights));
    const dprRights$ = this.user$.pipe(map((user) => user.DataProcessingRegistrationRights));

    this.subscriptions.add(
      combineLatest([organizationUnitRights$, itSystemRights$, itContractRights$, dprRights$])
        .pipe(
          filter(([unitRights, systemRights, contractRights, dprRights]) =>
            this.areAnyRightsLeft(unitRights, systemRights, contractRights, dprRights)
          ),
          first()
        )
        .subscribe(() => dialogRef.close())
    );
  }

  private areAnyRightsLeft(
    unitRights: Right[],
    systemRights: Right[],
    contractRights: Right[],
    dprRights: Right[]
  ): boolean {
    return unitRights.length < 1 && systemRights.length < 1 && contractRights.length < 1 && dprRights.length < 1;
  }
}
