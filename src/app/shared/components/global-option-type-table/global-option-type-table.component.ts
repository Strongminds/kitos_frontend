import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/actions';
import { BaseComponent } from '../../base/base.component';
import { GlobalAdminOptionType, GlobalAdminOptionTypeItem } from '../../models/options/global-admin-option-type.model';
import { GlobalOptionTypeTableComponentStore } from './global-option-type-table.component-store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-global-option-type-table',
  templateUrl: './global-option-type-table.component.html',
  styleUrl: './global-option-type-table.component.scss',
  providers: [GlobalOptionTypeTableComponentStore],
})
export class GlobalOptionTypeTableComponent extends BaseComponent implements OnInit {
  @Input() optionType!: GlobalAdminOptionType;
  @Input() title: string = '';
  @Input() expandedByDefault: boolean = false;

  constructor(
    private componentStore: GlobalOptionTypeTableComponentStore,
    private dialog: MatDialog,
    private actions$: Actions,
    private store: Store
  ) {
    super();
  }

  public readonly optionTypeItems$ = this.componentStore.optionTypeItems$;
  public readonly isLoading$ = this.componentStore.isLoading$;

  public ngOnInit(): void {
    this.componentStore.setState({ isLoading: false, optionTypeItems: [], type: this.optionType });
    this.componentStore.getOptionTypeItems();

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            GlobalOptionTypeActions.updateRegularOptionTypeSuccess,
            GlobalOptionTypeActions.createRegularOptionTypeSuccess
          ),
          filter(({ optionType }) => optionType === this.optionType)
        )
        .subscribe(() => {
          this.componentStore.getOptionTypeItems();
        })
    );
  }

  public onEdit(optionTypeItem: GlobalAdminOptionTypeItem): void {
    //todo open edit dialog
  }

  public onToggleEnabled(optionTypeItem: GlobalAdminOptionTypeItem): void {
    const isEnabled = !optionTypeItem.enabled;
    this.store.dispatch(GlobalOptionTypeActions.updateRegularOptionType(this.optionType, optionTypeItem.uuid, { isEnabled }));
  }

  public onIncreasePriority(optionTypeItem: GlobalAdminOptionTypeItem): void {
    this.onChangePriority(optionTypeItem.uuid, optionTypeItem.priority + 1);
  }

  public onDecreasePriority(optionTypeItem: GlobalAdminOptionTypeItem): void {
    this.onChangePriority(optionTypeItem.uuid, optionTypeItem.priority - 1);
  }

  private onChangePriority(optionUuid: string, newPriority: number): void {
    //this.store.dispatch(GlobalOptionTypeActions.updateRegularOptionType(this.optionType, optionUuid, { priority: newPriority }));
  }
}
