import { Component, Input } from '@angular/core';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';
import { LocalAdminBaseExcelImportComponent } from '../local-admin-import/local-admin-base-excel-import/local-admin-base-excel-import.component';
import { LocalAdminImportFkOrgUsersComponent } from './local-admin-import-fk-org-users/local-admin-import-fk-org-users.component';

@Component({
  selector: 'app-local-admin-import-users',
  templateUrl: './local-admin-import-users.component.html',
  styleUrl: './local-admin-import-users.component.scss',
  imports: [LocalAdminBaseExcelImportComponent, LocalAdminImportFkOrgUsersComponent],
})
export class LocalAdminImportUsersComponent {
  @Input() public helpTextKey!: string;
  public readonly usersType = LocalAdminImportEntityType.users;
}
