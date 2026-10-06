import { Component, Input } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { LocalAdminImportOrganizationComponent } from './local-admin-import-organization/local-admin-import-organization.component';
import { LocalAdminImportUsersComponent } from './local-admin-import-users/local-admin-import-users.component';
import { LocalAdminBaseExcelImportComponent } from './local-admin-import/local-admin-base-excel-import/local-admin-base-excel-import.component';

@Component({
  selector: 'app-local-admin-import',
  templateUrl: './local-admin-import.component.html',
  styleUrl: './local-admin-import.component.scss',
  imports: [
    SegmentComponent,
    LocalAdminImportOrganizationComponent,
    LocalAdminImportUsersComponent,
    LocalAdminBaseExcelImportComponent,
  ],
})
export class LocalAdminImportComponent {
  public readonly contractsType = LocalAdminImportEntityType.contracts;
  public readonly ImportSelectOption = LocalAdminImportEntityType;
  public readonly baseHelpTextKey = 'local-config.import';

  @Input() public selected = LocalAdminImportEntityType.organization;

  public showingOptions: SegmentButtonOption<LocalAdminImportEntityType>[] = [
    { text: $localize`Organisation`, value: LocalAdminImportEntityType.organization, dataCy: 'import-organization-tab' },
    { text: $localize`Brugere`, value: LocalAdminImportEntityType.users, dataCy: 'import-users-tab' },
    { text: $localize`IT Kontrakter`, value: LocalAdminImportEntityType.contracts, dataCy: 'import-contracts-tab' },
  ];
}
