import { Component, Input } from '@angular/core';
import { DialogComponent } from '../../../../../shared/components/dialogs/dialog/dialog.component';
import { NgIf, NgFor } from '@angular/common';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';

@Component({
  selector: 'app-api-users-organizations-dialog',
  templateUrl: './api-users-organizations-dialog.component.html',
  styleUrl: './api-users-organizations-dialog.component.scss',
  imports: [DialogComponent, NgIf, NativeTableComponent, NgFor, ParagraphComponent],
})
export class ApiUsersOrganizationsDialogComponent {
  @Input() public organizationNames: string[] = [];
}
