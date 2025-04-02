import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIUpdateUserRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  mapStartPreferenceChoice,
  StartPreferenceChoice,
} from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { UserService } from 'src/app/shared/services/user.service';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import {
  selectOrganizationUuid,
  selectUserDefaultUnit,
  selectUserOrganizationRights,
} from 'src/app/store/user-store/selectors';
import { ProfileComponentStore } from './profile.component-store';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
  providers: [ProfileComponentStore],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  public startPreferenceOptions = this.userService.getAvailableStartPreferenceOptions();
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly user$ = this.componentStore.user$;
  public readonly hasRoleInOrganization$ = this.store.select(selectUserOrganizationRights).pipe(
    combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
    map(([organizationRights, organizationUuid]) => {
      if (!organizationRights) return false;
      return organizationRights.some((right) => right.organizationUuid === organizationUuid);
    })
  );
  public readonly userDefaultUnit$ = this.store.select(selectUserDefaultUnit);

  public readonly alreadyExists$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly currentDefaultUnitUuid$: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);

  public editForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, [Validators.required, Validators.email]),
    phoneNumber: new FormControl<string | undefined>(undefined, phoneNumberLengthValidator()),
    defaultStartPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    defaultOrganizationUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  private currentEmail = '';

  constructor(
    private store: Store,
    private componentStore: ProfileComponentStore,
    private actions$: Actions,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getUser();

    this.user$.subscribe((user) => {
      if (user) {
        this.currentEmail = user.email ?? '';
        this.editForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          defaultStartPreference: mapStartPreferenceChoice(user.defaultUserStartPreference),
        });

        this.currentDefaultUnitUuid$.next(user.defaultOrganizationUnit?.uuid);
      }
    });

    this.subscriptions.add(
      this.userDefaultUnit$
        .pipe(combineLatestWith(this.hasRoleInOrganization$))
        .subscribe(([defaultUnit, hasRoleInOrganization]) => {
          let defaultUnitToPatch = defaultUnit;
          if (!hasRoleInOrganization) {
            defaultUnitToPatch = undefined;
            this.editForm.controls.defaultOrganizationUnit.disable();
          }

          this.editForm.controls.defaultOrganizationUnit.enable();

          this.editForm.patchValue({
            defaultOrganizationUnit: defaultUnitToPatch,
          });
        })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.verifyUserEmailSuccess)).subscribe(({ email }) => {
        this.currentEmail = email;
        this.alreadyExists$.next(false);
        this.onChange({ email });
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.verifyUserEmailError)).subscribe(() => {
        if (this.currentEmail === this.editForm.controls.email.value) {
          this.changeEmailValidityState(false);
          return;
        }

        this.changeEmailValidityState(true);
      })
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.setUserDefaultUnitSuccess), combineLatestWith(this.currentDefaultUnitUuid$))
        .subscribe(([{ organizationUnit }, currentUnitUuid]) => {
          if (organizationUnit.uuid === currentUnitUuid) return;

          this.currentDefaultUnitUuid$.next(organizationUnit.uuid);
        })
    );
  }

  public onChange(request: APIUpdateUserRequestDTO): void {
    if (!request.defaultOrganizationUnitUuid) return;

    this.store.dispatch(UserActions.setUserDefaultUnit(request.defaultOrganizationUnitUuid));
  }

  public emailChange(email: string): void {
    this.store.dispatch(OrganizationUserActions.verifyUserEmail(email));
  }

  public firstNameChange(firstName: ValidatedValueChange<string | undefined>): void {
    if (firstName.valid && firstName.value) {
      this.onChange({ firstName: firstName.value });
    }
  }

  public lastNameChange(lastName: ValidatedValueChange<string | undefined>): void {
    if (lastName.valid && lastName.value) {
      this.onChange({ lastName: lastName.value });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public startPreferenceChange(startPreference: any): void {
    this.onChange({ defaultUserStartPreference: startPreference });
  }

  public validateEmail(email: ValidatedValueChange<string | undefined>): void {
    if (email.valid && email.value) {
      this.emailChange(email.value);
    }
  }

  private changeEmailValidityState(isInvalid: boolean) {
    this.alreadyExists$.next(isInvalid);
    if (isInvalid) {
      this.editForm.controls.email.setErrors({ invalid: true });
    } else {
      this.editForm.controls.email.setErrors(null);
    }
  }
}
