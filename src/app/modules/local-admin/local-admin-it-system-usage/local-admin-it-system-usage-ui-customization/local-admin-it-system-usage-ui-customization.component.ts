import { Component } from '@angular/core';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

@Component({
  selector: 'app-local-admin-it-system-usage-ui-customization',
  templateUrl: './local-admin-it-system-usage-ui-customization.component.html',
  styleUrl: './local-admin-it-system-usage-ui-customization.component.scss',
})
export class LocalAdminItSystemUsageUiCustomizationComponent {
  public readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;
}
