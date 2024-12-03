import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatePersistingService } from './state-persisting.service';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { getApplyFilterAction, getSaveFilterAction } from '../helpers/grid-filter.helpers';
import { SavedFilterState } from '../models/grid/saved-filter-state.model';

@Injectable({ providedIn: 'root' })
export class GridFilterService {
  constructor(private store: Store, private localStorage: StatePersistingService) {}

  public deleteFilterFromLocalStorage(entityType: RegistrationEntityTypes) {
    this.localStorage.remove(this.getLocalStorageFilterKey(entityType));
  }

  public getColumnsFromLocalStorage(entityType: RegistrationEntityTypes) {
    return this.localStorage.get<SavedFilterState>(this.getLocalStorageFilterKey(entityType));
  }

  public dispatchSaveFilterAction(entityType: RegistrationEntityTypes) {
    const storeKey = this.getLocalStorageFilterKey(entityType);
    const saveAction = getSaveFilterAction(entityType);
    this.store.dispatch(saveAction(storeKey));
  }

  public dispatchApplyFilterAction(entityType: RegistrationEntityTypes) {
    const savedState = this.getColumnsFromLocalStorage(entityType);
    if (!savedState) return;
    const applyAction = getApplyFilterAction(entityType);
    this.store.dispatch(applyAction(savedState));
  }

  private getLocalStorageFilterKey(entityType: RegistrationEntityTypes) {
    return entityType + '-saved-filter';
  }
}
