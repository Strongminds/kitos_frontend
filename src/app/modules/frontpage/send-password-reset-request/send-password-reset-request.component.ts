import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  selector: 'app-send-password-reset-request',
  templateUrl: './send-password-reset-request.component.html',
  styleUrl: './send-password-reset-request.component.scss',
})
export class SendPasswordResetRequestComponent {
  public readonly formGroup = new FormGroup({
    email: new FormControl<string | undefined>(undefined, [Validators.email, Validators.required]),
  });

  constructor(private store: Store) {}

  public onSendEmail(): void {
    const email = this.formGroup.value.email;
    if (!email) return;
    this.store.dispatch(UserActions.resetPasswordRequest(email));
  }
}
