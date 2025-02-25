import { Component } from '@angular/core';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';

@Component({
  selector: 'app-sso-button',
  templateUrl: './sso-button.component.html',
  styleUrl: './sso-button.component.scss',
})
export class SsoButtonComponent {
  constructor(private confirmActionService: ConfirmActionService) {}

  goToSSO(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      onConfirm: () => {
        window.location.href = '/LoginHandler.ashx';
      },
      confirmationType: 'OkCancel',
      title: $localize`Single Sign-On (SSO)`,
      message: $localize`Efter du er logget ind med SSO, bliver du omdirigeret til den gamle brugerflade. Så kan du vende tilbage til den nye brugerflade på https://kitos.dk/ui`,
    });
  }
}
