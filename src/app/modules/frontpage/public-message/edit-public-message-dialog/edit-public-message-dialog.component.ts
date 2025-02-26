import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { PublicMessage } from 'src/app/shared/models/public-message.model';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';

@Component({
  selector: 'app-edit-public-message-dialog',
  templateUrl: './edit-public-message-dialog.component.html',
  styleUrl: './edit-public-message-dialog.component.scss',
})
export class EditPublicMessageDialogComponent extends BaseComponent implements OnInit {
  @Input() publicMessage!: PublicMessage;

  public formGroup = new FormGroup({
    title: new FormControl<string | undefined>(undefined),
    shortDescription: new FormControl<string | undefined>(undefined),
    longDescription: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<EditPublicMessageDialogComponent>
  ) {
    super();
  }

  ngOnInit(): void {

    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.close();
      })
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    this.store.dispatch(GlobalAdminPublicMessageActions.editPublicMessages('', {}));
  }
}
