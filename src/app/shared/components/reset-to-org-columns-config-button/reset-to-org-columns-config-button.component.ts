import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { GridColumn } from '../../models/grid-column.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { selectItSystemUsageLastSeenGridConfig } from 'src/app/store/it-system-usage/selectors';
import { selectItContractLastSeenGridConfig } from 'src/app/store/it-contract/selectors';
import { selectDataProcessingLastSeenGridConfig } from 'src/app/store/data-processing/selectors';
import { concatLatestFrom } from '@ngrx/operators';

@Component({
  selector: 'app-reset-to-org-columns-config-button',
  templateUrl: './reset-to-org-columns-config-button.component.html',
  styleUrl: './reset-to-org-columns-config-button.component.scss',
})
export class ResetToOrgColumnsConfigButtonComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public gridColumns$!: Observable<GridColumn[]>;

  public lastSeenGridConfig$!: Observable<APIOrganizationGridConfigurationResponseDTO | undefined>;

  public readonly tooltipText = $localize`OBS: Opsætning af overblik afviger fra kommunens standardoverblik. Tryk på 'Gendan kolonneopsætning' for at benytte den gældende opsætning.`;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.lastSeenGridConfig$ = this.getGridConfig();

    this.dispatchInitializeAction();
  }

  public resetColumnsConfig(): void {
    this.dispatchResetConfigAction();
  }

  public hasChanges(): Observable<boolean> {
    return this.gridColumns$.pipe(
      concatLatestFrom(() => this.lastSeenGridConfig$),
      map(([gridColumns, config]) => {
        return this.areColumnsDifferentFromConfig(gridColumns, config);
      })
    );
  }

  private getGridConfig(): Observable<APIOrganizationGridConfigurationResponseDTO | undefined> {
    switch (this.entityType) {
      case 'it-system-usage':
        return this.store.select(selectItSystemUsageLastSeenGridConfig);
      case 'it-contract':
        return this.store.select(selectItContractLastSeenGridConfig);
      case 'data-processing-registration':
        return this.store.select(selectDataProcessingLastSeenGridConfig);
      default:
        throw new Error('Unsupported entity type');
    }
  }

  private areColumnsDifferentFromConfig(
    columns: GridColumn[],
    config: APIOrganizationGridConfigurationResponseDTO | undefined
  ): boolean {
    if (!config) return false;
    const visibleColumns = columns.filter((column) => !column.hidden);
    const configColumns = config.visibleColumns;
    if (!configColumns) return false;
    if (visibleColumns.length !== configColumns.length) return true;
    const zipped = visibleColumns.map((column, index) => ({ column, configColumn: configColumns[index] }));
    const isDifferentFromConfig = zipped.some(
      ({ column, configColumn }) => column.persistId !== configColumn.persistId
    );
    return isDifferentFromConfig;
  }

  private dispatchResetConfigAction(): void {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.resetToOrganizationITContractColumnConfiguration());
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration());
        break;
      case 'organization-user':
        this.store.dispatch(OrganizationUserActions.resetGridConfiguration());
        break;
      default:
        throw new Error('Unsupported entity type');
    }
  }

  private dispatchInitializeAction(): void {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfiguration());
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.initializeITContractLastSeenGridConfiguration());
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.initializeDataProcessingLastSeenGridConfiguration());
        break;
      default:
        throw new Error('Unsupported entity type');
    }
  }
}
