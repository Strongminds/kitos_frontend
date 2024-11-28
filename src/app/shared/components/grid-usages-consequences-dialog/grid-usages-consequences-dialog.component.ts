import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
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

  public hasConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return (
          migration.affectedContracts &&
          migration.affectedContracts.length > 0 &&
          migration.affectedDataProcessingRegistrations &&
          migration.affectedDataProcessingRegistrations.length > 0 &&
          migration.affectedRelations &&
          migration.affectedRelations.length > 0
        );
      })
    );
  }

  public isConfirmDisabled() {
    return this.hasConsequences()
      .pipe(
        map((hasConsequences) => {
          if (!hasConsequences) return false;
          return !this.hasAcceptedConsequences;
        })
      );
  }
}
