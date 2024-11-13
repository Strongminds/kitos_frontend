import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GlobalAdminActions } from 'src/app/store/global-admin/actions';

@Component({
  selector: 'app-create-global-admin-dialog',
  templateUrl: './create-global-admin-dialog.component.html',
  styleUrl: './create-global-admin-dialog.component.scss',
})
export class CreateGlobalAdminDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateGlobalAdminDialogComponent>, private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(GlobalAdminActions.getGlobalAdmins());
  }

  public close(): void {
    this.dialogRef.close();
  }

  public addGlobalAdmin(): void {}
}
