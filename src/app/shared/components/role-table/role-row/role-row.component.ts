import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[role-row]',
  templateUrl: './role-row.component.html',
  styleUrl: './role-row.component.scss',
  standalone: false,
})
export class RoleRowComponent {
  @Input() role!: RoleAssignment;
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;

  @Output() removeRole = new EventEmitter<RoleAssignment>();
  @Output() editRole = new EventEmitter<RoleAssignment>();

  public onRemoveClick(): void {
    this.removeRole.emit(this.role);
  }

  public onEditClick(): void {
    this.editRole.emit(this.role);
  }
}
