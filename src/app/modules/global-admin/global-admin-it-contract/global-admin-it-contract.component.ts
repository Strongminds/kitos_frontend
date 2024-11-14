import { Component } from '@angular/core';
import { GlobalAdminModuleSegmentOptions, GlobalAdminModuleSegmentOptionType } from 'src/app/shared/constants/global-admin-module-segment-constants';

@Component({
  selector: 'app-global-admin-it-contract',
  templateUrl: './global-admin-it-contract.component.html',
  styleUrl: './global-admin-it-contract.component.scss'
})
export class GlobalAdminItContractComponent {
  public readonly GlobalAdminModuleSegmentOptionType = GlobalAdminModuleSegmentOptionType;
  public readonly segmentOptions = GlobalAdminModuleSegmentOptions;

  public selectedSegment = GlobalAdminModuleSegmentOptionType.RegularOptionTypes;
}
