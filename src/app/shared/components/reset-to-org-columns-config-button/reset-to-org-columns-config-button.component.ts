import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { NotificationService } from '../../services/notification.service';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { first, Observable } from 'rxjs';
import { APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2';
import { selectLastSeenGridConfig, selectUsageGridColumns } from 'src/app/store/it-system-usage/selectors';
import { GridColumn } from '../../models/grid-column.model';

@Component({
  selector: 'app-reset-to-org-columns-config-button',
  templateUrl: './reset-to-org-columns-config-button.component.html',
  styleUrl: './reset-to-org-columns-config-button.component.scss'
})
export class ResetToOrgColumnsConfigButtonComponent implements OnInit {

  @Input() public entityType!: RegistrationEntityTypes;

  @Input() public gridColumns$!: Observable<GridColumn[]>;

  private readonly lastSeenColumnConfig$: Observable<APIOrganizationGridConfigurationResponseDTO | undefined> = this.store.select(selectLastSeenGridConfig);

  public hasChanged: boolean = false;

  constructor(private store: Store, private notificationService: NotificationService) {}

  public ngOnInit(): void {

    

    this.gridColumns$.subscribe((columns) => {
      this.lastSeenColumnConfig$.pipe(first()).subscribe((config) => {
        this.hasChanged = this.areColumnsDifferentFromConfig(columns, config);
      });
    });
  }

  public resetColumnsConfig(): void {
    this.store.dispatch(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration());
    this.notificationService.showDefault($localize`kolonnevisning gendannet til organisationens standardopsætning`);
  }

  private areColumnsDifferentFromConfig(columns: GridColumn[], config: APIOrganizationGridConfigurationResponseDTO | undefined): boolean {
    if (!config) return false;
    const visibleColumns = columns.filter((column) => !column.hidden);
    const configColumns = config.visibleColumns;
    if (!configColumns) return false;
    if (visibleColumns.length !== configColumns.length) return true;
    const zipped = visibleColumns.map((column, index) => ( { column, configColumn: configColumns[index] }));
    return !zipped.every(({ column, configColumn }) => column.persistId === configColumn.persistId);
  }

  private getColumnSelector() {
    switch (this.entityType) {
      case 'it-system-usage':
        return selectUsageGridColumns;
      default:
        throw new Error('Unsupported entity type');
    }
  }

  private getLastSeenColumnConfigSelector() {
    switch (this.entityType) {
      case 'it-system-usage':
        return selectLastSeenGridConfig;
      default:
        throw new Error('Unsupported entity type');
    }
  }
}
