import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { ItContractHierarchyComponentStore } from '../it-contract-hierarchy/it-contract-hierarchy.component-store';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
  providers: [ItContractHierarchyComponentStore],
})
export class DeleteUserDialogComponent extends BaseComponent implements OnInit {
  public readonly hierarchy$ = this.componentStore.hierarchy$;
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());

  constructor(private readonly store: Store, private readonly componentStore: ItContractHierarchyComponentStore) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getHierarchy(this.contractUuid$);
  }
}
