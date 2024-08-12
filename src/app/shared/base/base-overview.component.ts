import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { GridColumn } from '../models/grid-column.model';
import { BaseComponent } from './base.component';
import { DEFAULT_UNCLICKABLE_GRID_COLUMNS } from '../constants';

@Component({
  template: '',
})
export class BaseOverviewComponent extends BaseComponent {
  protected unclickableColumnsTitles: string[] = [];

  constructor(){
    super();
  }

  protected updateUnclickableColumns(currentColumns: GridColumn[], unclickableColumnStyles: string[] = DEFAULT_UNCLICKABLE_GRID_COLUMNS){
    this.unclickableColumnsTitles = [];
    currentColumns.forEach((column) => {
      if (column.style && unclickableColumnStyles.includes(column.style)) {
        this.unclickableColumnsTitles.push(column.title);
      }
    });
  }

  protected rowIdSelect(event: CellClickEvent, router: Router, route: ActivatedRoute) {
    const columnTitle = event.column?.title;
    const rowId = event.dataItem?.id;
    if (!this.unclickableColumnsTitles.includes(columnTitle)) {
      router.navigate([rowId], { relativeTo: route });
    }
  }
}