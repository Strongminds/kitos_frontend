import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { SystemIntegratorComponentStore } from './system-integrators.component-store';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { MatDialog } from '@angular/material/dialog';
import { AddSystemIntegratorDialogComponent } from './add-system-integrator-dialog/add-system-integrator-dialog.component';
import { GlobalAdminSystemIntegratorActions } from 'src/app/store/global-admin/system-integrators/actions';
import { Actions, ofType } from '@ngrx/effects';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { map } from 'rxjs';
import { toUuid } from 'src/app/shared/models/has-uuid';
import { mapArray } from 'src/app/shared/helpers/observable-helpers';

@Component({
  selector: 'app-global-admin-system-integrators',
  templateUrl: './global-admin-system-integrators.component.html',
  styleUrl: './global-admin-system-integrators.component.scss',
  providers: [SystemIntegratorComponentStore],
})
export class GlobalAdminSystemIntegratorsComponent extends BaseComponent implements OnInit {
  public readonly systemIntegrators$ = this.componentStore.systemIntegrators$;

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'name',
      title: 'Navn',
      hidden: false,
    },
    {
      field: 'email',
      title: 'Email',
      hidden: false,
    },
    createGridActionColumn(['delete']),
  ];

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly componentStore: SystemIntegratorComponentStore,
    private readonly confirmActionService: ConfirmActionService,
    private readonly actions$: Actions
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminSystemIntegratorActions.editSystemIntegratorSuccess)).subscribe(() => {
        this.componentStore.getSystemIntegrators();
      })
    );

    this.componentStore.getSystemIntegrators();
  }

  public openAddSystemIntegratorDialog(): void {
    const dialogRef = this.dialog.open(AddSystemIntegratorDialogComponent);
    dialogRef.componentInstance.systemIntegratorUuids$ = this.componentStore.systemIntegrators$.pipe(mapArray(toUuid));
  }

  public deleteSystemIntegrator(systemIntegrator: ShallowUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: `Er du sikker på at du vil fjerne "${systemIntegrator.name}"'s rettighed som System Integrator?`,
      onConfirm: () =>
        this.store.dispatch(GlobalAdminSystemIntegratorActions.editSystemIntegrator(systemIntegrator.uuid, false)),
    });
  }
}
