import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { CreateLocalAdminDialogComponent } from '../create-local-admin-dialog/create-local-admin-dialog.component';
import { Store } from '@ngrx/store';
import { selectAllLocalAdmins, selectLocalAdminsLoading } from 'src/app/store/global-admin/local-admins/selectors';
import { LocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';

@Component({
  selector: 'app-global-admin-local-admins-grid',
  templateUrl: './global-admin-local-admins-grid.component.html',
  styleUrl: './global-admin-local-admins-grid.component.scss',
})
export class GlobalAdminLocalAdminsGridComponent {
  public readonly localAdmins$ = this.store.select(selectAllLocalAdmins);
  public readonly isLoading$ = this.store.select(selectLocalAdminsLoading);

  constructor(private dialog: MatDialog, private store: Store) {}

  data = [
    { organizationName: 'En organisation', name: 'Jacob Borch', email: 'jacob@test.dk' },
    { organizationName: 'En anden organisation', name: 'Jense Jensen', email: 'jens@jensen.dk' },
  ];

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'organization.name',
      title: $localize`Organisation`,
      hidden: false,
    },
    {
      field: 'user.name',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'user.email',
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

  public deleteLocalAdmin(localAdmin: LocalAdminUser): void {
    const userUuid = localAdmin.user.uuid;
    const organizationUuid = localAdmin.organization.uuid;
    this.store.dispatch(LocalAdminUserActions.removeLocalAdmin(organizationUuid, userUuid));
  }
}
