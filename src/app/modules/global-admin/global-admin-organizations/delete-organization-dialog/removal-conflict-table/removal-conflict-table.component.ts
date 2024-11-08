import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { getConflictDescription } from '../org-removal-conflict.helper';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent {
  @Input() public removalConflicts$!: Observable<RemovalConflict[]>;
  @Input() public organizationName!: string;
  @Input() public type!: RemovalConflictType;
  @Input() public isCopying!: boolean;
  @Input() public useAccordion: boolean = true;

  public readonly defaultOrganizationName = 'Fælles Kommune';

  public getAccordionTitle(): string {
    return getConflictDescription(this.type, this.organizationName, this.defaultOrganizationName);
  }
}

export interface RemovalConflict {
  mainEntityName: string | undefined;
  entityName: string;
  organizationName: string;
}

export type RemovalConflictType =
  | 'contracts'
  | 'dprDataprocessor'
  | 'dprSubDataprocessor'
  | 'systemsRightsHolder'
  | 'systemsExposingInterfaces'
  | 'systemsParentSystem'
  | 'systemsUsages'
  | 'systemsArchiveSupplier'
  | 'interfaces';
