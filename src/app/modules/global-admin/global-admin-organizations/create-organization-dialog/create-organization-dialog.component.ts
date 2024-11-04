import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { OrganizationType, organizationTypeOptions } from 'src/app/shared/models/organization/organization.model';
import { OrganizationActions } from 'src/app/store/organization/actions';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrl: './create-organization-dialog.component.scss',
})
export class CreateOrganizationDialogComponent {
  public readonly organizationTypeOptions = organizationTypeOptions;
  public readonly defaultOrganizationType = organizationTypeOptions[0];
  public formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    cvr: new FormControl<string | undefined>(undefined),
    organizationType: new FormControl<OrganizationType>(this.defaultOrganizationType, Validators.required),
    foreignCvr: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateOrganizationDialogComponent>,
    private store: Store,
    private actions$: Actions
  ) {}

  public onCreateOrganization(): void {
    this.actions$.pipe(ofType(OrganizationActions.patchOrganizationSuccess), first()).subscribe(() => {
      this.onCancel();
    });

    const request = this.getRequest();
    this.store.dispatch(OrganizationActions.patchOrganization({ request }));
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private getRequest(): object {
    const formValue = this.formGroup.value;
    return {
      name: formValue.name ?? undefined,
      cvr: formValue.cvr ?? undefined,
      organizationType: formValue.organizationType?.value ?? undefined,
      foreignCvr: formValue.foreignCvr ?? undefined,
    };
  }
}
