import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { APIOrganizationUserResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  RoleDropdownOption,
  mapRoleToDropdownOptions,
  mapUserToOption,
} from 'src/app/shared/models/dropdown-option.model';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { Dictionary } from 'src/app/shared/models/primitives/dictionary.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { RoleTableComponentStore } from '../role-table.component-store';

@Component({
  selector: 'app-role-table.create-dialog[userRoles][entityType][entityUuid][title]',
  templateUrl: './role-table.create-dialog.component.html',
  styleUrls: ['./role-table.create-dialog.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly roleForm = new FormGroup({
    role: new FormControl<APIRoleOptionResponseDTO | undefined>(
      { value: undefined, disabled: false },
      Validators.required
    ),
    user: new FormControl<APIOrganizationUserResponseDTO[] | undefined>(
      { value: undefined, disabled: true },
      Validators.required
    ),
  });

  @Input() public userRoles: Array<IRoleAssignment> = [];
  @Input() public entityType!: RoleOptionTypes;
  @Input() public entityUuid!: string;
  @Input() public title!: string;

  public readonly users$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users?.map((user) => mapUserToOption(user)))
  );
  public readonly isLoading$ = this.componentStore.usersIsLoading$;

  public roles$ = new Subject<Array<RoleDropdownOption>>();
  public existingUserUuids$ = new BehaviorSubject<string[]>([]);
  public selectedUserUuid$ = new Subject<string>();
  public selectedRoleUuid$ = new Subject<string>();

  public readonly selectUserResultIsLimited$ = this.componentStore.selectUserResultIsLimited$;

  public isBusy = false;

  private userRoleUuidsDictionary: Dictionary<string[]> = {};
  private roleUserUuidsDictionary: Dictionary<string[]> = {};

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialogRef<RoleTableCreateDialogComponent>,
    private readonly roleOptionTypeService: RoleOptionTypeService,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit() {
    this.userFilterChange(undefined);

    //map assigned roles for each user to enable quick lookup
    this.userRoles.forEach((role) => {
      const roleUuid = role.assignment.role.uuid;
      let userUuids = this.roleUserUuidsDictionary[roleUuid];
      if (!userUuids) {
        userUuids = [];
        this.roleUserUuidsDictionary[roleUuid] = userUuids;
      }
      userUuids.push(role.assignment.user.uuid);
    });

    //assign roles onInit, because optionType is not available before
    this.subscriptions.add(
      this.selectedUserUuid$
        .pipe(
          concatLatestFrom(() =>
            this.store.select(selectRoleOptionTypes(this.entityType)).pipe(
              filterNullish(),
              map((roles) => roles.map((role) => mapRoleToDropdownOptions(role)))
            )
          )
        )
        .subscribe(([userUuid, roles]) => {
          const rolesAssignedToUserUuids = this.userRoleUuidsDictionary[userUuid];
          const availableRoles = roles.filter((x) => !rolesAssignedToUserUuids?.includes(x.uuid));
          this.roles$.next(availableRoles);
        })
    );
    this.subscriptions.add(
      this.selectedRoleUuid$.subscribe((roleUuid) => {
        const userUuids = this.roleUserUuidsDictionary[roleUuid];
        this.existingUserUuids$.next(userUuids ?? []);
      })
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRoleSuccess,
            ITContractActions.addItContractRoleSuccess,
            DataProcessingActions.addDataProcessingRoleSuccess,
            OrganizationUnitActions.addOrganizationUnitRoleSuccess
          )
        )
        .subscribe(() => {
          this.dialog.close();
        })
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRoleError,
            ITContractActions.addItContractRoleError,
            DataProcessingActions.addDataProcessingRoleError,
            OrganizationUnitActions.addOrganizationUnitRoleError
          )
        )
        .subscribe(() => {
          this.isBusy = false;
        })
    );
  }

  public userFilterChange(filter?: string) {
    this.componentStore.getUsers(filter);
  }

  public userChange(userUuid?: string[] | null) {
    const roleControl = this.roleForm.controls['role'];
    roleControl.reset();

    //if user is null disable the role dropdown
    if (!userUuid) {
      roleControl.disable();
      return;
    }

    //enable role dropdown
    roleControl.enable();
    //this.selectedUserUuid$.next(userUuid);
  }

  public roleChange(roleUuid?: string | null) {
    const userControl = this.roleForm.controls['user'];
    userControl.reset();

    //if role is null disable the user dropdown
    if (!roleUuid) {
      userControl.disable();
      return;
    }

    //enable user dropdown
    userControl.enable();
    this.selectedRoleUuid$.next(roleUuid);
  }

  public onSave() {
    if (!this.roleForm.valid) return;

    const userUuid = this.roleForm.value.user?.uuid;
    const roleUuid = this.roleForm.value.role?.uuid;
    if (!userUuid || !roleUuid) return;

    this.isBusy = true;
    this.roleOptionTypeService.dispatchAddEntityRoleAction(userUuid, roleUuid, this.entityType);
  }

  public onCancel() {
    this.dialog.close();
  }
}
