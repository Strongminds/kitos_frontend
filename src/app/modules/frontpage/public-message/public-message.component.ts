import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { EditPublicMessageDialogComponent } from './edit-public-message-dialog/edit-public-message-dialog.component';

@Component({
  selector: 'app-public-message',
  templateUrl: './public-message.component.html',
  styleUrl: './public-message.component.scss',
})
export class PublicMessageComponent {
  //eslint-disable-next-line
  @Input() content!: any;

  public readonly isUserGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(private readonly store: Store, private dialog: MatDialog) {}

  public onEdit(): void {
    const dialogRef = this.dialog.open(EditPublicMessageDialogComponent);
    dialogRef.componentInstance.message = this.content;
  }
}
