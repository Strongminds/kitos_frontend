import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent {
  public readonly formGroup = new FormGroup({
    email: new FormControl<string | undefined>(undefined, [Validators.email, Validators.required]),
  });

  constructor(private store: Store) {}

  public onSendEmail(): void {
    const email = this.formGroup.value.email;
    if (!email) return;
    this.store.dispatch(UserActions.resetPasswordRequest(email)); //TODO: Maybe implement some kind of loading spinner at this point
  }
}
