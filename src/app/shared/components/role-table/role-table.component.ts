import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionService } from '../../services/confirm-action.service';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { RoleTableComponentStore } from './role-table.component-store';
import { BaseRoleTableComponent } from '../../base/base-role-table.component';
import { compareByRoleName } from '../../helpers/role-helpers';
import { RoleTableContainerComponent } from './role-table-container/role-table-container.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../native-table/native-table.component';
import { RoleRowComponent } from './role-row/role-row.component';

@Component({
    selector: 'app-role-table[entityType][hasModifyPermission]',
    templateUrl: './role-table.component.html',
    styleUrls: ['./role-table.component.scss'],
    providers: [RoleTableComponentStore],
    imports: [RoleTableContainerComponent, NgIf, NativeTableComponent, NgFor, RoleRowComponent, AsyncPipe]
})
export class RoleTableComponent extends BaseRoleTableComponent implements OnInit {
  public readonly roles$ = this.componentStore.roles$.pipe(
    map((roles) =>
      roles.sort(compareByRoleName)
    )
  );

  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    override readonly store: Store,
    override readonly componentStore: RoleTableComponentStore,
    override readonly roleOptionTypeService: RoleOptionTypeService,
    override readonly dialog: MatDialog,
    override readonly actions$: Actions,
    override readonly confirmationService: ConfirmActionService
  ) {
    super(store, componentStore, actions$, roleOptionTypeService, confirmationService, dialog);
  }

  public onAddNew() {
    this.subscriptions.add(
      this.roles$.pipe(combineLatestWith(this.entityUuid$), first()).subscribe(([userRoles, entityUuid]) => {
        this.openAddNewDialog(userRoles, entityUuid);
      })
    );
  }
}
