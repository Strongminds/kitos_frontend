import { Component, Input } from '@angular/core';
import {
  ItSystemUsageModuleSegmentOption,
  itSystemUsageModuleSegmentOptions,
} from 'src/app/shared/constants/it-system-usage-module-segment-constants';

@Component({
  templateUrl: 'it-system-usage-details-frontpage.component.html',
  styleUrls: ['it-system-usage-details-frontpage.component.scss'],
})
export class ITSystemUsageDetailsFrontpageComponent {
  public ItSystemUsageModuleSegmentOption = ItSystemUsageModuleSegmentOption;
  @Input() public selected = ItSystemUsageModuleSegmentOption.Usage;
  public itSystemUsageModuleSegmentOptions = itSystemUsageModuleSegmentOptions;
}
