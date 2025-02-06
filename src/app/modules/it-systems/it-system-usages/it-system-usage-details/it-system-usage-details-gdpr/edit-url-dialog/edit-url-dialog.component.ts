import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { debounceTime, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-edit-url-dialog',
  templateUrl: './edit-url-dialog.component.html',
  styleUrls: ['./edit-url-dialog.component.scss'],
})
export class EditUrlDialogComponent extends BaseComponent implements OnInit {
  @Input() simpleLink?: SimpleLink | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() submitMethod!: EventEmitter<any>;

  public readonly simpleLinkForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined),
    url: new FormControl<string | undefined>(undefined, Validators.required),
  });

  public isBusy = false;
  public showValidationError = false;

  constructor(private readonly dialogRef: MatDialogRef<EditUrlDialogComponent>, private readonly actions$: Actions) {
    super();
  }

  public disableSave() {
    if (this.isBusy) return true;

    return this.simpleLinkForm.invalid;
  }

  ngOnInit(): void {
    if (this.simpleLink) {
      this.simpleLinkForm.patchValue({
        name: this.simpleLink.name,
        url: this.simpleLink.url,
      });
    }

    //on success close the dialog
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchITSystemUsageSuccess), first())
        .subscribe(() => this.dialogRef.close())
    );

    //on error set isBusy to false
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.patchITSystemUsageError)).subscribe(() => {
        this.isBusy = false;
      })
    );

    this.subscriptions.add(
      this.simpleLinkForm.controls.url.valueChanges.pipe(debounceTime(300)).subscribe(() => {
        this.showValidationError = this.isUrlEmptyOrValid() === false;
      })
    );
  }

  onSave() {
    if (!this.simpleLinkForm.valid) return;
    const name = this.simpleLinkForm.value.name;
    const url = this.simpleLinkForm.value.url;

    this.isBusy = true;
    this.submitMethod.emit({ name: name ?? '', url: url });
  }

  onCancel() {
    this.dialogRef.close();
  }

  private isUrlEmptyOrValid() {
    const url = this.simpleLinkForm.value.url;
    return !url || validateUrl(url);
  }
}
