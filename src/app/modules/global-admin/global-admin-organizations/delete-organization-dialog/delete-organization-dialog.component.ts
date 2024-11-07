import { Component, Input } from '@angular/core';
import { Organization } from 'src/app/shared/models/organization/organization.model';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './delete-organization-dialog.component.html',
  styleUrl: './delete-organization-dialog.component.scss'
})
export class DeleteOrganizationDialogComponent {
  @Input() public organization!: Organization;
}
