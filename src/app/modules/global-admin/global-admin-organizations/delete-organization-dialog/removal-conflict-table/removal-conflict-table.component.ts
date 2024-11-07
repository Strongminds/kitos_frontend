import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent {
  @Input() public removalConflicts$!: Observable<RemovalConflict[] | undefined>;
  @Input() public organizationName!: string;
  @Input() public type!: RemovalConflictType;

  public getAccordionTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakt konflikter`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getEntityTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakt`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getMainEntityTitle(): string | undefined {
    switch (this.type) {
      case 'contracts':
        return undefined;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getTooltipText(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakter hvor organisationen "${this.organizationName}" er sat som "Leverandør", og hvor feltet dermed nulstilles:`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }
}

export interface RemovalConflictHeader {
  mainEntityTitle: string | undefined;
  entityTitle: string;
}

export interface RemovalConflict {
  mainEntityName: string | undefined;
  entityName: string;
  organizationName: string;
}

export type RemovalConflictType = 'contracts' | 'something';
