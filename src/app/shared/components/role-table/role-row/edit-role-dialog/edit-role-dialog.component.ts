import { Component, Input } from '@angular/core';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.scss',
  standalone: false,
})
export class EditRoleDialogComponent {
  @Input() public roleType!: RoleOptionTypes;
  @Input() public initialValue!: IRoleAssignment;
}
