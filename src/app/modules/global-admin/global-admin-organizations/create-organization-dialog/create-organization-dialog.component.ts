import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganizationType, organizationTypeOptions } from 'src/app/shared/models/organization/organization.model';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrl: './create-organization-dialog.component.scss'
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

  public onCreateOrganization(): void {

  }

  public onCancel(): void {
  }
}
