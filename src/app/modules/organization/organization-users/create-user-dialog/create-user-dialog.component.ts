import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, first, map } from 'rxjs';
import { APICreateUserRequestDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { UserService } from 'src/app/shared/services/user.service';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization/organization-user/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectUserUuid } from 'src/app/store/user-store/selectors';
import { BaseUserDialogComponent } from '../base-user-dialog.component';
import { CreateUserDialogComponentStore } from './create-user-dialog.component-store';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../shared/components/textbox/textbox.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';
import { DropdownComponent } from '../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent } from '../../../../shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { SlideToggleComponent } from '../../../../shared/components/slide-toggle/slide-toggle.component';
import { DividerComponent } from '../../../../shared/components/divider/divider.component';
import { VerticalContentGridSectionMarginLeftComponent } from '../../../../shared/components/vertical-content-grid-section-margin-left/vertical-content-grid-section-margin-left.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
  providers: [CreateUserDialogComponentStore],
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    NgIf,
    ParagraphComponent,
    TooltipComponent,
    DropdownComponent,
    MultiSelectDropdownComponent,
    SlideToggleComponent,
    DividerComponent,
    VerticalContentGridSectionMarginLeftComponent,
    CheckboxComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class CreateUserDialogComponent extends BaseUserDialogComponent implements OnInit {
  public readonly noExistingUser$ = this.componentStore.noUserInOtherOrgs$;
  public readonly existingUserUuid$ = this.componentStore.existingUserUuid$;

  public readonly isLoadingCombined$ = combineLatest([
    this.isLoadingAlreadyExists$,
    this.store.select(selectOrganizationUserIsCreateLoading),
  ]).pipe(map(([isLoadingAlreadyExists, isLoading]) => isLoadingAlreadyExists || isLoading));

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator()]),
    lastName: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator()]),
    email: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator(), Validators.email]),
    repeatEmail: new FormControl<string | undefined>(undefined, [
      requiredIfDirtyValidator(),
      Validators.email,
      this.emailMatchValidator.bind(this),
    ]),
    phoneNumber: new FormControl<number | undefined>(undefined, [phoneNumberLengthValidator()]),
    startPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    roles: new FormControl<APIUserResponseDTO.RolesEnum[] | undefined>(undefined),
    sendNotificationOnCreation: new FormControl<boolean>(false),
    rightsHolderAccess: new FormControl<boolean>(false),
    apiUser: new FormControl<boolean>(false),
    stakeholderAccess: new FormControl<boolean>(false),
  });

  public readonly userInOtherOrgHelptext$ = this.noExistingUser$.pipe(
    map((noExistingUser) => (noExistingUser ? '' : this.userInOtherOrgHelptext)),
  );
  private readonly userInOtherOrgHelptext = $localize`Denne bruger findes allerede i en anden organisation. Du kan kun redigere brugerens roller.`;
  private selectedRoles: APIUserResponseDTO.RolesEnum[] = [];

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<CreateUserDialogComponent>,
    store: Store,
    componentStore: CreateUserDialogComponentStore,
    userService: UserService,
  ) {
    super(store, componentStore, userService);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(OrganizationUserActions.createUserSuccess, OrganizationUserActions.updateUserSuccess),
          concatLatestFrom(() => this.store.select(selectUserUuid)),
        )
        .subscribe(([{ user }, userUuid]) => {
          if (user.uuid === userUuid) {
            this.store.dispatch(UserActions.authenticate());
          }
          this.onCancel();
        }),
    );

    this.subscriptions.add(
      this.getEmailControl()
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (!value) return;

          this.componentStore.getUserWithEmail(value);
        }),
    );

    this.subscriptions.add(
      this.alreadyExists$.subscribe((alreadyExists) => {
        if (alreadyExists) {
          this.getEmailControl()?.setErrors({ alreadyExists: true });
        } else {
          this.getEmailControl()?.setErrors(null);
        }
      }),
    );

    this.subscriptions.add(
      this.noExistingUser$.subscribe((noExistingUser) => {
        if (noExistingUser === false) {
          this.createForm.disable();
          this.createForm.controls.email.enable();
          this.createForm.controls.rightsHolderAccess.enable();
        } else {
          this.createForm.enable();
        }
      }),
    );

    this.createForm.get('email')?.valueChanges.subscribe(() => {
      this.createForm.get('repeatEmail')?.updateValueAndValidity();
    });
  }

  public onCancel(): void {
    this.dialog.close();
  }

  public sendCreateUserRequest(): void {
    const roles = this.selectedRoles;
    roles.push(APICreateUserRequestDTO.RolesEnum.User);
    const rightsHolderAccess = this.createForm.controls.rightsHolderAccess.value;
    if (rightsHolderAccess) {
      roles.push(APICreateUserRequestDTO.RolesEnum.RightsHolderAccess);
    }

    this.existingUserUuid$.pipe(first()).subscribe((existingUserUuid) => {
      if (existingUserUuid) {
        this.updateExistingUser(existingUserUuid, roles);
      } else {
        this.createUser(roles);
      }
    });
  }

  public rolesChanged(roles: APIUserResponseDTO.RolesEnum[]): void {
    this.selectedRoles = roles;
  }

  public rolesCleared(): void {
    this.selectedRoles = [];
  }

  public isFormValid(noExistingUser: boolean | null): boolean {
    return noExistingUser
      ? this.createForm.valid &&
          this.createForm.controls.email.dirty &&
          this.createForm.controls.repeatEmail.dirty &&
          this.createForm.controls.firstName.dirty &&
          this.createForm.controls.lastName.dirty
      : this.createForm.controls.email.valid;
  }

  private createUser(roles: APICreateUserRequestDTO.RolesEnum[]): void {
    const firstName = this.createForm.controls.firstName.value;
    const lastName = this.createForm.controls.lastName.value;
    const email = this.createForm.controls.email.value;
    if (!firstName || !lastName || !email) {
      return;
    }

    const phoneNumberFromControl = this.createForm.controls.phoneNumber.value;
    const phoneNumber = phoneNumberFromControl ? String(phoneNumberFromControl).replace(/\s/g, "") : '';
    const startPreference = this.createForm.controls.startPreference.value;
    const sendNotificationOnCreation = this.createForm.controls.sendNotificationOnCreation.value;
    const apiUser = this.createForm.controls.apiUser.value;
    const stakeholderAccess = this.createForm.controls.stakeholderAccess.value;

    const user: APICreateUserRequestDTO = {
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber,
      defaultUserStartPreference: startPreference?.value ?? undefined,
      sendMail: sendNotificationOnCreation ?? false,
      hasApiAccess: apiUser ?? false,
      hasStakeHolderAccess: stakeholderAccess ?? false,
      roles: roles,
    };

    this.store.dispatch(OrganizationUserActions.createUser(user));
  }

  private updateExistingUser(existingUserUuid: string, roles: APICreateUserRequestDTO.RolesEnum[]): void {
    this.store.dispatch(OrganizationUserActions.updateUser(existingUserUuid, { roles }));
  }

  private emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (this.createForm) {
      const email = this.getEmailControl()?.value;
      const repeatEmail = control.value;
      if (email !== repeatEmail) {
        return { emailMismatch: true };
      }
    }
    return null;
  }

  private getEmailControl(): AbstractControl {
    return this.createForm.controls.email!;
  }
}
