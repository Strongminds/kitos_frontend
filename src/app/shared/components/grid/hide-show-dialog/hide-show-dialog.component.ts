import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';

@Component({
  selector: 'app-hide-show-dialog',
  templateUrl: './hide-show-dialog.component.html',
  styleUrl: './hide-show-dialog.component.scss',
})
export class HideShowDialogComponent implements OnInit {
  @Input() columns!: GridColumn[];
  @Input() entityType!: RegistrationEntityTypes;

  public columnsCopy: GridColumn[] = [];
  public uniqueSections: string[] = [];

  constructor(private store: Store, private dialogRef: MatDialogRef<HideShowDialogComponent>) {}

  ngOnInit() {
    this.columnsCopy = this.columns.map((column) => ({ ...column }));
    this.uniqueSections = Array.from(new Set(this.columns.map((column) => column.section)));
  }

  changeVisibility(column: GridColumn) {
    column.hidden = !column.hidden;
  }

  save() {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.updateGridColumns(this.columnsCopy));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.updateGridColumns(this.columnsCopy));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.updateGridColumns(this.columnsCopy));
        break;
      default:
        throw `HideShowDialogComponent: ${this.entityType} not implemented`;
    }
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
