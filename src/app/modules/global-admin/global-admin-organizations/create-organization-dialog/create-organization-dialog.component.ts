import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIOrganizationCreateRequestDTO } from 'src/app/api/v2';
import { mapOrgTypeToDtoType } from 'src/app/shared/helpers/organization-type.helpers';
import {
  defaultOrganizationType,
  OrganizationType,
  organizationTypeOptions,
} from 'src/app/shared/models/organization/organization.model';
import { cvrValidator } from 'src/app/shared/validators/cvr.validator';
import { OrganizationActions } from 'src/app/store/organization/actions';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrl: './create-organization-dialog.component.scss',
})
export class CreateOrganizationDialogComponent {
  public readonly organizationTypeOptions = organizationTypeOptions;
  public formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    cvr: new FormControl<string | undefined>(undefined, cvrValidator()),
    organizationType: new FormControl<OrganizationType>(defaultOrganizationType, Validators.required),
    foreignCvr: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateOrganizationDialogComponent>,
    private store: Store,
    private actions$: Actions
  ) {}

  public onCreateOrganization(): void {
    this.actions$.pipe(ofType(OrganizationActions.createOrganizationSuccess), first()).subscribe(() => {
      this.onCancel();
    });

    const request = this.getRequest();
    this.store.dispatch(OrganizationActions.createOrganization(request));
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private getRequest(): APIOrganizationCreateRequestDTO {
    const formValue = this.formGroup.value;
    const type = formValue.organizationType ? formValue.organizationType : defaultOrganizationType;
    return {
      name: formValue.name ?? '',
      cvr: formValue.cvr ?? undefined,
      type: mapOrgTypeToDtoType(type.value),
      foreignCvr: formValue.foreignCvr ?? undefined,
    };
  }
}
