import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/actions';
import { BaseComponent } from '../../base/base.component';
import { GlobalAdminOptionType, GlobalAdminOptionTypeItem } from '../../models/options/global-admin-option-type.model';
import { GlobalOptionTypeTableComponentStore } from './global-option-type-table.component-store';

@Component({
  selector: 'app-global-option-type-table',
  templateUrl: './global-option-type-table.component.html',
  styleUrl: './global-option-type-table.component.scss',
  providers: [GlobalOptionTypeTableComponentStore],
})
export class GlobalOptionTypeTableComponent extends BaseComponent implements OnInit {
  @Input() optionType!: GlobalAdminOptionType;
  @Input() title: string = '';

  constructor(
    private componentStore: GlobalOptionTypeTableComponentStore,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    super();
  }

  public readonly optionTypeItems$ = this.componentStore.optionTypeItems$;
  public readonly isLoading$ = this.componentStore.isLoading$;

  public ngOnInit(): void {
    this.componentStore.setState({ isLoading: false, optionTypeItems: [], type: this.optionType });
    this.componentStore.getRegularOptionTypeItems();

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
          this.componentStore.getRegularOptionTypeItems();
        })
    );
  }

  public onEdit(optionType: GlobalAdminOptionTypeItem): void {
    //todo open edit dialog
  }

  public onDelete(optionType: GlobalAdminOptionTypeItem): void {
    //todo open delete dialog
  }
}
