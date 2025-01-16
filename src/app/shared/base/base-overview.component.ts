import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemoizedSelector, Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { GridExportActions } from 'src/app/store/grid/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES } from '../constants/constants';
import { GridColumn } from '../models/grid-column.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { BaseComponent } from './base.component';
import { selectGridState } from 'src/app/store/it-system-usage/selectors';
import { first } from 'rxjs';
import { GridState } from '../models/grid-state.model';

@Component({
  template: '',
})
export class BaseOverviewComponent extends BaseComponent {
  protected unclickableColumnFields: string[] = [];

  private stateSelector!: MemoizedSelector<string, GridState>;

  constructor(
    protected store: Store,
    @Inject('RegistrationEntityTypes') protected entityType: RegistrationEntityTypes
  ) {
    super();
    this.store.dispatch(UserActions.getUserGridPermissions());

    this.stateSelector;
  }

  protected updateUnclickableColumns(currentColumns: GridColumn[]) {
    this.unclickableColumnFields = [];
    currentColumns.forEach((column) => {
      if (column.style && DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES.includes(column.style)) {
        this.unclickableColumnFields.push(column.field);
      }
    });
  }

  protected rowIdSelect(event: CellClickEvent, router: Router, route: ActivatedRoute) {
    if (this.cellIsClickableStyleOrEmpty(event)) {
      const rowId = event.dataItem?.id;
      router.navigate([rowId], { relativeTo: route });
    }
  }

  protected cellIsClickableStyle(event: CellClickEvent) {
    const column = event.column;
    const columnFieldName = column.field;
    return !this.unclickableColumnFields.includes(columnFieldName);
  }

  protected onExcelExport = (exportAllColumns: boolean) => {
    this.store
      .select(this.getStateSelector())
      .pipe(first())
      .subscribe((gridState) => {
        this.store.dispatch(
          GridExportActions.exportDataFetch(exportAllColumns, { ...gridState, all: true }, this.entityType)
        );
      });
  };

  private getStateSelector() {
    switch (this.entityType) {
      case 'it-system-usage':
        return selectGridState;
      default:
        throw new Error('Invalid entity type');
    }
  }

  private cellIsClickableStyleOrEmpty(event: CellClickEvent) {
    return this.cellIsClickableStyle(event) || !this.getFieldData(event);
  }

  private getFieldData(event: CellClickEvent): boolean {
    if (!event.column.field.includes('.')) {
      return event.dataItem[event.column.field];
    }

    const fieldParts = event.column.field.split('.');
    let value = event.dataItem;

    for (const part of fieldParts) {
      if (value[part] === undefined) {
        value = undefined;
        break;
      } else {
        value = value[part];
      }
    }

    return value;
  }
}
