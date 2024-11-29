import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { IdentityNamePair } from '../../../../models/identity-name-pair.model';
import { GridUsagesConsequencesDialogComponent } from '../grid-usages-consequences-dialog/grid-usages-consequences-dialog.component';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';

@Component({
  selector: 'app-grid-usages-dropdown-dialog',
  templateUrl: './grid-usages-dropdown-dialog.component.html',
  styleUrl: './grid-usages-dropdown-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesDropdownDialogComponent implements OnInit {
  @Input() rowEntityIdentifier!: string;
  @Input() usingOrganization!: IdentityNamePair;

  public readonly unusedItSystemsInOrganization$ = this.componentStore.unusedItSystemsInOrganization$;
  public readonly loadingUnusedItSystemsInOrganization$ = this.componentStore.select((state) => state.loading);
  private usingOrganizationUuid$ = of('');

  constructor(private readonly componentStore: GridUsagesDialogComponentStore, private readonly dialog: MatDialog) {}
  ngOnInit(): void {
    this.usingOrganizationUuid$ = of(this.usingOrganization.uuid);
  }

  public onFilterChange(nameContent: string) {
    this.componentStore.getUnusedItSystemsInOrganization(nameContent)(this.usingOrganizationUuid$);
  }

  public getTitle(){
    return `Anvendelsen kan flyttes til IT systemer, som endnu ikke er anvendt i ${this.usingOrganization.name}.`;
  }

  public onConfirm(targetItSystem: IdentityNamePair) {
    const dialogRef = this.dialog.open(GridUsagesConsequencesDialogComponent, { width: '1000px' });
    const componentInstance = dialogRef.componentInstance;
    componentInstance.title = $localize`Flytning af IT systemanvendelse`;
    componentInstance.usingOrganizationUuid$ = this.usingOrganizationUuid$;
    componentInstance.targetItSystemUuid = targetItSystem.uuid;
    componentInstance.rowEntityIdentifier = this.rowEntityIdentifier;
  }
}
