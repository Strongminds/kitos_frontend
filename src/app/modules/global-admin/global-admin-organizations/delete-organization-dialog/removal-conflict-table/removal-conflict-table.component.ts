import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent {
  @Input() public removalConflicts$!: Observable<RemovalConflict[] | undefined>;
  @Input() public type!: RemovalConflictType;

  public getAccordionTitle(): string {
    switch (this.type) {
      case 'contracts':
        return 'en titel';
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getEntityTitle(): string {
    switch (this.type) {
      case 'contracts':
        return 'normal';
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
        return 'tooltip';
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
