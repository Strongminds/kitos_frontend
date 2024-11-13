import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { helpTextColumns } from 'src/app/shared/models/global-admin/help-text-columns';
import { HelpText } from 'src/app/shared/models/help-text.model';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';
import { selectHelpTexts } from 'src/app/store/global-admin/help-texts/selectors';
import { CreateHelpTextDialogComponent } from './create-help-text-dialog/create-help-text-dialog.component';

@Component({
  selector: 'app-global-admin-help-texts',
  templateUrl: './global-admin-help-texts.component.html',
  styleUrl: './global-admin-help-texts.component.scss',
})
export class GlobalAdminHelpTextsComponent extends BaseComponent implements OnInit {
  public readonly helpTexts$ = this.store.select(selectHelpTexts);
  public readonly columns = helpTextColumns;

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(HelpTextActions.getHelpTexts());
  }

  public openEditDialog(helpText: HelpText) {}

  public openDeleteDialog(helpText: HelpText) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på, at du vil slette hjælpeteksten?`;
    confirmationDialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(HelpTextActions.deleteHelpText(helpText.Key));
          }
        })
    );
  }

  public onClickCreate() {
    this.dialog.open(CreateHelpTextDialogComponent);
  }
}
