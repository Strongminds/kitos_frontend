import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { NotInUseIconComponent } from 'src/app/shared/components/icons/not-in-use-icon.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { DeleteOrArchiveChoice } from 'src/app/shared/enums/delete-or-archive-choice';

@Component({
  selector: 'app-delete-or-archive-system-usage-dialog',
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    NotInUseIconComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
  templateUrl: './delete-or-archive-system-usage-dialog.component.html',
  styleUrls: ['./delete-or-archive-system-usage-dialog.component.scss'],
})
export class DeleteOrArchiveSystemUsageDialogComponent extends BaseComponent {
  @Input() public bodyText = '';
  title = $localize`Er du sikker på, at du vil fjerne den lokale anvendelse af systemet?`;

  constructor(private readonly dialog: MatDialogRef<DeleteOrArchiveSystemUsageDialogComponent>) {
    super();
  }

  public DeleteResult() {
    this.dialog.close(DeleteOrArchiveChoice.Delete);
  }

  public ArchiveResult() {
    this.dialog.close(DeleteOrArchiveChoice.Archive);
  }

  public CancelResult() {
    this.dialog.close(DeleteOrArchiveChoice.None);
  }
}
