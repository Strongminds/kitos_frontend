import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ScrollbarDialogComponent } from '../../../../shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { AppDatePipe } from '../../../../shared/pipes/app-date.pipe';
import { UserRoleTableComponent } from './user-role-table/user-role-table.component';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
  imports: [
    NgIf,
    ScrollbarDialogComponent,
    StandardVerticalContentGridComponent,
    UserRoleTableComponent,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    TrashcanIconComponent,
    AsyncPipe,
    AppDatePipe,
  ],
})
export class UserInfoDialogComponent extends BaseComponent implements OnInit {
  @Input() user$!: Observable<ODataOrganizationUser>;
  @Input() hasModificationPermission$!: Observable<boolean | undefined>;

  public $sendingNotification = new BehaviorSubject(false);

  public readonly unitRoles$ = this.store.select(selectRoleOptionTypes('organization-unit')).pipe(filterNullish());
  public readonly contractRoles$ = this.store.select(selectRoleOptionTypes('it-contract')).pipe(filterNullish());
  public readonly usageRoles$ = this.store.select(selectRoleOptionTypes('it-system-usage')).pipe(filterNullish());
  public readonly dprRoles$ = this.store.select(selectRoleOptionTypes('data-processing')).pipe(filterNullish());

  constructor(
    private store: Store,
    private dialogOpenerService: DialogOpenerService,
    private dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RoleOptionTypeActions.getOptions('data-processing'));
    this.store.dispatch(RoleOptionTypeActions.getOptions('it-contract'));
    this.store.dispatch(RoleOptionTypeActions.getOptions('it-system-usage'));
    this.store.dispatch(RoleOptionTypeActions.getOptions('organization-unit'));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.sendNotificationSuccess))
        .subscribe(() => this.$sendingNotification.next(false))
    );
  }

  public onDeleteUser(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );

    this.dialogOpenerService.openDeleteUserDialog(this.user$, true);
  }

  public onEditUser(user: ODataOrganizationUser): void {
    this.dialogOpenerService.openEditUserDialog(user, true);
  }

  public onSendAdvis(user: ODataOrganizationUser): void {
    this.$sendingNotification.next(true);
    this.store.dispatch(OrganizationUserActions.sendNotification(user.Uuid));
  }

  public getFullName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }
}
