import { Component, Input } from '@angular/core';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { EntitySelectionService } from 'src/app/shared/services/entity-selector-service';

export interface BulkActionButton {
  text: string;
  color: string;
  callback: () => void;
}
export interface BulkAtionSetion {
  options: APIIdentityNamePairResponseDTO[];
  entityType: RegistrationEntityTypes;
  title: string;
  primaryColumnTitle: string;
  secondaryColumnTitle?: string;
}

@Component({
  selector: 'app-bulk-action-dialog',
  templateUrl: './bulk-action-dialog.component.html',
  styleUrl: './bulk-action-dialog.component.scss',
  providers: [EntitySelectionService],
})
export class BulkActionDialogComponent {
  @Input() public title = $localize`Bekræft handling`;
  @Input() public sections!: BulkAtionSetion[];

  @Input() public options!: APIIdentityNamePairResponseDTO[];
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public actions!: BulkActionButton[];
}
