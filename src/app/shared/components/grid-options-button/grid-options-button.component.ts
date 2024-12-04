import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { first } from 'rxjs';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { ColumnConfigService } from '../../services/column-config.service';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-grid-options-button',
  templateUrl: './grid-options-button.component.html',
  styleUrl: './grid-options-button.component.scss',
})
export class GridOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasResetButton: boolean = false;

  constructor(
    private confirmActionService: ConfirmActionService,
    private columnConfigService: ColumnConfigService,
    private actions$: Actions
  ) {}

  public onSaveColumnConfig(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Neutral,
      message: $localize`Er du sikker på at du vil gemme den nuværende kolonneopsætning af felter som standard til din organisation?`,
      onConfirm: () => {
        this.columnConfigService
          .getGridColumns(this.entityType)
          .pipe(first())
          .subscribe((columns) => {
            this.columnConfigService.dispatchSaveAction(this.entityType, columns);
            this.actions$
              .pipe(ofType(this.columnConfigService.getSaveSuccessConfigAction(this.entityType)), first())
              .subscribe(() => {
                this.columnConfigService.dispatchResetAction(this.entityType);
              });
          });
      },
    });
  }

  public onDeleteColumnConfig(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil slette den nuværende kolonneopsætning af felter som standard for din organisation?`,
      onConfirm: () => {
        this.columnConfigService.dispatchDeleteAction(this.entityType);
        this.actions$
          .pipe(ofType(this.columnConfigService.getDeleteSuccessConfigAction(this.entityType)), first())
          .subscribe(() => {
            this.columnConfigService.dispatchResetAction(this.entityType);
          });
      },
    });
  }
}
