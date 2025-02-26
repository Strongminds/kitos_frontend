import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditPublicMessageDialogComponent } from './edit-public-message-dialog/edit-public-message-dialog.component';
import { PublicMessage } from 'src/app/shared/models/public-message.model';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { IconType } from 'src/app/shared/models/icon-type';
import { PublicMessageDialogComponent } from './public-message-dialog/public-message-dialog.component';

@Component({
  selector: 'app-public-message',
  templateUrl: './public-message.component.html',
  styleUrl: './public-message.component.scss',
})
export class PublicMessageComponent {
  @Input() publicMessage!: PublicMessage;
  @Input() iconType!: IconType;

  public readonly statusDisplayType = BooleanValueDisplayType.NormalUnstable;

  constructor(private dialog: MatDialog) {}

  public onEdit(): void {
    const dialogRef = this.dialog.open(PublicMessageDialogComponent);
    dialogRef.componentInstance.publicMessage = this.publicMessage;
  }
}
