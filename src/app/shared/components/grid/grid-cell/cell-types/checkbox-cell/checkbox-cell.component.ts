import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';
import { CheckboxChange } from 'src/app/shared/models/grid/grid-events.model';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrl: './checkbox-cell.component.scss',
})
export class CheckboxCellComponent extends BaseCellComponent {
  @Output() public checkboxChange = new EventEmitter<CheckboxChange>();

  public onCheckboxChange(value: boolean | undefined, rowEntityUuid?: string): void {
    this.checkboxChange.emit({ value, rowEntityUuid });
  }
}
