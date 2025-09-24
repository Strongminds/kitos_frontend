import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DropdownDialogComponent } from 'src/app/shared/components/dialogs/dropdown-dialog/dropdown-dialog.component';
import { LocalGridComponent } from 'src/app/shared/components/local-grid/local-grid.component';
import { OverviewHeaderComponent } from 'src/app/shared/components/overview-header/overview-header.component';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { ShallowOrganization } from 'src/app/shared/models/organization/shallow-organization.model';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { OrganizationSuppliersActions } from 'src/app/store/organization/organization-suppliers/actions';
import {
  selectAvailableOrganizationSuppliers,
  selectOrganizationSuppliers,
} from 'src/app/store/organization/organization-suppliers/selectors';
import { selectOrganizationHasModifyPermission } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin-isms-suppliers',
  imports: [CardComponent, LocalGridComponent, AsyncPipe, OverviewHeaderComponent, ButtonComponent, NgIf],
  templateUrl: './local-admin-isms-suppliers.component.html',
  styleUrl: './local-admin-isms-suppliers.component.scss',
})
export class LocalAdminIsmsSuppliersComponent extends BaseComponent implements OnInit {
  constructor(private store: Store, private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationSuppliersActions.getOrganizationSuppliers());
    this.store.dispatch(OrganizationSuppliersActions.getAvailableOrganizationSuppliers());
    this.store.dispatch(OrganizationActions.getOrganizationPermissions());
  }

  public gridColumns = [
    { title: 'Virksomhed', field: 'name', hidden: false },
    { title: 'CVR', field: 'cvr', hidden: false },
    createGridActionColumn(['delete']),
  ];

  public canModifyOrganization$ = this.store.select(selectOrganizationHasModifyPermission);

  public suppliers$ = this.store.select(selectOrganizationSuppliers);
  public availableSuppliers$ = this.store.select(selectAvailableOrganizationSuppliers);

  public openAddSupplierDialog() {
    const dialogRef = this.dialog.open(DropdownDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.title = $localize`Tilføj leverandør`;
    dialogInstance.data$ = this.availableSuppliers$;
    dialogInstance.valueField = 'uuid';
    dialogInstance.textField = 'name';
    dialogInstance.dropdownText = $localize`Vælg leverandør`;
    dialogInstance.save.subscribe(($event: any) => {
      this.saveSupplier($event);
    });
  }

  public saveSupplier($event: ShallowOrganization) {
    this.store.dispatch(OrganizationSuppliersActions.addOrganizationSupplier($event.uuid));
    this.dialog.closeAll();
  }

  public removeSupplier($event: ShallowOrganization) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.bodyText = $localize`Er du sikker på, at du vil fjerne leverandøren "${$event.name}"?`;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add();
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((remove) => {
        if (remove) {
          this.store.dispatch(OrganizationSuppliersActions.removeOrganizationSupplier($event.uuid));
        }
      });
  }
}
