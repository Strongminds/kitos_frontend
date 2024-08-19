import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import {
  ColumnReorderEvent,
  PageChangeEvent,
  CellClickEvent,
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { get } from 'lodash';
import { first, map, Observable } from 'rxjs';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { BaseComponent } from '../../base/base.component';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { GridState } from '../../models/grid-state.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { Actions, ofType } from '@ngrx/effects';
import { StatePersistingService } from '../../services/state-persisting.service';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent<T> extends BaseComponent implements OnChanges, OnInit {
  @Input() data$!: Observable<GridData | null>;
  @Input() columns$!: Observable<GridColumn[] | null>;
  @Input() loading: boolean | null = false;

  @Input() entityType!: RegistrationEntityTypes;

  @Input() state?: GridState | null;

  @Output() stateChange = new EventEmitter<GridState>();
  @Output() rowIdSelect = new EventEmitter<CellClickEvent>();

  private data: GridData | null = null;

  public displayedColumns?: string[];
  public dataSource = new MatTableDataSource<T>();

  constructor(
    private actions$: Actions,
    private store: Store,
    private dialog: MatDialog,
    private localStorage: StatePersistingService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {

    this.subscriptions.add(
      this.data$.subscribe((data) => {
        this.data = data;
      })
    );

    this.initializeFilterSubscriptions();

    const sort: SortDescriptor[] = this.getLocalStorageSort();
    if (!sort) return;
    this.onSortChange(sort);
  }

  updateGridColumnsFilterValue(obj: {value: string; columnField: string}) {
    this.columns$.pipe(first()).subscribe((columns) => {
      if (!columns) return;
      const idx = columns.findIndex((column) => column.field === obj.columnField);
      if (idx === -1) return;
      const newColumns = [...columns];
      const newColumn = { ...newColumns[idx], filterValue: obj.value };
      console.log(newColumn);
      newColumns[idx] = newColumn;
      this.dispatchColumnsUpdate(newColumns);
    })
    this.cdr.detectChanges(); //This makes the filter changes correctly apply the first time after a page reload
  }

  ngOnChanges(changes: SimpleChanges) {
    // Set state take for Kendo grid to correctly calculate page size and page numbers
    if (changes['data'] && this.state?.all === true) {
      this.state = { ...this.state, take: this.data?.total };
    }
  }

  public onStateChange(state: GridState) {
    this.state = state;
    this.stateChange.emit(state);
  }

  public onFilterChange(filter: CompositeFilterDescriptor) {
    const take = this.state?.all === true ? this.data?.total : this.state?.take;
    this.onStateChange({ ...this.state, skip: 0, take, filter });
  }

  public onSortChange(sort: SortDescriptor[]) {
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

  public onCellClick(event: CellClickEvent) {
    this.rowIdSelect.emit(event);
  }

  public onColumnReorder(event: ColumnReorderEvent, columns: GridColumn[]) {
    const columnsCopy = [...columns];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnToMove = columnsCopy.find((column) => column.field === (event.column as any).field);

    if (columnToMove) {
      const oldIndex = columnsCopy.indexOf(columnToMove);
      columnsCopy.splice(oldIndex, 1); // Remove the column from its old position
      columnsCopy.splice(event.newIndex, 0, columnToMove); // Insert the column at the new position

      this.dispatchColumnsUpdate(columnsCopy);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchProperty(object: any, property: string) {
    return get(object, property);
  }

  public checkboxChange(value: boolean | undefined, columnUuid?: string) {
    if (!columnUuid) return;
    if (value === true) {
      switch (this.entityType) {
        case 'it-system-usage':
          this.store.dispatch(ITSystemUsageActions.createItSystemUsage(columnUuid));
          break;
        default:
          throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.bodyText = $localize`Er du sikker på at du vil fjerne den lokale anvendelse af systemet? Dette sletter ikke systemet, men vil slette alle lokale detaljer vedrørende anvendelsen.`;
      dialogInstance.confirmColor = 'warn';

      this.subscriptions.add(
        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            switch (this.entityType) {
              case 'it-system-usage':
                this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(columnUuid));
                break;
              default:
                throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
            }
          }
        })
      );
    }
  }

  private getLocalStorageSort(): SortDescriptor[] {
    return this.localStorage.get(this.localStorageSortKey());
  }

  private setLocalStorageSort(sort: SortDescriptor[]) {
    this.localStorage.set(this.localStorageSortKey(), sort);
  }

  private localStorageSortKey(): string {
    return this.entityType + '-sort';
  }

  private getSaveAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.saveITSystemUsageFilter;
      case 'it-system':
        return ITSystemActions.saveITSystemFilter;
      case 'it-interface':
        return ITInterfaceActions.saveITInterfacesFilter;
      case 'it-contract':
        return ITContractActions.saveITContractFilter;
      default:
        throw `Save action for entity type ${this.entityType} not implemented: grid.component.ts`;
    }
  }

  getApplyAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.applyITSystemUsageFilter;
      case 'it-system':
        return ITSystemActions.applyITSystemFilter;
      case 'it-interface':
        return ITInterfaceActions.applyITInterfacesFilter;
      case 'it-contract':
        return ITContractActions.applyITContractFilter;
      default:
        throw `Apply action for entity type ${this.entityType} not implemented: grid.component.ts`;
    }
  }

  private initializeFilterSubscriptions() {
    this.actions$
      .pipe(
        ofType(this.getSaveAction()),
        map((action) => action.localStoreKey)
      )
      .subscribe((localStoreKey) => {
        this.saveFilter(localStoreKey);
      });

      this.actions$
      .pipe(
        ofType(this.getApplyAction()),
        map((action) => action.state.sort)
      )
      .subscribe((sort) => {
        this.onSortChange(sort);
      });
  }

  private saveFilter(localStoreKey: string) {
    this.columns$.pipe(first()).subscribe((columns) => {
      this.localStorage.set(localStoreKey, {columns: columns, sort: this.state?.sort});
    });
  }

  private dispatchColumnsUpdate(newColumns: GridColumn[]) {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.updateGridColumns(newColumns));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.updateGridColumns(newColumns));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.updateGridColumns(newColumns));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.updateGridColumns(newColumns));
        break;
      default:
        throw `Column update for entity type ${this.entityType} not implemented: grid.component.ts`;
    }
  }
}
