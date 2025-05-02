import { Component, Input } from '@angular/core';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';
import { LocalAdminBaseExcelExportComponent } from '../local-admin-import/local-admin-base-excel-export/local-admin-base-excel-export.component';
import { LocalAdminImportFkOrgComponent } from './local-admin-import-fk-org/local-admin-import-fk-org.component';

@Component({
    selector: 'app-local-admin-import-organization',
    templateUrl: './local-admin-import-organization.component.html',
    styleUrl: './local-admin-import-organization.component.scss',
    imports: [LocalAdminBaseExcelExportComponent, LocalAdminImportFkOrgComponent]
})
export class LocalAdminImportOrganizationComponent {
  @Input() public helpTextKey!: string;
  public readonly organizationOptions = LocalAdminImportEntityType.organization;
}
