import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityNamePair } from '../../models/identity-name-pair.model';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';
import { MatDialog } from '@angular/material/dialog';
import { GridUsagesConsequencesDialogComponent } from '../grid-usages-consequences-dialog/grid-usages-consequences-dialog.component';

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
    const dialogRef = this.dialog.open(GridUsagesConsequencesDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.title = $localize`Flytning af IT systemanvendelse`;

    componentInstance.targetItSystemUuid = itSystemIdentityNamePair.uuid;
  }
}
