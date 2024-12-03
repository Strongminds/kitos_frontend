import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  CellClickEvent,
  ColumnReorderEvent,
  ColumnResizeArgs,
  ExcelExportEvent,
  GridComponent as KendoGridComponent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  isCompositeFilterDescriptor,
  process,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { get } from 'lodash';
import { combineLatest, first, map, Observable } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { GridExportActions } from 'src/app/store/grid/actions';
import { selectExportAllColumns, selectReadyToExport } from 'src/app/store/grid/selectors';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { BaseComponent } from '../../base/base.component';
import { includedColumnInExport } from '../../helpers/grid-export.helper';
import { getApplyFilterAction, getSaveFilterAction } from '../../helpers/grid-filter.helpers';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { GridState } from '../../models/grid-state.model';
import { SavedFilterState } from '../../models/grid/saved-filter-state.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { StatePersistingService } from '../../services/state-persisting.service';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent<T> extends BaseComponent implements OnInit, OnChanges {
  @ViewChild(KendoGridComponent) grid?: KendoGridComponent;
  @Input() data$!: Observable<GridData | null>;
  @Input() columns$!: Observable<GridColumn[] | null>;
  @Input() loading: boolean | null = false;
  @Input() entityType!: RegistrationEntityTypes;

  @Input() state?: GridState | null;
  @Input() exportToExcelName?: string | null;

  @Input() createPermission?: boolean | null;
  @Input() modifyPermission?: boolean | null;
  @Input() deletePermission?: boolean | null;

  @Output() stateChange = new EventEmitter<GridState>();
  @Output() rowIdSelect = new EventEmitter<CellClickEvent>();
  @Output() deleteEvent = new EventEmitter<T>();
  @Output() modifyEvent = new EventEmitter<T>();

  private data: GridData | null = null;

  public readyToExport$ = this.store.select(selectReadyToExport);
  public exportAllColumns$ = this.store.select(selectExportAllColumns);
  public displayedColumns?: string[];
  public dataSource = new MatTableDataSource<T>();

  public readonly defaultColumnWidth = 270;
  public readonly defaultMinimumColumnWidth = 50;
  public readonly defaultDateColumnWidth = 350;

  constructor(
    private actions$: Actions,
    private store: Store,
    private localStorage: StatePersistingService,
    private confirmActionService: ConfirmActionService,
    private router: Router
  ) {
    super();
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.readyToExport$.subscribe((ready) => {
        if (ready) {
          this.excelExport();
        }
      })
    );
    this.subscriptions.add(
      this.data$.subscribe((data) => {
        this.data = data;
      })
    );

    this.initializeFilterSubscriptions();

    const resetGridAction = this.getResetGridConfigAction();

    if (resetGridAction) {
      this.subscriptions.add(
        this.actions$.pipe(ofType(resetGridAction)).subscribe(() => {
          this.store.dispatch(getApplyFilterAction(this.entityType)({ filter: undefined, sort: undefined }));
        })
      );
    }

    this.actions$.pipe(ofType(ITSystemActions.executeUsageMigrationSuccess)).subscribe(() => {
      this.refreshPage();
    });

    const sort: SortDescriptor[] = this.getLocalStorageSort();
    if (!sort) return;
    this.onSortChange(sort);
  }

  private refreshPage() {
    location.reload();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Set state take for Kendo grid to correctly calculate page size and page numbers
    if (changes['data'] && this.state?.all === true) {
      this.state = { ...this.state, take: this.data?.total };
    }
  }

  public onStateChange(state: GridState) {
    this.state = state;
    this.stateChange.emit(state);
  }

  public onFilterChange(filter: CompositeFilterDescriptor | undefined) {
    const take = this.state?.all === true ? this.data?.total : this.state?.take;
    this.onStateChange({ ...this.state, skip: 0, take, filter });
  }

  public onSortChange(sort: SortDescriptor[] | undefined) {
    this.onStateChange({ ...this.state, sort });
    this.setLocalStorageSort(sort);
  }

  public onPageChange(event: PageChangeEvent) {
    this.onStateChange({ ...this.state, skip: event.skip, take: event.take });
  }

  public onPageSizeChange(pageSize?: number) {
    const take = pageSize ?? this.data?.total;
    this.onStateChange({ ...this.state, skip: 0, take, all: pageSize ? false : true });
  }

  public onResizeChange(event: ColumnResizeArgs[], columns: GridColumn[]) {
    const columnsCopy = JSON.parse(JSON.stringify(columns)) as GridColumn[];

    if (event.length > 0) {
      const changedColumnEvent = event[0];
      const columnIndex = columnsCopy.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (column) => column.field === (changedColumnEvent.column as any).field
      );
      if (columnIndex === -1) return;

      const columnToChangeWidth = columnsCopy[columnIndex];
      columnToChangeWidth.width = changedColumnEvent.newWidth;

      this.dispatchUpdateColumnsAction(columnsCopy);
    }
  }

  public onCellClick(event: CellClickEvent) {
    this.rowIdSelect.emit(event);
  }

  public onModifyClick(item: T) {
    this.modifyEvent.emit(item);
  }

  public onDeleteClick(item: T) {
    this.deleteEvent.emit(item);
  }

  public onColumnReorder(event: ColumnReorderEvent, columns: GridColumn[]) {
    const columnsCopy = [...columns];
    const columnsWithoutHidden = columnsCopy.filter((column) => !column.hidden);
    const targetColumn = columnsWithoutHidden[event.newIndex];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnToMove = columnsCopy.find((column) => column.field === (event.column as any).field);

    if (columnToMove) {
      const oldIndex = columnsCopy.indexOf(columnToMove);
      const newIndex = columnsCopy.indexOf(targetColumn);
      columnsCopy.splice(oldIndex, 1); // Remove the column from its old position
      columnsCopy.splice(newIndex, 0, columnToMove); // Insert the column at the new position

      this.dispatchUpdateColumnsAction(columnsCopy);
    }
  }

  public onExcelExport(e: ExcelExportEvent) {
    e.workbook.sheets[0].title = this.exportToExcelName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchProperty(object: any, property: string) {
    return get(object, property);
  }

  public checkboxChange(value: boolean | undefined, columnUuid?: string) {
    if (!columnUuid) return;
    if (value === true) {
      switch (this.entityType) {
        case 'it-system':
          this.store.dispatch(ITSystemUsageActions.createItSystemUsage(columnUuid));
          break;
        default:
          throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
      }
    } else {
      switch (this.entityType) {
        case 'it-system':
          this.confirmActionService.confirmAction({
            category: ConfirmActionCategory.Warning,
            message: $localize`Er du sikker på at du vil fjerne den lokale anvendelse af systemet? Dette sletter ikke systemet, men vil slette alle lokale detaljer vedrørende anvendelsen.`,
            onConfirm: () =>
              this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(columnUuid)),
          });
          break;
        default:
          throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
      }
    }
  }

  private excelExport(): void {
    if (this.grid) {
      this.grid.saveAsExcel();
      this.store.dispatch(GridExportActions.exportCompleted({ all: false }, this.entityType));
    }
  }

  public allData(): ExcelExportData {
    if (!this.data || !this.state) {
      return { data: [] };
    }
    this.data$.pipe(first()).subscribe((data) => {
      this.data = data;
    });
    const processedData = process(this.data.data, { ...this.state, skip: 0, take: this.data.total });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = processedData.data.map((item: any) => {
      const transformedItem = { ...item };
      let exportColumns: GridColumn[] = [];
      this.getFilteredExportColumns$()
        .pipe(first())
        .subscribe((columns) => {
          exportColumns = columns;
        });
      exportColumns.forEach((column) => {
        const field = column.field;
        if (field) {
          switch (column.style) {
            case 'chip':
              if (typeof transformedItem[field] === 'boolean') {
                const boolValue = transformedItem[field] ? 0 : 1;
                transformedItem[field] = column.extraData[boolValue].name;
              }
              break;
            case 'enum':
              if (typeof transformedItem[field] === 'object') {
                const enumValue = transformedItem[field];
                transformedItem[field] = enumValue.name;
              }
              break;
            case 'uuid-to-name':
              transformedItem[field] = transformedItem[`${column.dataField}`];
              break;
            case 'excel-only': {
              const roleEmailKeys: string[] = Object.keys(transformedItem.RoleEmails);
              roleEmailKeys.forEach((key) => {
                const prefixedKey = `Roles.${key}`;
                if (prefixedKey === field) {
                  transformedItem[`${column.title}`] = transformedItem.RoleEmails[key];
                }
              });
              break;
            }
            default:
              break;
          }
        }
      });
      return transformedItem;
    });

    return { data: formattedData };
  }

  public getFilteredExportColumns$() {
    return combineLatest([this.columns$, this.exportAllColumns$]).pipe(
      map(([columns, exportAllColumns]) => {
        return columns
          ? columns
              .filter(includedColumnInExport)
              .filter(
                (column) =>
                  exportAllColumns || (!column.hidden && (!this.isExcelOnlyColumn(column) || exportAllColumns))
              )
          : [];
      })
    );
  }

  private isExcelOnlyColumn(column: GridColumn): boolean {
    return column.style === 'excel-only';
  }

  public getExportName(): string {
    return this.exportToExcelName ? this.exportToExcelName : 'Export.xlsx';
  }

  private getLocalStorageSort(): SortDescriptor[] {
    return this.localStorage.get(this.localStorageSortKey());
  }

  private setLocalStorageSort(sort: SortDescriptor[] | undefined) {
    this.localStorage.set(this.localStorageSortKey(), sort);
  }

  private localStorageSortKey(): string {
    return this.entityType + '-sort';
  }

  private initializeFilterSubscriptions() {
    this.actions$.pipe(ofType(getSaveFilterAction(this.entityType))).subscribe(({ localStoreKey }) => {
      this.saveFilter(localStoreKey);
    });

    this.actions$.pipe(ofType(getApplyFilterAction(this.entityType))).subscribe(({ state }) => {
      const newState = {
        ...this.state,
        filter: this.mapCompositeFilterStringDatesToDateObjects(state.filter),
        sort: state.sort,
      };
      this.onStateChange(newState);
    });
  }

  private mapCompositeFilterStringDatesToDateObjects(
    filter: CompositeFilterDescriptor | undefined
  ): CompositeFilterDescriptor | undefined {
    if (!filter) return undefined;
    return {
      filters: filter.filters.map((filter) => {
        if (isCompositeFilterDescriptor(filter)) {
          return this.mapCompositeFilterStringDatesToDateObjects(filter);
        }
        if (this.isDateFilter(filter)) {
          return {
            ...filter,
            value: new Date(filter.value),
          };
        }
        return filter;
      }),
      logic: filter.logic,
    } as CompositeFilterDescriptor;
  }

  private isDateFilter(filter: FilterDescriptor): boolean {
    return filter.operator === 'gte' || filter.operator === 'lte';
  }

  private saveFilter(localStoreKey: string) {
    this.localStorage.set<SavedFilterState>(localStoreKey, { filter: this.state?.filter, sort: this.state?.sort });
  }

  private dispatchUpdateColumnsAction(columns: GridColumn[]) {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.updateGridColumns(columns));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.updateGridColumns(columns));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.updateGridColumns(columns));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.updateGridColumns(columns));
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.updateGridColumns(columns));
        break;
      case 'organization-user':
        this.store.dispatch(OrganizationUserActions.updateGridColumns(columns));
        break;
      default:
        throw `Column reorder for entity type ${this.entityType} not implemented: grid.component.ts`;
    }
  }

  private getResetGridConfigAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration;
      case 'it-contract':
        return ITContractActions.resetToOrganizationITContractColumnConfiguration;
      case 'data-processing-registration':
        return DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration;
      case 'organization-user':
        return OrganizationUserActions.resetGridConfiguration;
      default:
        return undefined;
    }
  }
}
