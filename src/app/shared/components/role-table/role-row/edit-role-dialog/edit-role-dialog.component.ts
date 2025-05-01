import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { APIRegularOptionResponseDTO, APIRoleAssignmentRequestDTO } from 'src/app/api/v2';
import { debugPipe } from 'src/app/shared/helpers/observable-helpers';
import { RoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { selectDataProcessingRightUuidPairs } from 'src/app/store/data-processing/selectors';
import { selectItContractRightUuidPairs } from 'src/app/store/it-contract/selectors';
import { selectItSystemUsageRightUuidPairs } from 'src/app/store/it-system-usage/selectors';

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

  public readonly roleType$ = new BehaviorSubject<RoleOptionTypes | undefined>(undefined);

  public readonly entityRoleAndUuidPairs$ = this.roleType$.pipe(
    filterNullish(),
    switchMap((roleType) => {
      switch (roleType) {
        case 'it-system-usage':
          return this.store.select(selectItSystemUsageRightUuidPairs);
        case 'it-contract':
          return this.store.select(selectItContractRightUuidPairs);
        case 'data-processing':
          return this.store.select(selectDataProcessingRightUuidPairs);
        case 'organization-unit':
          throw new Error('Not implemented yet');
      }
    })
  );

  constructor(
    private readonly dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private readonly roleOptionService: RoleOptionTypeService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      role: { ...this.initialValue.assignment.role, description: '' }, //The description value in the form is not used
      user: this.initialValue.assignment.user,
    });

    this.roleType$.next(this.roleType);
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

  public roleAssignmentExists$(): Observable<boolean> {
    return this.entityRoleAndUuidPairs$.pipe(
      map((roleAssignmentPairs) =>
        roleAssignmentPairs.some(
          (pair) =>
            pair.userUuid === this.formGroup.controls.user.value?.uuid &&
            pair.roleUuid === this.formGroup.controls.role.value?.uuid
        )
      )
    );
  }

  public canSave$(): Observable<boolean> {
    return this.roleAssignmentExists$().pipe(map((exists) => !exists && this.formGroup.valid));
  }
}
