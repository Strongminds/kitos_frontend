import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
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

  constructor(private readonly dialogRef: MatDialogRef<EditUrlDialogComponent>, private readonly actions$: Actions) {
    super();
  }

  public disableSave() {
    return this.isBusy || this.hasNoChanges();
  }

  private urlIsInvalid(){
    return this.simpleLinkForm.controls.url.value === this.simpleLink?.url;
  }

  private hasNoChanges(){
    return this.urlIsInvalid() && this.simpleLinkForm.controls.name.value === this.simpleLink?.name;
  }


  ngOnInit(): void {
    if (this.simpleLink) {
      this.simpleLinkForm.patchValue({
        name: this.simpleLink.name,
        url: this.simpleLink.url,
      });
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchITSystemUsageSuccess), first())
        .subscribe(() => this.dialogRef.close())
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.patchITSystemUsageError)).subscribe(() => {
        this.isBusy = false;
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
}
