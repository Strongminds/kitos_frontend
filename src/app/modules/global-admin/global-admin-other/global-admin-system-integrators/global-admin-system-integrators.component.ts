import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GlobalAdminActions } from 'src/app/store/global-admin/actions';
import { selectAllGlobalAdmins } from 'src/app/store/global-admin/selectors';

@Component({
  selector: 'app-global-admin-system-integrators',
  templateUrl: './global-admin-system-integrators.component.html',
  styleUrl: './global-admin-system-integrators.component.scss',
})
export class GlobalAdminSystemIntegratorsComponent {
  public readonly systemIntegrators$ = this.store.select(selectAllGlobalAdmins);

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
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'delete' }] as GridActionColumn[],
      width: 50,
    }
  ];

  constructor(private readonly store: Store) {
    this.store.dispatch(GlobalAdminActions.getGlobalAdmins());
  }
}
