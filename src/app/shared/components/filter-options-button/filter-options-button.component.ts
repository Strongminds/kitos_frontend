import { Component, Input } from '@angular/core';
import { StatePersistingService } from '../../services/state-persisting.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../enums/popup-message-type';
import { Store } from '@ngrx/store';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';

@Component({
  selector: 'app-filter-options-button',
  templateUrl: './filter-options-button.component.html',
  styleUrl: './filter-options-button.component.scss',
})
export class FilterOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;

  constructor(
    private store: Store,
    private localStorage: StatePersistingService,
    private notificationService: NotificationService
  ) {}

  onSaveClick() {
    this.dispatchSaveFilterAction();
    this.notificationService.show($localize`Filtre og sortering gemt`, PopupMessageType.default);
  }

  onApplyClck() {
    this.dispatchApplyFilterAction();
    this.notificationService.show($localize`Anvender gemte filtre og sortering`, PopupMessageType.default);
  }

  onDeleteClick() {
    this.deleteFilterFromLocalStorage();
    this.notificationService.show($localize`Filtre og sortering slettet`, PopupMessageType.default);
  }

  private deleteFilterFromLocalStorage() {
    this.localStorage.remove(this.getLocalStorageFilterKey());
  }

  private getColumnsFromLocalStorage() {
    return this.localStorage.get<SavedFilterState>(this.getLocalStorageFilterKey());
  }

  private getLocalStorageFilterKey() {
    return this.entityType + '-saved-filter';
  }

  private dispatchSaveFilterAction() {
    const storeKey = this.getLocalStorageFilterKey();
    const saveAction = getSaveFilterAction(this.entityType);
    this.store.dispatch(saveAction(storeKey));
  }

  private dispatchApplyFilterAction() {
    const savedState = this.getColumnsFromLocalStorage();
    if (!savedState) return;
    const applyAction = getApplyFilterAction(this.entityType);
    this.store.dispatch(applyAction(savedState));
  }
}

export type SavedFilterState = {
  filter: CompositeFilterDescriptor | undefined;
  sort: SortDescriptor[] | undefined;
};

export function getSaveFilterAction(entityType: RegistrationEntityTypes) {
  switch (entityType) {
    case 'it-system-usage':
      return ITSystemUsageActions.saveITSystemUsageFilter;
    case 'it-system':
      return ITSystemActions.saveITSystemFilter;
    case 'it-interface':
      return ITInterfaceActions.saveITInterfacesFilter;
    case 'it-contract':
      return ITContractActions.saveITContractFilter;
    case 'data-processing-registration':
      return DataProcessingActions.saveDataProcessingFilter;
    default:
      throw `Save filter action for entity type ${entityType} not implemented`;
  }
}

export function getApplyFilterAction(entityType: RegistrationEntityTypes) {
  switch (entityType) {
    case 'it-system-usage':
      return ITSystemUsageActions.applyITSystemUsageFilter;
    case 'it-system':
      return ITSystemActions.applyITSystemFilter;
    case 'it-interface':
      return ITInterfaceActions.applyITInterfacesFilter;
    case 'it-contract':
      return ITContractActions.applyITContractFilter;
    case 'data-processing-registration':
      return DataProcessingActions.applyDataProcessingFilter;
    default:
      throw `Apply filter action for entity type ${entityType} not implemented`;
  }
}