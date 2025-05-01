import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { ShallowUser } from 'src/app/shared/models/userV2.model';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.scss',
  standalone: false,
})
export class EditRoleDialogComponent implements OnInit {
  @Input() public roleType!: RoleOptionTypes;
  @Input() public initialValue!: RoleAssignment;

  public readonly formGroup = new FormGroup({
    role: new FormControl<APIRegularOptionResponseDTO | undefined>(undefined, Validators.required),
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  constructor(private readonly store: Store, private readonly dialogRef: MatDialogRef<EditRoleDialogComponent>) {}

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
    console.log('user: ', user);
    console.log('role: ', role);

    this.dialogRef.close();
  }
}
