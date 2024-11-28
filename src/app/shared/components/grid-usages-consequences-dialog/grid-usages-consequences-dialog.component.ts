import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest, map, Observable } from 'rxjs';
import { filterNullish } from '../../pipes/filter-nullish';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';

@Component({
  selector: 'app-grid-usages-consequences-dialog',
  templateUrl: './grid-usages-consequences-dialog.component.html',
  styleUrl: './grid-usages-consequences-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesConsequencesDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public targetItSystemUuid!: string;
  @Input() public usingOrganizationUuid$!: Observable<string>;
  @Input() rowEntityIdentifier!: string;

  public readonly migration$ = this.componentStore.migration$;
  public readonly loading$ = this.componentStore.loading$;
  public hasAcceptedConsequences: boolean = false;

  constructor(
    private readonly dialogRef: MatDialogRef<GridUsagesConsequencesDialogComponent>,
    private readonly componentStore: GridUsagesDialogComponentStore
  ) {}

  ngOnInit(): void {
    this.componentStore.getMigration(this.targetItSystemUuid)(this.rowEntityIdentifier)(this.usingOrganizationUuid$);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onConfirm() {
    this.dialogRef.close();
  }

  public hasConsequences(): Observable<boolean> {
    return combineLatest([
      this.hasContractsConsequences(),
      this.hasDprConsequences(),
      this.hasRelationsConsequences(),
    ]).pipe(map((results) => results.some((result) => result === true)));
  }

  public hasContractsConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return migration.affectedContracts && migration.affectedContracts.length > 0;
      })
    );
  }

  public hasDprConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return (
          migration.affectedDataProcessingRegistrations && migration.affectedDataProcessingRegistrations.length > 0
        );
      })
    );
  }

  public hasRelationsConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return migration.affectedRelations && migration.affectedRelations.length > 0;
      })
    );
  }

  public isConfirmDisabled() {
    return this.hasConsequences().pipe(
      map((hasConsequences) => {
        if (!hasConsequences) return false;
        return !this.hasAcceptedConsequences;
      })
    );
  }

  public formatSystemName(name: string | undefined, deactivated: boolean | undefined){
    if (!name) return '';
    return deactivated ? $localize`${name} (Ikke tilgængeligt)` : name
  }

  public copyConsequencesToClipboard(){
    
  }
}
