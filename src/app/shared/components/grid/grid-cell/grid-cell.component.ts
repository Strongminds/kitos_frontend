import { Component, Input } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrl: './grid-cell.component.scss',
})
export class GridCellComponent extends BaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dataItem!: any;
  @Input() column!: GridColumn;
}
