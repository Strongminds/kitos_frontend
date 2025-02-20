import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from './base-cell.component';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrl: './grid-cell.component.scss',
})
export class GridCellComponent extends BaseCellComponent {
  @Output() public checkboxChange = new EventEmitter<boolean>();
  @Output() public toggleEvent = new EventEmitter<boolean>();
  @Output() public modifyEvent = new EventEmitter<void>();
  @Output() public deleteEvent = new EventEmitter<void>();

  public onCheckboxChange(value: boolean): void {
    this.checkboxChange.emit(value);
  }

  public onModifyEvent(): void {
    this.modifyEvent.emit();
  }

  public onDeleteEvent(): void {
    this.deleteEvent.emit();
  }

  public onToggleEvent(value: boolean): void {
    this.toggleEvent.emit(value);
  }
}
