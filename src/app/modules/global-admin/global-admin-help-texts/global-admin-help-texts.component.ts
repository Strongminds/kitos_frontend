import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { helpTextColumns } from 'src/app/shared/models/global-admin/help-text-columns';
import { HelpText } from 'src/app/shared/models/help-text.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';
import { selectHelpTexts } from 'src/app/store/global-admin/help-texts/selectors';
import { CreateHelpTextDialogComponent } from '../../../shared/components/dialogs/create-help-text-dialog/create-help-text-dialog.component';
import { EditHelpTextDialogComponent } from '../../../shared/components/dialogs/edit-help-text-dialog/edit-help-text-dialog.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { LocalGridComponent } from '../../../shared/components/local-grid/local-grid.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-global-admin-help-texts',
  templateUrl: './global-admin-help-texts.component.html',
  styleUrl: './global-admin-help-texts.component.scss',
  imports: [
    CardComponent,
    OverviewHeaderComponent,
    ButtonComponent,
    NgIf,
    LocalGridComponent,
    LoadingComponent,
    AsyncPipe,
  ],
})
export class GlobalAdminHelpTextsComponent implements OnInit {
  public readonly helpTexts$ = this.store.select(selectHelpTexts);
  public readonly columns = helpTextColumns;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly confirmActionService: ConfirmActionService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(HelpTextActions.getHelpTexts());
  }

  public openEditDialog(helpText: HelpText) {
    const dialogRef = this.dialog.open(EditHelpTextDialogComponent);
    dialogRef.componentInstance.helpText = helpText;
  }

  public openDeleteDialog(helpText: HelpText) {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på, at du vil slette hjælpeteksten?`,
      onConfirm: () => {
        this.store.dispatch(HelpTextActions.deleteHelpText(helpText.Key));
      },
    });
  }

  public onClickCreate() {
    this.dialog.open(CreateHelpTextDialogComponent);
  }
}
