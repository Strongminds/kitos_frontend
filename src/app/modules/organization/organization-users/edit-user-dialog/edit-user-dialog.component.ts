import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime, Observable, of } from 'rxjs';
import { APIMutateRightRequestDTO, APIUpdateUserRequestDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { CreateUserDialogComponentStore } from '../create-user-dialog/create-user-dialog.component-store';

import {
  BulkActionButton,
  BulkActionDialogComponent,
  BulkActionOption,
  BulkActionResult,
  BulkActionSection,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { MultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { mapToCopyRoleRequestDTO } from 'src/app/shared/helpers/user-role.helpers';
import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import {
  mapUserRoleChoice,
  UserRoleChoice,
} from 'src/app/shared/models/organization/organization-user/user-role.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { UserService } from 'src/app/shared/services/user.service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { BaseUserDialogComponent } from '../base-user-dialog.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
  providers: [CreateUserDialogComponentStore],
})
export class EditUserDialogComponent extends BaseUserDialogComponent implements OnInit, AfterViewInit {
  @Input() public user!: ODataOrganizationUser;
  @Input() public isNested!: boolean;
  @ViewChild(MultiSelectDropdownComponent)
  public multiSelectDropdown!: MultiSelectDropdownComponent<APIUserResponseDTO.RolesEnum>;

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.email,
      requiredIfDirtyValidator(),
    ]),
    phoneNumber: new FormControl<string | undefined>(undefined, phoneNumberLengthValidator()),
    defaultStartPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    roles: new FormControl<UserRoleChoice[] | undefined>(undefined),
    hasApiAccess: new FormControl<boolean | undefined>(undefined),
    hasRightsHolderAccess: new FormControl<boolean | undefined>(undefined),
    hasStakeholderAccess: new FormControl<boolean | undefined>(undefined),
  });

  private selectedRoles: APIUserResponseDTO.RolesEnum[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    componentStore: CreateUserDialogComponentStore,
    private dialog: MatDialog,
    store: Store,
    userService: UserService
  ) {
    super(store, componentStore, userService);
  }

  public ngOnInit(): void {
    this.createForm.patchValue({
      firstName: this.user.FirstName,
      lastName: this.user.LastName,
      email: this.user.Email,
      phoneNumber: this.user.PhoneNumber,
      defaultStartPreference: this.user.DefaultStartPreference,
      hasApiAccess: this.user.HasApiAccess,
      hasRightsHolderAccess: this.user.HasRightsHolderAccess,
      hasStakeholderAccess: this.user.HasStakeHolderAccess,
    });

    this.componentStore.setPreviousEmail(this.user.Email);

    this.subscriptions.add(
      this.getEmailControl()
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (!value) return;

          this.componentStore.getUserWithEmail(value);
        })
    );

    this.subscriptions.add(
      this.alreadyExists$.subscribe((alreadyExists) => {
        if (alreadyExists) {
          this.getEmailControl()?.setErrors({ alreadyExists: true });
        } else {
          this.getEmailControl()?.setErrors(null);
        }
      })
    );
  }

  public ngAfterViewInit(): void {
    const initialValues = this.getSelectableRolesThatUserHas()
      .map((role) => mapUserRoleChoice(role))
      .filter((role) => role !== undefined);
    this.multiSelectDropdown.setValues(initialValues);
    this.selectedRoles = initialValues.map((role) => role.value);
  }

  public onSave(): void {
    this.subscriptions.add(
      this.store.select(OrganizationUserActions.updateUserSuccess).subscribe(() => {
        this.dialogRef.close();
      })
    );
    const request = this.createRequest();
    this.store.dispatch(OrganizationUserActions.updateUser(this.user.Uuid, request));
  }

  public isFormValid(): boolean {
    return this.createForm.valid && this.hasAnythingChanged();
  }

  public rolesChanged(roles: APIUserResponseDTO.RolesEnum[]): void {
    this.selectedRoles = roles;
  }

  public rolesCleared(): void {
    this.selectedRoles = [];
  }

  public onCopyRoles(): void {
    const dialogActions = [
      {
        text: $localize`Kopier roller`,
        color: 'secondary',
        buttonStyle: 'secondary',
        callback: (result) => this.copyRoles(result),
      },
    ] as BulkActionButton[];

    const dialogSections = this.getCopyDialogSections();

    const dialogRef = this.dialog.open(BulkActionDialogComponent, {
      width: '50%',
      minWidth: '600px',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh%',
    });

    const instance = dialogRef.componentInstance;
    instance.title = $localize`Kopier roller`;
    instance.emptyStateText = $localize`Brugeren har ingen roller`;
    instance.snackbarText = $localize`Vælg handling for valgte roller`;
    instance.sections = dialogSections;
    instance.actionButtons = dialogActions;
    instance.dropdownTitle = $localize`Kopier roller til`;
    instance.dropdownDisabledUuids$ = of([this.user.Uuid]);
    instance.dropdownType = 'user';
    instance.successActionTypes = OrganizationUserActions.copyRolesSuccess;
    instance.errorActionTypes = OrganizationUserActions.copyRolesError;
  }

  private copyRoles(result: BulkActionResult): void {
    const request = {
      unitRights: this.mapResult(result, 'organization-unit'),
      systemRights: this.mapResult(result, 'it-system'),
      contractRights: this.mapResult(result, 'it-contract'),
      dataProcessingRights: this.mapResult(result, 'data-processing-registration'),
    };

    if (!result.selectedEntityId) {
      throw new Error('Selected entity ID is undefined');
    }
    this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, result.selectedEntityId, request));
  }

  private mapResult(result: BulkActionResult, type: RegistrationEntityTypes): APIMutateRightRequestDTO[] {
    if (!result.selectedEntityId) {
      throw new Error('Selected entity ID is undefined');
    }
    return result.selectedOptions[type].map((option) =>
      mapToCopyRoleRequestDTO(this.user.Uuid, option.id as number, result.selectedEntityId!)
    );
  }

  private mapUserRights(rights: Right[]): Observable<BulkActionOption[]> {
    return of(
      rights.map((right) => ({
        id: right.role.id,
        name: right.entity.name,
        secondaryName: right.role.name,
      }))
    );
  }

  private hasAnythingChanged(): boolean {
    return (
      this.user.Email !== this.createForm.value.email ||
      this.user.FirstName !== this.createForm.value.firstName ||
      this.user.LastName !== this.createForm.value.lastName ||
      this.user.PhoneNumber !== this.createForm.value.phoneNumber ||
      this.user.DefaultStartPreference !== this.createForm.value.defaultStartPreference ||
      this.user.HasApiAccess !== this.createForm.value.hasApiAccess ||
      this.user.HasRightsHolderAccess !== this.createForm.value.hasRightsHolderAccess ||
      this.user.HasStakeHolderAccess !== this.createForm.value.hasStakeholderAccess ||
      this.getRoleRequest() !== undefined
    );
  }

  private createRequest(): APIUpdateUserRequestDTO {
    const user = this.user;
    const formValue = this.createForm.value;
    const request = {
      email: this.requestValue(user.Email, formValue.email),
      firstName: this.requestValue(user.FirstName, formValue.firstName),
      lastName: this.requestValue(user.LastName, formValue.lastName),
      phoneNumber: this.requestValue(user.PhoneNumber, formValue.phoneNumber),
      defaultUserStartPreference:
        this.requestValue(user.DefaultStartPreference, formValue.defaultStartPreference)?.value ??
        APIUserResponseDTO.DefaultUserStartPreferenceEnum.StartSite,
      hasApiAccess: this.requestValue(user.HasApiAccess, formValue.hasApiAccess),
      hasStakeHolderAccess: this.requestValue(user.HasStakeHolderAccess, formValue.hasStakeholderAccess),
      roles: this.getRoleRequest(),
    };
    return request;
  }

  private getRoleRequest(): APIUpdateUserRequestDTO.RolesEnum[] | undefined {
    const previousRoles = new Set(this.getOriginalRoles());
    const selectedRoles = new Set(this.getRolesToBePatched());
    const areTheyTheSame =
      [...previousRoles].every((role) => selectedRoles.has(role)) &&
      [...selectedRoles].every((role) => previousRoles.has(role));
    if (areTheyTheSame) return undefined;
    return [...selectedRoles];
  }

  private getRolesToBePatched(): APIUpdateUserRequestDTO.RolesEnum[] {
    const selectedRoles = this.selectedRoles.slice();
    return this.addNonSelectableRoles(selectedRoles, this.createForm.value.hasRightsHolderAccess === true);
  }

  private getOriginalRoles(): APIUpdateUserRequestDTO.RolesEnum[] {
    const roles = this.getSelectableRolesThatUserHas();
    return this.addNonSelectableRoles(roles, this.user.HasRightsHolderAccess);
  }

  private addNonSelectableRoles(
    roles: APIUpdateUserRequestDTO.RolesEnum[],
    shouldRightsHolderAccessBeAdded: boolean
  ): APIUpdateUserRequestDTO.RolesEnum[] {
    roles.push(APIUpdateUserRequestDTO.RolesEnum.User);
    if (shouldRightsHolderAccessBeAdded) {
      roles.push(APIUpdateUserRequestDTO.RolesEnum.RightsHolderAccess);
    }
    return roles;
  }

  private getSelectableRolesThatUserHas(): APIUserResponseDTO.RolesEnum[] {
    const roles: APIUpdateUserRequestDTO.RolesEnum[] = [];
    if (this.user.IsLocalAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.LocalAdmin);
    }
    if (this.user.IsOrganizationModuleAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin);
    }
    if (this.user.IsSystemModuleAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.SystemModuleAdmin);
    }
    if (this.user.IsContractModuleAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.ContractModuleAdmin);
    }
    return roles;
  }

  private requestValue<T>(valueBefore: T, formValue: T | undefined | null) {
    const mappedFormValue = formValue ?? undefined;
    return valueBefore !== mappedFormValue ? mappedFormValue : undefined;
  }

  private getEmailControl(): AbstractControl {
    return this.createForm.get('email')!;
  }

  private getCopyDialogSections(): BulkActionSection[] {
    return [
      {
        options$: this.mapUserRights(this.user.OrganizationUnitRights),
        entityType: 'organization-unit',
        title: $localize`Organisationsenhedroller`,
        primaryColumnTitle: $localize`Organisationsenhed`,
        secondaryColumnTitle: $localize`Rolle`,
      },
      {
        options$: this.mapUserRights(this.user.ItContractRights),
        entityType: 'it-contract',
        title: $localize`Kontraktroller`,
        primaryColumnTitle: $localize`Kontrakt`,
        secondaryColumnTitle: $localize`Rolle`,
      },
      {
        options$: this.mapUserRights(this.user.ItSystemRights),
        entityType: 'it-system',
        title: $localize`Systemroller`,
        primaryColumnTitle: $localize`System`,
        secondaryColumnTitle: $localize`Rolle`,
      },
      {
        options$: this.mapUserRights(this.user.DataProcessingRegistrationRights),
        entityType: 'data-processing-registration',
        title: $localize`Databehandlingsroller`,
        primaryColumnTitle: $localize`Databehandling`,
        secondaryColumnTitle: $localize`Rolle`,
      },
    ] as BulkActionSection[];
  }
}
