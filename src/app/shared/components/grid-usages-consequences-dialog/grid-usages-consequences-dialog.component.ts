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

  public readonly migration$ = this.componentStore.migration$;
  public readonly loading$ = this.componentStore.loading$;

  constructor(
    private readonly dialogRef: MatDialogRef<GridUsagesConsequencesDialogComponent>,
    private readonly componentStore: GridUsagesDialogComponentStore
  ) {}

  ngOnInit(): void {
    console.log('Target UUID:', this.targetItSystemUuid);

    this.componentStore.getMigration(this.targetItSystemUuid)(this.usingOrganizationUuid$);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onMigrate() {}
}
