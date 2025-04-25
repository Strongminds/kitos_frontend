import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-entity-dialog-action-buttons',
  templateUrl: './create-entity-dialog-action-buttons.component.html',
  styleUrl: './create-entity-dialog-action-buttons.component.scss',
  standalone: false,
})
export class CreateEntityDialogActionButtonsComponent {
  @Input() public alreadyExists!: boolean | null;
  @Input() public isFormValid!: boolean;

  @Output() public createEvent = new EventEmitter<boolean>();
  @Output() public cancelEvent = new EventEmitter<boolean>();
}
