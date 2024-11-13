import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-global-admin-dialog',
  templateUrl: './create-global-admin-dialog.component.html',
  styleUrl: './create-global-admin-dialog.component.scss'
})
export class CreateGlobalAdminDialogComponent {

  constructor(private dialogRef: MatDialogRef<CreateGlobalAdminDialogComponent>) {}

  public close(): void {
    this.dialogRef.close();
  }

  public addGlobalAdmin(): void {
    
  }
}
