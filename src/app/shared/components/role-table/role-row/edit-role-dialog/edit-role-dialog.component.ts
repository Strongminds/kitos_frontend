import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.scss',
  standalone: false,
})
export class EditRoleDialogComponent implements OnInit {
  @Input() public roleType!: RoleOptionTypes;
  @Input() public initialValue!: RoleAssignment;
  @Input() public entityUuid!: string;

  public readonly formGroup = new FormGroup({
    role: new FormControl<APIRegularOptionResponseDTO | undefined>(undefined, Validators.required),
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private readonly roleOptionService: RoleOptionTypeService
  ) {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      role: { ...this.initialValue.assignment.role, description: '' }, //The description value in the form is not used
      user: this.initialValue.assignment.user,
    });
  }

  public onSave(): void {
    const formControls = this.formGroup.controls;
    const user = formControls.user.value;
    const role = formControls.role.value;
    if (!user || !role) throw new Error('User or role is undefined');

    this.roleOptionService.dispatchRemoveEntityRoleAction(this.initialValue, this.roleType);
    this.roleOptionService.dispatchAddEntityRoleAction([user.uuid], role.uuid, this.roleType);

    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public canSave(): boolean {
    var hasChanges =
      this.initialValue.assignment.role.uuid !== this.formGroup.controls.role.value?.uuid ||
      this.initialValue.assignment.user.uuid !== this.formGroup.controls.user.value?.uuid;
    return hasChanges && this.formGroup.valid;
  }
}
