import { Component, Input } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DialogActionsComponent } from 'src/app/shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from 'src/app/shared/components/dialogs/dialog/dialog.component';
import { NotInUseIconComponent } from 'src/app/shared/components/icons/not-in-use-icon.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from 'src/app/shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';

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
}
