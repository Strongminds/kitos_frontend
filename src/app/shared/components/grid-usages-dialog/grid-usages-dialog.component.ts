import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectOrganizationName, selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { filterNullish } from '../../pipes/filter-nullish';
import { ConnectedDropdownDialogComponent } from '../dialogs/connected-dropdown-dialog/connected-dropdown-dialog.component';
import { GridUsagesDialogComponentStore } from './grid-usages-dialog.component-store';

@Component({
  selector: 'app-usages',
  templateUrl: './grid-usages-dialog.component.html',
  styleUrls: ['./grid-usages-dialog.component.scss'],
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesDialogComponent extends BaseComponent {
  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
  public readonly unusedItSystemsInOrganization$ = this.componentStore.unusedItSystemsInOrganization$;
  public readonly loadingUnusedItSystemsInOrganization$ = this.componentStore.select((state) => state.loading);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { usages: string[]; title: string },
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly componentStore: GridUsagesDialogComponentStore
  ) {
    super();
  }

  public clickMigrateUsage() {
    this.subscriptions.add(
      this.organizationName$
        .pipe(
          map((organizationName) => {
            const dialogRef = this.dialog.open(ConnectedDropdownDialogComponent);
            const componentInstance = dialogRef.componentInstance;
            componentInstance.title = $localize`Flytning af systemanvendelse for ${organizationName}`;
            componentInstance.dropdownText = $localize`Vælg IT system`;
            componentInstance.data$ = this.unusedItSystemsInOrganization$;
            componentInstance.isLoading$ = this.loadingUnusedItSystemsInOrganization$;
            componentInstance.filterChange.subscribe((nameContent) => this.onFilterChange(nameContent));
            // componentInstance.nested = true;
          })
        )
        .subscribe()
    );
  }

  public onFilterChange(nameContent: string) {
    this.componentStore.getUnusedItSystemsInOrganization(nameContent)(this.organizationUuid$);
  }
}
