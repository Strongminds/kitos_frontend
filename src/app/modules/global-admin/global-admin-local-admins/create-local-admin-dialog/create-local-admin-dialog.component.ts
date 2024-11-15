import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIOrganizationResponseDTO, APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';

@Component({
  selector: 'app-create-local-admin-dialog',
  templateUrl: './create-local-admin-dialog.component.html',
  styleUrl: './create-local-admin-dialog.component.scss',
})
export class CreateLocalAdminDialogComponent {
  public formGroup: FormGroup = new FormGroup({
    user: new FormControl<APIUserReferenceResponseDTO | undefined>(undefined, Validators.required),
    organization: new FormControl<APIOrganizationResponseDTO | undefined>(undefined, Validators.required),
  });

  constructor(private dialogRef: MatDialogRef<CreateLocalAdminDialogComponent>, private store: Store) {}

  public close(): void {
    this.dialogRef.close();
  }

  public addLocalAdmin(): void {
    const formValue = this.formGroup.value;
    const userUuid = formValue.user.uuid;
    const organizationUuid = formValue.organization.uuid;
    this.store.dispatch(LocalAdminUserActions.addLocalAdmin(organizationUuid, userUuid));
  }
}
