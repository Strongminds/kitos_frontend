import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { RoleTableComponentStore } from '../../role-table.component-store';
import { Actions, ofType } from '@ngrx/effects';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.scss',
  standalone: false,
})
export class EditRoleDialogComponent implements OnInit {
  @Input() public roleType!: RoleOptionTypes;
  @Input() public initialValue!: RoleAssignment;
  @Input() public componentStore!: RoleTableComponentStore;
  @Input() public title!: string;
  @Input() public orgUnit?: IdentityNamePair;

  public readonly formGroup = new FormGroup({
    orgUnit: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    role: new FormControl<APIRegularOptionResponseDTO | undefined>(undefined, Validators.required),
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private readonly roleOptionService: RoleOptionTypeService,
    private readonly actions$: Actions
  ) {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      orgUnit: this.orgUnit?.name,
      role: { ...this.initialValue.assignment.role, description: '' },
      user: this.initialValue.assignment.user,
    });
  }

  public onSave(): void {
    const formControls = this.formGroup.controls;
    const user = formControls.user.value;
    const role = formControls.role.value;
    if (!user || !role) throw new Error('User or role is undefined');

    this.actions$.pipe(ofType(this.deleteSuccessAction()), first()).subscribe(() => {
      this.roleOptionService.dispatchAddEntityRoleAction([user.uuid], role.uuid, this.roleType, this.orgUnit?.uuid);
    });

    this.roleOptionService.dispatchRemoveEntityRoleAction(this.initialValue, this.roleType);

    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public roleAssignmentExists$(): Observable<boolean> {
    return this.componentStore.roles$.pipe(
      map((roleAssignments) =>
        roleAssignments.some((role) => {
          var assignment = role.assignment;
          var formControls = this.formGroup.controls;
          return (
            assignment.user.uuid === formControls.user.value?.uuid &&
            assignment.role.uuid === formControls.role.value?.uuid
          );
        })
      )
    );
  }

  public canSave$(): Observable<boolean> {
    return this.roleAssignmentExists$().pipe(map((exists) => !exists && this.formGroup.valid));
  }

  private deleteSuccessAction() {
    switch (this.roleType) {
      case 'it-system-usage':
        return ITSystemUsageActions.removeItSystemUsageRoleSuccess;
      case 'it-contract':
        return ITContractActions.removeItContractRoleSuccess;
      case 'data-processing':
        return DataProcessingActions.removeDataProcessingRoleSuccess;
      case 'organization-unit':
        return OrganizationUnitActions.deleteOrganizationUnitRoleSuccess;
    }
  }
}
