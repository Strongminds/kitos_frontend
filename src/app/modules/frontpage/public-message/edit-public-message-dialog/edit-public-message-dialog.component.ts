import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { PublicMessage } from 'src/app/shared/models/public-message.model';
import { StatusType, statusTypeOptions } from 'src/app/shared/models/status-type.model';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';

@Component({
  selector: 'app-edit-public-message-dialog',
  templateUrl: './edit-public-message-dialog.component.html',
  styleUrl: './edit-public-message-dialog.component.scss',
})
export class EditPublicMessageDialogComponent extends BaseComponent implements OnInit {
  @Input() publicMessage!: PublicMessage;

  public formGroup = new FormGroup({
    title: new FormControl<string | undefined>(undefined, Validators.required),
    status: new FormControl<StatusType | undefined>(undefined),
    shortDescription: new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(105)]),
    longDescription: new FormControl<string | undefined>(undefined),
  });

  public readonly statusTypeOptions = statusTypeOptions;

  constructor(
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<EditPublicMessageDialogComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      title: this.publicMessage.title,
      status: this.publicMessage.status,
      shortDescription: this.publicMessage.shortDescription,
      longDescription: this.publicMessage.longDescription,
    });

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
    const messageUuid = this.publicMessage.uuid;
    const request = this.createRequest();
    this.store.dispatch(GlobalAdminPublicMessageActions.editPublicMessages(messageUuid, request));
  }

  private createRequest(): APIPublicMessageRequestDTO {
    return {
      title: this.formGroup.value.title ?? undefined,
      shortDescription: this.formGroup.value.shortDescription ?? undefined,
      longDescription: this.formGroup.value.longDescription ?? undefined,
      status: this.getStatusValue(),
    };
  }

  private getStatusValue(): APIPublicMessageRequestDTO.StatusEnum | undefined {
    const value = this.formGroup.value.status?.value ?? null;
    //We need to allow null, to reset the value, but the generateed model does not allow it, so we have to cast
    return value as APIPublicMessageRequestDTO.StatusEnum | undefined;
  }
}
