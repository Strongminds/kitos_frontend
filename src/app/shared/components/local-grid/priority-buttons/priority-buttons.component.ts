import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  GlobalAdminOptionType,
  GlobalAdminOptionTypeItem,
} from 'src/app/shared/models/options/global-admin-option-type.model';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/global-option-types/actions';

@Component({
  selector: 'app-priority-buttons',
  templateUrl: './priority-buttons.component.html',
  styleUrl: './priority-buttons.component.scss',
})
export class PriorityButtonsComponent {
  @Input() priority: number = 0;
  @Input() optionTypeItem!: GlobalAdminOptionTypeItem;
  @Input() optionType!: GlobalAdminOptionType;

  constructor(private store: Store) {}

  public onIncreasePriority(): void {
    this.onChangePriority(this.optionTypeItem.uuid, this.optionTypeItem.priority + 1);
  }

  public onDecreasePriority(): void {
    this.onChangePriority(this.optionTypeItem.uuid, this.optionTypeItem.priority - 1);
  }

  public isLowestPriority(): boolean {
    return false; //TODO: Implement
  }

  public isHighestPriority(): boolean {
    return false; //TODO: Implement
  }

  private onChangePriority(optionUuid: string, newPriority: number): void {
    console.log('Type', this.optionType);
    this.store.dispatch(
      GlobalOptionTypeActions.updateOptionType(this.optionType, optionUuid, { priority: newPriority })
    );
  }
}
