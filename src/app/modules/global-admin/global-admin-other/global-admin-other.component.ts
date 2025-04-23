import { Component } from '@angular/core';

export enum GlobalAdminOtherSegmentOptionType {
  UserManagement = 'UserManagement',
  APIUsers = 'APIUsers',
  Misc = 'Misc',
}

@Component({
    selector: 'app-global-admin-other',
    templateUrl: './global-admin-other.component.html',
    styleUrl: './global-admin-other.component.scss',
    standalone: false
})
export class GlobalAdminOtherComponent {
  public readonly SegmentType = GlobalAdminOtherSegmentOptionType;
  public selectedSegment = GlobalAdminOtherSegmentOptionType.UserManagement;

  public readonly segmentOptions = [
    {
      text: $localize`Brugerstyring`,
      value: GlobalAdminOtherSegmentOptionType.UserManagement,
      dataCy: 'user-management-segment',
    },
    { text: $localize`API-brugere`, value: GlobalAdminOtherSegmentOptionType.APIUsers, dataCy: 'api-users-segment' },
    { text: $localize`Diverse`, value: GlobalAdminOtherSegmentOptionType.Misc, dataCy: 'misc-segment' },
  ];
}
