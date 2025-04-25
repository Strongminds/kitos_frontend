import { Component } from '@angular/core';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
    selector: 'app-reset-password-text-link',
    templateUrl: './reset-password-text-link.component.html',
    styleUrl: './reset-password-text-link.component.scss',
    standalone: false
})
export class ResetPasswordTextLinkComponent {
  public readonly routerLink = AppPath.passwordReset;
}
