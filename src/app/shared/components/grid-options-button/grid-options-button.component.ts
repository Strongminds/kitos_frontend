import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { Store } from '@ngrx/store';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grid-options-button',
  templateUrl: './grid-options-button.component.html',
  styleUrl: './grid-options-button.component.scss',
})
export class GridOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasResetButton: boolean = false;
  @Input() createPermission$!: Observable<boolean | undefined>;

  @Output() createAction = new EventEmitter<void>();

  constructor(private store: Store) {}

  public readonly hasGridConfigPermission$ = this.store.select(selectGridConfigModificationPermission);

  public onCreateAction(): void {
    this.createAction.emit();
  }
}
