import { Component } from '@angular/core';
import { SSO_LOGIN_HANDLER_PATH } from 'src/app/shared/constants/constants';

@Component({
    selector: 'app-sso-button',
    templateUrl: './sso-button.component.html',
    styleUrl: './sso-button.component.scss',
    standalone: false
})
export class SsoButtonComponent {
  public readonly buttonText = $localize`Log ind med SSO`;

  goToSSO(): void {
    window.location.href = SSO_LOGIN_HANDLER_PATH;
  }
}
