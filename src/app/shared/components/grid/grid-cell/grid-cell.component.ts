import { Component, EventEmitter, Output } from '@angular/core';
import { CheckboxChange } from 'src/app/shared/models/grid/grid-events.model';
import { BaseCellComponent } from './base-cell.component';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrl: './grid-cell.component.scss',
})
export class GridCellComponent extends BaseCellComponent {
  @Output() public checkboxChange = new EventEmitter<CheckboxChange>();
  @Output() public modifyEvent = new EventEmitter<void>();
  @Output() public deleteEvent = new EventEmitter<void>();

  public onCheckboxChange(event: CheckboxChange): void {
    this.checkboxChange.emit(event);
  }

  public onModifyEvent(): void {
    this.modifyEvent.emit();
  }

  public onDeleteEvent(): void {
    this.deleteEvent.emit();
  }
}
