import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/global-option-types/actions';
import { BaseComponent } from '../../base/base.component';
import { GlobalAdminOptionType, GlobalAdminOptionTypeItem } from '../../models/options/global-admin-option-type.model';
import { isRoleOptionType } from '../../models/options/role-option-types.model';
import { GlobalOptionTypeTableComponentStore } from './global-option-type-table.component-store';
import { DialogOpenerService } from '../../services/dialog-opener.service';

@Component({
  selector: 'app-global-option-type-view',
  templateUrl: './global-option-type-view.component.html',
  styleUrl: './global-option-type-view.component.scss',
  providers: [GlobalOptionTypeTableComponentStore],
})
export class GlobalOptionTypeViewComponent extends BaseComponent implements OnInit {
  @Input() optionType!: GlobalAdminOptionType;
  @Input() title: string = '';
  @Input() showDescription: boolean = true;
  @Input() expandedByDefault: boolean = false;
  @Input() disableAccordion: boolean = false;
  @Input() showWriteAccess: boolean = false;

  constructor(
    private componentStore: GlobalOptionTypeTableComponentStore,
    private actions$: Actions,
    private store: Store,
    private dialogOpener: DialogOpenerService
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
          ofType(GlobalOptionTypeActions.updateOptionTypeSuccess, GlobalOptionTypeActions.createOptionTypeSuccess),
          filter(({ optionType }) => optionType === this.optionType)
        )
        .subscribe(() => {
          this.componentStore.getOptionTypeItems();
        })
    );
  }

  public isHighestPriority(option: GlobalAdminOptionTypeItem) {
    return this.comparePriority(option, (max, curr) => (curr.priority > max ? curr.priority : max));
  }

  public isLowestPriority(option: GlobalAdminOptionTypeItem) {
    return this.comparePriority(option, (min, curr) => (curr.priority < min ? curr.priority : min));
  }

  private comparePriority(
    option: GlobalAdminOptionTypeItem,
    comparator: (
      previousValue: number,
      currentValue: GlobalAdminOptionTypeItem,
      currentIndex: number,
      array: GlobalAdminOptionTypeItem[]
    ) => number
  ) {
    return this.optionTypeItems$.pipe(
      map((optionTypeItems) => {
        const boundary = optionTypeItems.reduce(comparator, 1);
        return option.priority === boundary;
      })
    );
  }

  public onCreate() {
    const componentInstance = this.dialogOpener.openGlobalOptionTypeDialog(this.optionType);
    componentInstance.action = 'create';
  }

  public onToggleEnabled(optionTypeItem: GlobalAdminOptionTypeItem): void {
    const isEnabled = !optionTypeItem.enabled;
    this.store.dispatch(GlobalOptionTypeActions.updateOptionType(this.optionType, optionTypeItem.uuid, { isEnabled }));
  }

  public onIncreasePriority(optionTypeItem: GlobalAdminOptionTypeItem): void {
    this.onChangePriority(optionTypeItem.uuid, optionTypeItem.priority + 1);
  }

  public onDecreasePriority(optionTypeItem: GlobalAdminOptionTypeItem): void {
    this.onChangePriority(optionTypeItem.uuid, optionTypeItem.priority - 1);
  }

  public getCreateButtonType() {
    return isRoleOptionType(this.optionType) ? $localize`rolle` : $localize`type`;
  }

  private onChangePriority(optionUuid: string, newPriority: number): void {
    this.store.dispatch(
      GlobalOptionTypeActions.updateOptionType(this.optionType, optionUuid, { priority: newPriority })
    );
  }
}
