import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent {
  public readonly formGroup = new FormGroup({
    email: new FormControl<string | undefined>(undefined, [Validators.email]),
  });

  public onSendEmail(): void {}

  public canSend(): boolean {
    return this.formGroup.valid && !this.isEmailEmpty();
  }

  public isEmailEmpty(): boolean {
    const emailValue = this.formGroup.value.email;
    return emailValue === undefined || emailValue === '' || emailValue === null;
  }
}
