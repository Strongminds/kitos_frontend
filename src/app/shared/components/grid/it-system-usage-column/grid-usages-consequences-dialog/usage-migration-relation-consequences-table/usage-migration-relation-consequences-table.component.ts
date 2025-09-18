import { Component, Input } from '@angular/core';
import { ItSystemUsageMigration } from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration.model';
import { ParagraphComponent } from '../../../../paragraph/paragraph.component';
import { NgIf, NgFor } from '@angular/common';
import { NativeTableComponent } from '../../../../native-table/native-table.component';
import { entityWithUnavailableName } from 'src/app/shared/helpers/string.helpers';

@Component({
  selector: 'app-usage-migration-relation-consequences-table[migration]',
  templateUrl: './usage-migration-relation-consequences-table.component.html',
  styleUrl: './usage-migration-relation-consequences-table.component.scss',
  imports: [ParagraphComponent, NgIf, NativeTableComponent, NgFor],
})
export class UsageMigrationRelationConsequencesTableComponent {
  @Input() migration!: ItSystemUsageMigration;
  @Input() isCopyingToClipboard: boolean = false;

  public formatSystemName(name: string | undefined, deactivated: boolean | undefined) {
    if (!name) return '';
    return entityWithUnavailableName(name, !deactivated);
  }
}
