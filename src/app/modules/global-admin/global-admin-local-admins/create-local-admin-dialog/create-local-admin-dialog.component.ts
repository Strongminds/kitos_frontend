import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first, map } from 'rxjs';
import { APIOrganizationResponseDTO, APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';
import { selectAllLocalAdmins, selectLocalAdminsLoading } from 'src/app/store/global-admin/local-admins/selectors';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { UserDropdownComponent } from '../../../../shared/components/dropdowns/user-dropdown/user-dropdown.component';
import { OrganizationDropdownComponent } from '../../../../shared/components/dropdowns/organization-dropdown/organization-dropdown.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-create-local-admin-dialog',
  templateUrl: './create-local-admin-dialog.component.html',
  styleUrl: './create-local-admin-dialog.component.scss',
  imports: [
    DialogComponent,
    NgIf,
    LoadingComponent,
    StandardVerticalContentGridComponent,
    UserDropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    OrganizationDropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class CreateLocalAdminDialogComponent extends BaseComponent implements OnInit {
  public readonly localAdminOrganizations$ = this.store.select(selectAllLocalAdmins).pipe(
    map((localAdmins) => {
      return localAdmins.reduce((acc: { [key: string]: string[] }, admin) => {
        const userUuid = admin.user.uuid;
        const orgUuid = admin.organization.uuid;
        if (!acc[userUuid]) {
          acc[userUuid] = [];
        }
        acc[userUuid].push(orgUuid);
        return acc;
      }, {});
    }),
  );
  public readonly loading$ = this.store.select(selectLocalAdminsLoading);

  public readonly disabledOrganizationUuids$ = new BehaviorSubject<string[]>([]);

  public formGroup: FormGroup = new FormGroup({
    user: new FormControl<APIUserReferenceResponseDTO | undefined>(undefined, Validators.required),
    organization: new FormControl<APIOrganizationResponseDTO | undefined>(
      { value: undefined, disabled: true },
      Validators.required,
    ),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateLocalAdminDialogComponent>,
    private store: Store,
    private actions$: Actions,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(LocalAdminUserActions.addLocalAdminSuccess)).subscribe(() => {
        this.close();
      }),
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public addLocalAdmin(): void {
    const formValue = this.formGroup.value;
    const userUuid = formValue.user.uuid;
    const organizationUuid = formValue.organization.uuid;
    this.store.dispatch(LocalAdminUserActions.addLocalAdmin(organizationUuid, userUuid));
  }

  public updateDisabledOrganizationUuids(): void {
    const userUuid = this.formGroup.get('user')?.value?.uuid;
    const organizationControl = this.formGroup.get('organization');
    if (!userUuid) {
      this.disabledOrganizationUuids$.next([]);
      organizationControl?.disable();
      return;
    }
    this.localAdminOrganizations$.pipe(first()).subscribe((localAdminOrganizations) => {
      const disabledOrganizationUuids = localAdminOrganizations[userUuid] || [];
      this.disabledOrganizationUuids$.next(disabledOrganizationUuids);
      organizationControl?.enable();
    });
  }
}
