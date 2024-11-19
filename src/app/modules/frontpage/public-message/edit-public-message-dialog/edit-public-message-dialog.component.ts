import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-public-message-dialog',
  templateUrl: './edit-public-message-dialog.component.html',
  styleUrl: './edit-public-message-dialog.component.scss',
})
export class EditPublicMessageDialogComponent implements OnInit {
  @Input() public message: string | undefined;

  public formGroup = new FormGroup({
    message: new FormControl<string | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<EditPublicMessageDialogComponent>) {}

  ngOnInit(): void {
    this.formGroup.patchValue({
      message: this.message,
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    const newMessage = this.formGroup.value.message;
  }
}
