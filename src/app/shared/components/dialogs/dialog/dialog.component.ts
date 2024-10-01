import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
})
export class DialogComponent {
  @Input() public title?: string;
  @Input() public icon?: 'help';
  @Input() public loading = false;
  @Input() public closable = true;
  @Input() public overflow: 'auto' | 'none' = 'auto';
  @Input() public withHeader = true;
  @Input() public backgroundColor: 'white' | 'grey' = 'white';
  @Input() public noPadding = false;
  @Input() public helpText?: string;
  @Output() public enterKeypress = new EventEmitter();

  constructor(protected dialog: MatDialogRef<DialogComponent>) {}

  public close() {
    this.dialog.close();
  }

  public onEnterKeypress(){
    this.enterKeypress.emit();
  }
}
