import { Component, Input } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { Observable } from 'rxjs';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private dialog: MatDialog) {}

  public getHelpTextKey(): string | undefined {
    switch (this.entityType) {
      case 'it-system-usage':
        return 'it-system.overview';
      case 'it-system':
        return 'it-system.catalog';
      case 'it-interface':
        return 'it-system.interfaceCatalog';
      case 'it-contract':
        return 'it-contract.overview';
      case 'data-processing-registration':
        return 'data-processing.overview';
      case 'organization-user':
        return 'organization.user';
      default:
        return undefined;
    }
  }

  public openHelpTextDialog() {
    const dialogRef = this.dialog.open(HelpDialogComponent, { maxHeight: '90vh', height: 'auto' });
    (dialogRef.componentInstance as HelpDialogComponent).helpTextKey = this.getHelpTextKey();
  }
}
