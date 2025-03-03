import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GlobalAdminActions } from 'src/app/store/global-admin/actions';
import { selectAllGlobalAdmins, selectGlobalAdminsLoading } from 'src/app/store/global-admin/selectors';

@Component({
  selector: 'app-global-admins-table',
  templateUrl: './global-admins-table.component.html',
  styleUrl: './global-admins-table.component.scss',
})
export class GlobalAdminsTableComponent implements OnInit {
  constructor(private confirmActionService: ConfirmActionService, private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(GlobalAdminActions.getGlobalAdmins());
  }

  public readonly globalAdmins$ = this.store.select(selectAllGlobalAdmins);
  public readonly globalAdminsIsLoading$ = this.store.select(selectGlobalAdminsLoading);

  public removeGlobalAdmin(globalAdmin: ShallowUser) {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Fjern "${globalAdmin.name}" som global administrator`,
      onConfirm: () => this.store.dispatch(GlobalAdminActions.removeGlobalAdmin(globalAdmin.uuid)),
    });
  }
}
