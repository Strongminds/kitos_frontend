import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';

@Component({
  selector: 'app-grid-usages-consequences-dialog',
  templateUrl: './grid-usages-consequences-dialog.component.html',
  styleUrl: './grid-usages-consequences-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesConsequencesDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public sourceItSystemUuid!: string;
  @Input() public targetItSystemUuid!: string;
  @Input() public usingOrganizationUuid$!: Observable<string>;
  @Input() rowEntityIdentifier!: string | undefined;

  public readonly migration$ = this.componentStore.migration$;
  public readonly loading$ = this.componentStore.loading$;

  constructor(
    private readonly dialogRef: MatDialogRef<GridUsagesConsequencesDialogComponent>,
    private readonly componentStore: GridUsagesDialogComponentStore
  ) {}

  ngOnInit(): void {
    //todo add row entity identifier here to use for getting sourceUsageUuid to be passed to migration endpoint
    this.componentStore.getMigration(this.targetItSystemUuid)(this.usingOrganizationUuid$);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onMigrate() {}
}
