import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIOrganizationResponseDTO, APIUserReferenceResponseDTO } from 'src/app/api/v2';

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

  constructor(private dialogRef: MatDialogRef<CreateLocalAdminDialogComponent>) {}

  public close(): void {
    this.dialogRef.close();
  }

  public addLocalAdmin(): void {
    const formValue = this.formGroup.value;
    const user = formValue.user;
    const organization = formValue.organization;
    console.log('User', user);
    console.log('Organization', organization);
  }
}
