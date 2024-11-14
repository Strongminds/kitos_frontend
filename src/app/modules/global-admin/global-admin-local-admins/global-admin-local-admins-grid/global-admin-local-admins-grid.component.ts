import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { CreateLocalAdminDialogComponent } from '../create-local-admin-dialog/create-local-admin-dialog.component';

@Component({
  selector: 'app-global-admin-local-admins-grid',
  templateUrl: './global-admin-local-admins-grid.component.html',
  styleUrl: './global-admin-local-admins-grid.component.scss',
})
export class GlobalAdminLocalAdminsGridComponent {

  constructor(private dialog: MatDialog) { }

  data = [{organizationName: "En organisation", name: 'Jacob Borch', email: 'jacob@test.dk'},
    {organizationName: "En anden organisation", name: 'Jense Jensen', email: 'jens@jensen.dk'}
  ];

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
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'delete' }] as GridActionColumn[],
      width: 50,
    },
  ];

  public createLocalAdmin(): void {
    this.dialog.open(CreateLocalAdminDialogComponent);
  }
}
