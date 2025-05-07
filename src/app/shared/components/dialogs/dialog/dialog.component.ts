import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../../loading/loading.component';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
  imports: [CommonModule, DialogHeaderComponent, LoadingComponent],
})
export class DialogComponent {
  @Input() public title?: string;
  @Input() public url?: string;
  @Input() public icon?: 'help';
  @Input() public loading = false;
  @Input() public closable = true;
  @Input() public overflow: 'auto' | 'none' = 'auto';
  @Input() public withHeader = true;
  @Input() public backgroundColor: 'white' | 'grey' = 'white';
  @Input() public noPadding = false;
  @Input() public helpText?: string;
  @Input() public nested = false;

  constructor(protected dialog: MatDialogRef<DialogComponent>) {}

  public close() {
    this.dialog.close();
  }
}
