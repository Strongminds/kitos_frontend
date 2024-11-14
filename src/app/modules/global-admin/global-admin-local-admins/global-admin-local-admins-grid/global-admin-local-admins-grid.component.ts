import { Component } from '@angular/core';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

@Component({
  selector: 'app-global-admin-local-admins-grid',
  templateUrl: './global-admin-local-admins-grid.component.html',
  styleUrl: './global-admin-local-admins-grid.component.scss',
})
export class GlobalAdminLocalAdminsGridComponent {
  public readonly gridColumns: GridColumn[] = [
    {
      field: 'organizationName',
      title: $localize`Organisation`,
      hidden: false,
    },
    {
      field: 'name',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'email',
      title: $localize`Email`,
      hidden: false,
    },
  ];
}
