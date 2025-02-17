import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrl: './checkbox-cell.component.scss',
})
export class CheckboxCellComponent extends BaseCellComponent {
  @Output() public checkboxChange = new EventEmitter<boolean>();

  public onCheckboxChange(value: boolean | undefined): void {
    if (value === undefined) return;
    this.checkboxChange.emit(value);
  }
}
