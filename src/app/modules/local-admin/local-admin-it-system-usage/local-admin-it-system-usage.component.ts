import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalAdminModuleSegmentOptions, LocalAdminModuleSegmentOptionType } from 'src/app/shared/constants/local-admin-module-segment-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { selectShowItSystemModule } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin-it-system-usage',
  templateUrl: './local-admin-it-system-usage.component.html',
  styleUrl: './local-admin-it-system-usage.component.scss',
})
export class LocalAdminItSystemUsageComponent {
  public readonly LocalAdminModuleSegmentOptionType = LocalAdminModuleSegmentOptionType;
  public readonly segmentOptions = LocalAdminModuleSegmentOptions;
  public readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;
  public readonly showItSystemModule$ = this.store.select(selectShowItSystemModule);

  public selectedSegment = LocalAdminModuleSegmentOptionType.UiCustomization;
  constructor(private readonly store: Store) {
  }
}
