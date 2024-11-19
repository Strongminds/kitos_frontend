import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  StartPreferenceChoice,
  startPreferenceChoiceOptions,
} from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { CreateUserDialogComponentStore } from '../organization/organization-users/create-user-dialog/create-user-dialog.component-store';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
  providers: [CreateUserDialogComponentStore],
})
export class ProfileComponent implements OnInit {
  public startPreferenceOptions = startPreferenceChoiceOptions;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;

  public editForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.email,
      requiredIfDirtyValidator(),
    ]),
    phoneNumber: new FormControl<string | undefined>(undefined, phoneNumberLengthValidator()),
    defaultStartPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
  });

  constructor(public componentStore: CreateUserDialogComponentStore) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
