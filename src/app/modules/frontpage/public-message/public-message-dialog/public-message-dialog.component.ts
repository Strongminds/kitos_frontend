import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { PublicMessage } from 'src/app/shared/models/public-message.model';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { EditPublicMessageDialogComponent } from '../edit-public-message-dialog/edit-public-message-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-public-message-dialog',
  templateUrl: './public-message-dialog.component.html',
  styleUrl: './public-message-dialog.component.scss',
})
export class PublicMessageDialogComponent {
  @Input() publicMessage$!: Observable<PublicMessage>;

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

  public openEditDialog(publicMessage: PublicMessage): void {
    const dialogRef = this.dialog.open(EditPublicMessageDialogComponent);
    dialogRef.componentInstance.publicMessage = publicMessage;
  }
}
