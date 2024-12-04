import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { CreateEntityWithNameDialogComponent } from '../create-entity-with-name-dialog/create-entity-with-name-dialog.component';

@Component({
  selector: 'app-create-entity-button',
  templateUrl: './create-entity-button.component.html',
  styleUrl: './create-entity-button.component.scss',
})
export class CreateEntityButtonComponent extends BaseComponent {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public hasCreatePermission$!: Observable<boolean | undefined>;

  constructor(private dialog: MatDialog) {
    super();
  }

  private getCreateTitle(): string {
    switch (this.entityType) {
      case 'it-contract':
        return $localize`Opret IT Kontrakt`;
      case 'it-system':
        return $localize`Opret IT System`;
      case 'it-interface':
        return $localize`Opret Snitflade`;
      case 'data-processing-registration':
        return $localize`Opret Registering`;
      default:
        throw `Entity type ${this.entityType} not supported.`;
    }
  }

  public openCreateDialog() {
    const dialogRef = this.dialog.open(CreateEntityWithNameDialogComponent);
    const dialogInstance = dialogRef.componentInstance as CreateEntityWithNameDialogComponent;
    dialogInstance.entityType = this.entityType;
    dialogInstance.title = this.getCreateTitle();
  }
}
