import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { mapSystemToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { ItSystemHierarchyTableComponentStore } from './it-system-hierarchy-table.component-store';

@Component({
  selector: 'app-it-system-hierarchy-table[systemUuid]',
  templateUrl: './it-system-hierarchy-table.component.html',
  styleUrls: ['./it-system-hierarchy-table.component.scss'],
  providers: [ItSystemHierarchyTableComponentStore],
})
export class ItSystemHierarchyTableComponent implements OnInit {
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly treeNodes$ = this.componentStore.hierarchy$.pipe(map((hierarchy) => mapSystemToTree(hierarchy)));
  public readonly extraStatusDisplayTypeValue = BooleanValueDisplayType.InUseNotInUse;

  @Input() public systemUuid!: string;

  constructor(private componentStore: ItSystemHierarchyTableComponentStore) {}

  ngOnInit() {
    this.componentStore.getHierarchy(this.systemUuid);
  }
}
