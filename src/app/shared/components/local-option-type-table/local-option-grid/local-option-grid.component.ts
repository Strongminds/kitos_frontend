import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { LocalAdminOptionType, LocalAdminOptionTypeItem } from 'src/app/shared/models/options/local-admin-option-type.model';
import { EditLocalOptionTypeDialogComponent } from '../edit-local-option-type-dialog/edit-local-option-type-dialog.component';

@Component({
  selector: 'app-local-option-grid',
  templateUrl: './local-option-grid.component.html',
  styleUrl: './local-option-grid.component.scss',
})
export class LocalOptionGridComponent {
  @Input() public loading: boolean = false;
  @Input() public optionType!: LocalAdminOptionType;
  @Input() public optionTypes: LocalAdminOptionTypeItem[] = [];
  public readonly gridColumns: GridColumn[] = [
    {
      field: 'active',
      title: $localize`Aktiv`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'name',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'writeAccess',
      title: $localize`Skriv`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'description',
      title: $localize`Beskrivelse`,
      hidden: false,
    },
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'edit' }] as GridActionColumn[],
      width: 50,
    },
  ];

  constructor(private dialog: MatDialog) {}

  public onModify(optionType: LocalAdminOptionTypeItem): void {
    const dialogRef = this.dialog.open(EditLocalOptionTypeDialogComponent);
    dialogRef.componentInstance.optionTypeItem = optionType;
    dialogRef.componentInstance.optionType = this.optionType;
  }
}
