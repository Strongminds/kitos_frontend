import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap, takeUntil } from 'rxjs';
import { UsersInternalV2Service } from 'src/app/api/v2';
import { ArchiveSystemUsageDialogComponent } from 'src/app/modules/it-systems/shared/archive-system-usage-dialog/archive-system-usage-dialog.component';
import { DeleteUserDialogComponent } from 'src/app/modules/organization/organization-users/delete-user-dialog/delete-user-dialog.component';
import { UserDeletionReview, UserDeletionReviewDecision } from 'src/app/modules/organization/organization-users/delete-user-dialog/user-deletion-review.service';
import { EditUserDialogComponent } from 'src/app/modules/organization/organization-users/edit-user-dialog/edit-user-dialog.component';
import { BulkActionDialogComponent, BulkActionResult, BulkActionSection } from '../components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { IconConfirmationDialogComponent } from '../components/dialogs/icon-confirmation-dialog/icon-confirmation-dialog.component';
import { GlobalOptionTypeDialogComponent } from '../components/global-option-type-view/global-option-type-dialog/global-option-type-dialog.component';
import { MAX_DIALOG_HEIGHT } from '../constants/constants';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';
import { ODataOrganizationUser } from '../models/organization/organization-user/organization-user.model';
import { SupplierContractsDialogComponent } from 'src/app/modules/it-contracts/it-contract-supplier/supplier-contracts-dialog/supplier-contracts-dialog.component';
import { SupplierContract } from '../models/it-contract/it-contract-supplier.model';
import { getUserRoleSelectionDialogSections } from '../helpers/bulk-action.helpers';
import { getRoleActionRequest } from '../helpers/user-role.helpers';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';

type UserRoleTransferDialogRef = MatDialogRef<BulkActionDialogComponent<{ uuid: string }>>;

export const defaultDialogMaxSize = {
  height: 'auto',
  minWidth: '600px',
  maxWidth: '800px',
  maxHeight: '90vh%',
};

type TakeSystemOutOfUseDialogOptions = {
  organizationName?: string;
  extraAction?: () => void;
};

@Injectable({
  providedIn: 'root',
})
// This service is useful if you need to open the same or similar dialogs multiple places, which need setup/configuration.
export class DialogOpenerService {
  constructor(
    private dialog: MatDialog,
    private readonly usersApi: UsersInternalV2Service,
    private readonly store: Store,
  ) {}

  public openSupplierContractsDialog(supplierName: string, contracts: SupplierContract[]): MatDialogRef<SupplierContractsDialogComponent>{
    const dialogRef = this.dialog.open(SupplierContractsDialogComponent);
    dialogRef.componentInstance.supplierName = supplierName;
    dialogRef.componentInstance.contracts = contracts;
    return dialogRef;
  }

  public openEditUserDialog(
    user: ODataOrganizationUser,
    nested: boolean,
    isGlobalAdmin: boolean,
  ): MatDialogRef<EditUserDialogComponent> {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      height: isGlobalAdmin ? '95%' : 'auto',
      maxHeight: MAX_DIALOG_HEIGHT,
    });
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.isNested = nested;
    return dialogRef;
  }

  public openDeleteUserDialog(
    user$: Observable<ODataOrganizationUser>,
    nested: boolean,
  ): MatDialogRef<DeleteUserDialogComponent> {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, defaultDialogMaxSize);
    dialogRef.componentInstance.user$ = user$;
    dialogRef.componentInstance.nested = nested;
    return dialogRef;
  }

  public openUserDeletionReview(review: UserDeletionReview) {
    const dialogRef = this.dialog.open<DeleteUserDialogComponent, never, UserDeletionReviewDecision>(
      DeleteUserDialogComponent, { ...defaultDialogMaxSize, ariaLabel: $localize`Slet bruger` },
    );
    dialogRef.componentInstance.review = review;
    return dialogRef;
  }

  public openDeletionReviewRoleTransfer(review: UserDeletionReview): UserRoleTransferDialogRef | undefined {
    const state = review.state$.value;
    if (state.status !== 'ready' || !state.hasRoles) return;

    const ready$ = review.state$.pipe(filter((value) => value.status === 'ready'));
    const sections = getUserRoleSelectionDialogSections(
      ready$.pipe(map((value) => value.user)),
      ready$.pipe(map((value) => value.options.units)),
      ready$.pipe(map((value) => value.options.contracts)),
      ready$.pipe(map((value) => value.options.systems)),
      ready$.pipe(map((value) => value.options.dataProcessing)),
    );
    const dialogRef = this.openUserRoleTransferDialog(state.user, sections, (result, ref) =>
      this.transferReviewedRoles(review, state.user, result, ref),
    );
    dialogRef.componentInstance.title = $localize`Overfør roller for ${state.user.Name}`;
    dialogRef.componentInstance.lockWhileLoading = true;
    return dialogRef;
  }

  private transferReviewedRoles(
    review: UserDeletionReview,
    user: ODataOrganizationUser,
    result: BulkActionResult,
    dialogRef: UserRoleTransferDialogRef,
  ): void {
    const recipientUuid = result.selectedEntityId;
    if (!recipientUuid) throw new Error('Selected entity ID is undefined');

    this.usersApi.postSingleUsersInternalV2TransferRoles({
      organizationUuid: review.organizationUuid,
      fromUserUuid: user.Uuid,
      toUserUuid: recipientUuid,
      aPIMutateUserRightsRequestDTO: getRoleActionRequest(result, user),
    }).pipe(
      switchMap(() => review.reload()),
      takeUntil(dialogRef.beforeClosed()),
    ).subscribe({
      next: (state) => {
        this.store.dispatch(OrganizationUserActions.transferRolesSuccess());
        if (state.status !== 'ready' || !state.hasRoles) dialogRef.close();
      },
      error: () => this.store.dispatch(OrganizationUserActions.transferRolesError()),
    });
  }

  public openTakeSystemOutOfUseDialog(
    options: TakeSystemOutOfUseDialogOptions = {},
  ): MatDialogRef<IconConfirmationDialogComponent> {
    const { organizationName, extraAction } = options;
    const dialogRef = this.dialog.open(IconConfirmationDialogComponent);
    const confirmationDialogInstance = dialogRef.componentInstance as IconConfirmationDialogComponent;
    confirmationDialogInstance.confirmationType = 'Custom';
    confirmationDialogInstance.title = $localize`Er du sikker på, at du vil fjerne den lokale anvendelse af systemet?`;
    const baseBodyText = $localize`Tryk "Bekræft" for at slette de lokale registreringer vedrørende systemet i ${organizationName ?? 'kommunen'}.`;
    const archiveBodyText =
      baseBodyText +
      $localize` \n Tryk "Bevar historik" for at slette de lokale registreringer og udfylde arkivinformation om systemanvendelsen.
    \n Disse handlinger påvirker ikke stamdata om systemet i IT System Kataloget.`;
    confirmationDialogInstance.bodyText = extraAction ? archiveBodyText : baseBodyText;
    confirmationDialogInstance.icon = 'not-in-use';
    confirmationDialogInstance.confirmColor = 'warn';
    confirmationDialogInstance.customConfirmText = $localize`Bekræft`;
    confirmationDialogInstance.customDeclineText = $localize`Fortryd`;
    if (extraAction) {
      confirmationDialogInstance.hasExtraAction = true;
      const extraActionSubscription = confirmationDialogInstance.extraActionClick.subscribe(() => extraAction());
      dialogRef.afterClosed().subscribe(() => {
        extraActionSubscription.unsubscribe();
      });
      confirmationDialogInstance.extraActionText = $localize`Bevar historik`;
    }

    return dialogRef;
  }

  public openArchiveSystemUsageDialog(itSystemUsageUuid: string): MatDialogRef<ArchiveSystemUsageDialogComponent> {
    const dialogRef = this.dialog.open(ArchiveSystemUsageDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.itSystemUsageUuid = itSystemUsageUuid;
    return dialogRef;
  }

  public openTakeSystemIntoUseDialog(): MatDialogRef<IconConfirmationDialogComponent> {
    const dialogRef = this.dialog.open(IconConfirmationDialogComponent);
    const confirmationDialogInstance = dialogRef.componentInstance as IconConfirmationDialogComponent;
    confirmationDialogInstance.confirmationType = 'Custom';
    confirmationDialogInstance.title = $localize`Tag system i anvendelse`;
    confirmationDialogInstance.bodyText = $localize`Hvis du ønsker at tage systemet i anvendelse, skal du bekræfte og udfylde information, som er relevant for din kommune nu eller senere under IT systemer.`;
    confirmationDialogInstance.icon = 'take-into-use';
    confirmationDialogInstance.confirmColor = 'primary';
    confirmationDialogInstance.customConfirmText = $localize`Bekræft og udfyld nu`;
    confirmationDialogInstance.customDeclineText = $localize`Bekræft og udfyld senere`;

    return dialogRef;
  }

  public openGlobalOptionTypeDialog(optionType: GlobalAdminOptionType): GlobalOptionTypeDialogComponent {
    const dialogRef = this.dialog.open(GlobalOptionTypeDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.optionType = optionType;
    return componentInstance;
  }

  public openBulkActionDialog() {
    return this.dialog.open(BulkActionDialogComponent, { ...defaultDialogMaxSize, width: '50%' });
  }

  public openUserRoleSelectionDialog(user: ODataOrganizationUser) {
    const dialogRef = this.openBulkActionDialog();

    const instance = dialogRef.componentInstance;
    instance.dropdownDisabledUuids$ = of([user.Uuid]);
    instance.dropdownType = 'user';
    instance.emptyStateText = $localize`Brugeren har ingen roller`;
    instance.snackbarText = $localize`Vælg handling for valgte roller`;
    return dialogRef;
  }

  public openUserRoleTransferDialog(
    user: ODataOrganizationUser,
    sections: BulkActionSection[],
    transfer: (result: BulkActionResult, dialogRef: UserRoleTransferDialogRef) => void,
  ): UserRoleTransferDialogRef {
    const dialogRef = this.openUserRoleSelectionDialog(user);
    const instance = dialogRef.componentInstance;
    instance.title = $localize`Overfør roller`;
    instance.dropdownTitle = $localize`Overfør roller til`;
    instance.successActionTypes = OrganizationUserActions.transferRolesSuccess;
    instance.errorActionTypes = OrganizationUserActions.transferRolesError;
    instance.sections = sections;
    instance.actionButtons = [{
      text: $localize`Overfør roller`,
      color: 'secondary',
      buttonStyle: 'secondary',
      callback: (result) => transfer(result, dialogRef),
    }];
    return dialogRef;
  }
}
