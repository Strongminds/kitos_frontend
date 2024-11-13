import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIHelpTextUpdateRequestDTO } from 'src/app/api/v2/model/helpTextUpdateRequestDTO';
import { HelpText } from 'src/app/shared/models/help-text.model';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';

@Component({
  selector: 'app-edit-help-text-dialog',
  templateUrl: './edit-help-text-dialog.component.html',
  styleUrl: './edit-help-text-dialog.component.scss',
})
export class EditHelpTextDialogComponent implements OnInit {
  @Input() helpText!: HelpText;

  public readonly formGroup = new FormGroup({
    key: new FormControl<string | undefined>({
      value: undefined,
      disabled: true,
    }),
    title: new FormControl<string | undefined>(undefined),
    description: new FormControl<string | undefined>(undefined),
  });

  constructor(private readonly dialogRef: MatDialogRef<EditHelpTextDialogComponent>, private store: Store) {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      key: this.helpText.Key,
      title: this.helpText.Title,
      description: this.helpText.Description,
    });
  }

  public onEditHelpText() {
    const key = this.helpText.Key;
    if (!key) return;
    const value = this.formGroup.value;
    const dto: APIHelpTextUpdateRequestDTO = {
      title: value.title ?? undefined,
      description: value.description ?? undefined,
    };
    this.store.dispatch(HelpTextActions.updateHelpText(key, dto));
    this.dialogRef.close();
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
