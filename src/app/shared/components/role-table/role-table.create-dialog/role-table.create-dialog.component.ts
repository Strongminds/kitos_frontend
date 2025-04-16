import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, combineLatest, map } from 'rxjs';
import { APIOrganizationUserResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapUserToOption } from 'src/app/shared/models/dropdown-option.model';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { Dictionary } from 'src/app/shared/models/primitives/dictionary.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
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

  public availableRoles$ = new BehaviorSubject<APIRoleOptionResponseDTO[]>([]);
  public readonly users$ = this.componentStore.users$.pipe(
    filterNullish(),
    map((users) => users?.map((user) => mapUserToOption(user)))
  );
  public existingUserUuids$ = new BehaviorSubject<string[]>([]);

  public readonly filteredUsers$ = combineLatest([this.users$, this.existingUserUuids$]).pipe(
    map(([users, existingUserUuids]) => users.filter((user) => !existingUserUuids.includes(user.value)))
  );

  public readonly isLoading$ = this.componentStore.usersIsLoading$;

  public selectedRoleUuid$ = new Subject<string>();

  public resetSubject$ = new Subject<void>();

  public readonly selectUserResultIsLimited$ = this.componentStore.selectUserResultIsLimited$;
  public userUuids: string[] = [];

  public isBusy = false;
  public isRoleSelected = false;

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
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.entityType));
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

    this.subscriptions.add(
      this.store
        .select(selectRoleOptionTypes(this.entityType))
        .pipe(filterNullish())
        .subscribe((roles) => {
          this.availableRoles$.next(roles);
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

  public userChange(userUuids: string[]) {
    this.userUuids = userUuids;
  }

  public roleChange(roleUuid?: string | null) {
    const userControl = this.roleForm.controls['user'];
    userControl.reset();

    //if role is null disable the user dropdown
    if (!roleUuid) {
      this.isRoleSelected = false;
      return;
    }

    //enable user dropdown
    this.isRoleSelected = true;
    this.resetSubject$.next();
    this.selectedRoleUuid$.next(roleUuid);
  }

  public onSave() {
    if (!this.roleForm.valid) return;

    const roleUuid = this.roleForm.value.role?.uuid;
    if (this.userUuids.length === 0 || !roleUuid) return;

    this.isBusy = true;
    this.roleOptionTypeService.dispatchAddEntityRoleAction(this.userUuids, roleUuid, this.entityType);
  }

  public onCancel() {
    this.dialog.close();
  }
}
