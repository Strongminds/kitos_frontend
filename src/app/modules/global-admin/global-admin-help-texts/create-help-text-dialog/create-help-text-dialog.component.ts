import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIHelpTextCreateRequestDTO } from 'src/app/api/v2/model/helpTextCreateRequestDTO';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';

@Component({
  selector: 'app-create-help-text-dialog',
  templateUrl: './create-help-text-dialog.component.html',
  styleUrl: './create-help-text-dialog.component.scss',
})
export class CreateHelpTextDialogComponent {
  public readonly formGroup = new FormGroup({
    key: new FormControl<string | undefined>(undefined, Validators.required),
    title: new FormControl<string | undefined>(undefined),
    description: new FormControl<string | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<CreateHelpTextDialogComponent>, private store: Store) {}

  public onCreateHelpText(): void {
    const value = this.formGroup.value;
    if (!this.formGroup.valid || !value.key) return;

    const dto: APIHelpTextCreateRequestDTO = {
      key: value.key,
      title: value.title ?? undefined,
      description: value.description ?? undefined,
    };

    this.store.dispatch(HelpTextActions.createHelpText(dto));
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
