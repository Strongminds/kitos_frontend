import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridColumn } from '../models/grid-column.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { APIColumnConfigurationRequestDTO } from 'src/app/api/v2';

@Injectable({ providedIn: 'root' })
export class ColumnConfigService {
  constructor(private store: Store) {}

  public dispatchSaveAction(entityType: RegistrationEntityTypes, columns: GridColumn[]) {
    const mappedColumns = this.mapColumnsToGridConfigurationRequest(columns);
    switch (entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfiguration(mappedColumns));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.saveOrganizationalITContractColumnConfiguration(mappedColumns));
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.saveOrganizationalDataProcessingColumnConfiguration(mappedColumns));
        break;
      default:
        throw new Error(`No save action defined for entity type: ${entityType}`);
    }
  }

  public dispatchResetAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
      case 'it-contract':
        return this.store.dispatch(ITContractActions.resetToOrganizationITContractColumnConfiguration());
      case 'data-processing-registration':
        return this.store.dispatch(DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration());
      default:
        throw new Error(`No reset action defined for entity type: ${entityType}`);
    }
  }

  public dispatchDeleteAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return this.store.dispatch(ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfiguration());
      case 'it-contract':
        return this.store.dispatch(ITContractActions.deleteOrganizationalITContractColumnConfiguration());
      case 'data-processing-registration':
        return this.store.dispatch(DataProcessingActions.deleteOrganizationalDataProcessingColumnConfiguration());
      default:
        throw new Error(`No delete action defined for entity type: ${entityType}`);
    }
  }

  public getSaveSuccessConfigAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.saveOrganizationalITSystemUsageColumnConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.saveOrganizationalITContractColumnConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.saveOrganizationalDataProcessingColumnConfigurationSuccess;
      default:
        throw new Error(`No save action success defined for entity type: ${entityType}`);
    }
  }

  public getDeleteSuccessConfigAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.deleteOrganizationalITSystemUsageColumnConfigurationSuccess;
      case 'it-contract':
        return ITContractActions.deleteOrganizationalITContractColumnConfigurationSuccess;
      case 'data-processing-registration':
        return DataProcessingActions.deleteOrganizationalDataProcessingColumnConfigurationSuccess;
      default:
        throw new Error(`No delete action success defined for entity type: ${entityType}`);
    }
  }

  private mapColumnsToGridConfigurationRequest(columns: GridColumn[]): APIColumnConfigurationRequestDTO[] {
    return columns
      .map((column, index) => ({
        persistId: column.persistId,
        index,
        visible: !column.hidden && !column.disabledByUIConfig,
      }))
      .filter((column) => column.visible)
      .map(({ persistId, index }) => ({ persistId, index }));
  }
}
