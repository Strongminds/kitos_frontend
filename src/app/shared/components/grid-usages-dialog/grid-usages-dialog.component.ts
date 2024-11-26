import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { ConnectedDropdownDialogComponent } from '../dialogs/connected-dropdown-dialog/connected-dropdown-dialog.component';

@Component({
  selector: 'app-usages',
  templateUrl: './grid-usages-dialog.component.html',
  styleUrls: ['./grid-usages-dialog.component.scss'],
})
export class GridUsagesDialogComponent {
  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());
  //todo make store setup for the migration endpoints
  // public readonly unusedItSystems$ =

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { usages: string[]; title: string },
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  public clickMigrateUsage() {
    this.organizationName$.pipe(
      map((organizationName) => {
        const dialogRef = this.dialog.open(ConnectedDropdownDialogComponent);
        const componentInstance = dialogRef.componentInstance;
        componentInstance.title = $localize`Flytning af systemanvendelse for ${organizationName}`;
        componentInstance.dropdownText = $localize`Vælg IT system`;
      })
    );
  }
}
