import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';
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
    url: new FormControl<string | undefined>(undefined),
  });

  public readonly statusTypeOptions = statusTypeOptions;

  public showUrlError = false;

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

    this.subscriptions.add(
      this.formGroup.controls.url.valueChanges.pipe(debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME)).subscribe((url) => {
        this.showUrlError = !this.isUrlEmptyOrValid(url ?? undefined);
      })
    );

    this.formGroup.patchValue({
      title: this.publicMessage.title,
      status: this.publicMessage.status,
      shortDescription: this.publicMessage.shortDescription,
      longDescription: this.publicMessage.longDescription,
      url: this.publicMessage.link,
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    const messageUuid = this.publicMessage.uuid;
    const request = this.createRequest();
    this.store.dispatch(GlobalAdminPublicMessageActions.editPublicMessages(messageUuid, request));
  }

  private isUrlEmptyOrValid(url?: string) {
    return !url || validateUrl(url);
  }

  private createRequest(): APIPublicMessageRequestDTO {
    const value = this.formGroup.value;
    return {
      title: value.title ?? undefined,
      shortDescription: value.shortDescription ?? undefined,
      longDescription: value.longDescription ?? undefined,
      link: value.url ?? undefined,
      status: this.getStatusValue(),
    };
  }

  private getStatusValue(): APIPublicMessageRequestDTO.StatusEnum | undefined {
    const value = this.formGroup.value.status?.value ?? null;
    //We need to allow null, to reset the value, but the generateed model does not allow it, so we have to cast (28/02/2025)
    return value as APIPublicMessageRequestDTO.StatusEnum | undefined;
  }
}
