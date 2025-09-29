import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export function hasOpenDialogs(dialog: MatDialog) {
  return dialog.openDialogs.length > 0;
}

export function hasOpenDialogOf<T>(dialog: MatDialog, targetComponent: new (...args: any[]) => T) {
  return dialog.openDialogs.some((d: MatDialogRef<any>) => d.componentInstance instanceof targetComponent);
}
