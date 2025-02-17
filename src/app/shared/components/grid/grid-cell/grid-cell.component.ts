import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { CheckboxChange } from 'src/app/shared/models/grid/grid-events.model';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrl: './grid-cell.component.scss',
})
export class GridCellComponent extends BaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dataItem!: any;
  @Input() column!: GridColumn;
  @Input() createPermission: boolean = false;

  @Output() public checkboxChange = new EventEmitter<CheckboxChange>();

  public onCheckboxChange(event: CheckboxChange): void {
    this.checkboxChange.emit(event);
  }
}
