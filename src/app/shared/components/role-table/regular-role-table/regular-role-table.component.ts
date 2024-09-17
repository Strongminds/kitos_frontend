import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  selector: 'app-regular-role-table',
  templateUrl: './regular-role-table.component.html',
  styleUrl: './regular-role-table.component.scss',
})
export class RegularRoleTableComponent {
  @Input() roles!: IRoleAssignment[];
  @Input() rolesDictionary!: Dictionary<APIRoleOptionResponseDTO | undefined>;
  @Input() hasModifyPermission!: boolean;
  @Input() entityName!: string;

  @Output() removeClicked = new EventEmitter<IRoleAssignment>();

  public onRemoveClicked(role: IRoleAssignment): void {
    this.removeClicked.emit(role);
  }
}
