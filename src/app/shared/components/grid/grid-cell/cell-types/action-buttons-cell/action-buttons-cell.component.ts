import { Component, EventEmitter, Output } from '@angular/core';
import { BaseCellComponent } from '../../base-cell.component';

@Component({
    selector: 'app-action-buttons-cell',
    templateUrl: './action-buttons-cell.component.html',
    styleUrl: './action-buttons-cell.component.scss',
    standalone: false
})
export class ActionButtonsCellComponent extends BaseCellComponent {
  @Output() public modifyEvent = new EventEmitter<void>();
  @Output() public deleteEvent = new EventEmitter<void>();
  @Output() public toggleEvent = new EventEmitter<boolean>();

  public onModifyClick(): void {
    this.modifyEvent.emit();
  }

  public onDeleteClick(): void {
    this.deleteEvent.emit();
  }

  public onToggleChange(event: boolean): void {
    this.toggleEvent.emit(event);
  }
}
