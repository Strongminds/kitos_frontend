import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grid-options-button',
  templateUrl: './grid-options-button.component.html',
  styleUrl: './grid-options-button.component.scss',
})
export class GridOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasResetButton: boolean = false;
  @Input() hasColumnConfigButtons: boolean = false;
  @Input() createPermission$?: Observable<boolean | undefined>;

  @Output() createAction = new EventEmitter<void>();

  public onCreateAction(): void {
    this.createAction.emit();
  }
}
