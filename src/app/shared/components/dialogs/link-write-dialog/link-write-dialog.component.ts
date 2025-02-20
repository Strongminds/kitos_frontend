import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';

@Component({
  selector: 'app-link-write-dialog',
  templateUrl: './link-write-dialog.component.html',
  styleUrl: './link-write-dialog.component.scss',
})
export class LinkWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() public url$!: Observable<string | undefined>;
  @Output() submitMethod = new EventEmitter();

  public readonly urlForm = new FormGroup({
    url: new FormControl<string | undefined>(undefined),
  });

  public showValidationError = false;

  constructor(private readonly dialogRef: MatDialogRef<LinkWriteDialogComponent>) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.url$.subscribe((url) => {
        this.urlForm.patchValue({
          url: url,
        });
      })
    );

    this.subscriptions.add(
      this.urlForm.controls.url.valueChanges.pipe(debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME)).subscribe(() => {
        this.showValidationError = this.isUrlEmptyOrValid() === false;
      })
    );
  }

  public onSave() {
    const url = this.urlForm.value.url;

    this.submitMethod.emit(url);
    this.dialogRef.close();
  }

  public hasNoChange() {
    return this.url$.pipe(
      map((existingUrl) => {
        const formUrl = this.urlForm.value.url;
        return existingUrl === formUrl;
      })
    );
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public isUrlEmptyOrValid() {
    const url = this.urlForm.value.url;
    return !url || validateUrl(url);
  }
}
