import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
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
      this.urlForm.controls.url.valueChanges.pipe(debounceTime(300)).subscribe(() => {
        this.showValidationError = this.isUrlEmptyOrValid() === false;
      })
    );
  }

  public onSave() {
    const url = this.urlForm.value.url;

    this.submitMethod.emit(url);
    this.dialogRef.close();
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public isUrlEmptyOrValid() {
    const url = this.urlForm.value.url;
    return !url || validateUrl(url);
  }
}
