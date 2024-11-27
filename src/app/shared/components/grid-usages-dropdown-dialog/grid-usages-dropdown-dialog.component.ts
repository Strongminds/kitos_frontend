import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityNamePair } from '../../models/identity-name-pair.model';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-grid-usages-dropdown-dialog',
  templateUrl: './grid-usages-dropdown-dialog.component.html',
  styleUrl: './grid-usages-dropdown-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesDropdownDialogComponent {
  @Input() public organizationName$!: Observable<string>;
  @Input() public organizationUuid$!: Observable<string>;

  public readonly unusedItSystemsInOrganization$ = this.componentStore.unusedItSystemsInOrganization$;
  public readonly loadingUnusedItSystemsInOrganization$ = this.componentStore.select((state) => state.loading);

  constructor(private readonly componentStore: GridUsagesDialogComponentStore, private readonly dialog: MatDialog) {}

  public onFilterChange(nameContent: string) {
    this.componentStore.getUnusedItSystemsInOrganization(nameContent)(this.organizationUuid$);
  }

  public onConfirm(itSystemIdentityNamePair: IdentityNamePair) {
    console.log('Clicked on IT system with uuid:', itSystemIdentityNamePair.uuid);

    //todo open 3rd dialog layer
  }
}
