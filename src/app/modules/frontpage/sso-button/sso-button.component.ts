import { Component } from '@angular/core';
import { SSO_LOGIN_HANDLER_PATH } from 'src/app/shared/constants/constants';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';

@Component({
  selector: 'app-sso-button',
  templateUrl: './sso-button.component.html',
  styleUrl: './sso-button.component.scss',
})
export class SsoButtonComponent {
  constructor(private confirmActionService: ConfirmActionService) {}

  public readonly buttonText = $localize`Log ind med SSO`;

  goToSSO(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      onConfirm: () => {
        window.location.href = SSO_LOGIN_HANDLER_PATH;
      },
      confirmationType: 'OkCancel',
      title: $localize`Single Sign-On (SSO)`,
      message: $localize`Efter du er logget ind med SSO, bliver du omdirigeret til den gamle brugerflade. Så kan du vende tilbage til den nye brugerflade på https://kitos.dk/ui`,
    });
  }
}
