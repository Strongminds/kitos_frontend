import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DropdownDialogComponent } from 'src/app/shared/components/dialogs/dropdown-dialog/dropdown-dialog.component';
import { LocalGridComponent } from 'src/app/shared/components/local-grid/local-grid.component';
import { OverviewHeaderComponent } from 'src/app/shared/components/overview-header/overview-header.component';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectOrganizationHasModifyPermission } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin-isms-suppliers',
  imports: [CardComponent, LocalGridComponent, NgFor, AsyncPipe, OverviewHeaderComponent, ButtonComponent],
  templateUrl: './local-admin-isms-suppliers.component.html',
  styleUrl: './local-admin-isms-suppliers.component.scss',
})
export class LocalAdminIsmsSuppliersComponent extends BaseComponent {
  constructor(private store: Store, private dialog: MatDialog) {
    super();
    this.store.dispatch(OrganizationActions.getOrganizationPermissions());
  }

  public suppliers = [
    { Name: 'Supplier A', Cvr: '12345678', Uuid: '1' },
    { Name: 'Supplier B', Cvr: '87654321', Uuid: '2' },
    { Name: 'Supplier C', Cvr: '11223344', Uuid: '3' },
  ];

  public suppliers$ = of(this.suppliers);

  public gridColumns = [
    { title: 'Virksomhed', field: 'Name', hidden: false },
    { title: 'CVR', field: 'Cvr', hidden: false },
    createGridActionColumn(['delete']),
  ];

  public canModifyOrganization$ = this.store.select(selectOrganizationHasModifyPermission);

  public openAddSupplierDialog(){
    const dialogRef = this.dialog.open(DropdownDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.title = $localize`Tilføj leverandør`;
    dialogInstance.data$ = this.suppliers$;
    dialogInstance.valueField = 'Uuid';
    dialogInstance.save.subscribe(($event: any) => {
      this.saveSupplier($event);
    })
  }

  public saveSupplier($event: any){
    //todo this.store.dispatch(OrganizationActions.addSupplier({ Uuid: $event.Uuid }))
    console.log('Added supplier with Uuid: ' + $event.Uuid);
    this.dialog.closeAll();
  }

  public removeSupplier($event: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.bodyText = $localize`Er du sikker på, at du vil fjerne leverandøren "${$event.Name}"?`;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add();
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((remove) => {
        if (remove) {
          //todo this.store.dispatch(OrganizationActions.removeSupplier({ Uuid: $event.Uuid }))
          console.log('Removed supplier with Uuid: ' + $event.Uuid);
        }
      });
  }
}
