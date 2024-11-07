import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent implements OnInit {
  @Input() public removalConflicts!: RemovalConflict[];
  @Input() public header!: RemovalConflictHeader;
  @Input() public title!: string;
  @Input() public tooltipText!: string;

  public ngOnInit(): void {
    console.log(this.removalConflicts);
  }

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
