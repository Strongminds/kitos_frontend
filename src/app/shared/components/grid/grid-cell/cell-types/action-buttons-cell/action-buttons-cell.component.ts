import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
  selector: 'app-action-buttons-cell',
  templateUrl: './action-buttons-cell.component.html',
  styleUrl: './action-buttons-cell.component.scss',
})
export class ActionButtonsCellComponent<T> extends BaseCellComponent {
  @Output() public modifyEvent = new EventEmitter<void>();
  @Output() public deleteEvent = new EventEmitter<void>();

  public onModifyClick(): void {
    this.modifyEvent.emit();
  }

  public onDeleteClick(): void {
    this.deleteEvent.emit();
  }
}
