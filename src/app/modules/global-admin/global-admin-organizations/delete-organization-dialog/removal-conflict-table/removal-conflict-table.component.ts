import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent {
  @Input() public removalConflicts$!: Observable<RemovalConflict[] | undefined>;
  @Input() public header!: RemovalConflictHeader;
  @Input() public title!: string;
  @Input() public tooltipText!: string;

  public hasMainEntity(): boolean {
    return this.header.mainEntityTitle !== undefined;
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
