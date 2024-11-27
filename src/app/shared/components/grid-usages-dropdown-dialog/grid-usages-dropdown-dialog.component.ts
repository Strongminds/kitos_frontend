import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { IdentityNamePair } from '../../models/identity-name-pair.model';
import { GridUsagesConsequencesDialogComponent } from '../grid-usages-consequences-dialog/grid-usages-consequences-dialog.component';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';

@Component({
  selector: 'app-grid-usages-dropdown-dialog',
  templateUrl: './grid-usages-dropdown-dialog.component.html',
  styleUrl: './grid-usages-dropdown-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesDropdownDialogComponent {
  @Input() public organizationName$!: Observable<string>;
  @Input() public organizationUuid$!: Observable<string>;
  @Input() public usingOrganizationUuid!: string;
  @Input() public sourceItSystemUuid!: string;

  public readonly unusedItSystemsInOrganization$ = this.componentStore.unusedItSystemsInOrganization$;
  public readonly loadingUnusedItSystemsInOrganization$ = this.componentStore.select((state) => state.loading);

  constructor(private readonly componentStore: GridUsagesDialogComponentStore, private readonly dialog: MatDialog) {}

  public onFilterChange(nameContent: string) {
    this.componentStore.getUnusedItSystemsInOrganization(nameContent)(this.organizationUuid$);
  }

  public onConfirm(targetItSystem: IdentityNamePair) {
    const dialogRef = this.dialog.open(GridUsagesConsequencesDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.title = $localize`Flytning af IT systemanvendelse`;
    componentInstance.usingOrganizationUuid$ = of(this.usingOrganizationUuid);
    componentInstance.targetItSystemUuid = targetItSystem.uuid;
    componentInstance.sourceItSystemUuid = this.sourceItSystemUuid;
  }
}
