import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { LocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';
import { selectAllLocalAdmins, selectLocalAdminsLoading } from 'src/app/store/global-admin/local-admins/selectors';
import { GridActions } from 'src/app/store/grid/actions';
import { CreateLocalAdminDialogComponent } from '../create-local-admin-dialog/create-local-admin-dialog.component';
import { OverviewHeaderComponent } from '../../../../shared/components/overview-header/overview-header.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ExportIconComponent } from '../../../../shared/components/icons/export-icon.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { LocalGridComponent } from '../../../../shared/components/local-grid/local-grid.component';

@Component({
  selector: 'app-global-admin-local-admins-grid',
  templateUrl: './global-admin-local-admins-grid.component.html',
  styleUrl: './global-admin-local-admins-grid.component.scss',
  imports: [OverviewHeaderComponent, ButtonComponent, ExportIconComponent, NgIf, LocalGridComponent, AsyncPipe],
})
export class GlobalAdminLocalAdminsGridComponent {
  public readonly localAdmins$ = this.store.select(selectAllLocalAdmins);
  public readonly isLoading$ = this.store.select(selectLocalAdminsLoading);

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private confirmActionService: ConfirmActionService,
  ) {}

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
    createGridActionColumn(['delete']),
  ];

  public createLocalAdmin(): void {
    this.dialog.open(CreateLocalAdminDialogComponent);
  }

  public deleteLocalAdmin(localAdmin: LocalAdminUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      title: $localize`Slet lokal administrator`,
      message: $localize`Er du sikker på at du vil slette "${localAdmin.user.name}" som lokal administrator for organisationen "${localAdmin.organization.name}"?`,
      onConfirm: () =>
        this.store.dispatch(LocalAdminUserActions.removeLocalAdmin(localAdmin.organization.uuid, localAdmin.user.uuid)),
    });
  }

  public exportToExcel() {
    this.store.dispatch(GridActions.exportLocalData());
  }
}
