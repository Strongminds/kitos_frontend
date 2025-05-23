import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConnectedDropdownDialogComponent } from 'src/app/shared/components/dialogs/connected-dropdown-dialog/connected-dropdown-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectItContractHasModifyPermissions,
  selectItContractSystemAgreementElements,
  selectItContractSystemUsages,
} from 'src/app/store/it-contract/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { AgreementElementCreateDialogComponent } from './agreement-element-create-dialog/agreement-element-create-dialog.component';
import { ItContractSystemsComponentStore } from './it-contract-systems.component-store';
import {
  selectItContractEnableAgreementElements,
  selectItContractEnableSystemUsages,
  selectItContractEnableRelations,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { DetailsPageLinkComponent } from '../../../../shared/components/details-page-link/details-page-link.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { ExternalPageLinkComponent } from '../../../../shared/components/external-page-link/external-page-link.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-it-contract-systems',
  templateUrl: './it-contract-systems.component.html',
  styleUrl: './it-contract-systems.component.scss',
  providers: [ItContractSystemsComponentStore],
  imports: [
    NgIf,
    CardComponent,
    CardHeaderComponent,
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    DetailsPageLinkComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    ParagraphComponent,
    ExternalPageLinkComponent,
    LoadingComponent,
    AsyncPipe,
  ],
})
export class ItContractSystemsComponent extends BaseComponent implements OnInit {
  public readonly systemAgreementElements$ = this.store
    .select(selectItContractSystemAgreementElements)
    .pipe(filterNullish());
  public readonly systemUsages$ = this.store.select(selectItContractSystemUsages).pipe(filterNullish());
  public readonly anyAgreementElements$ = this.systemAgreementElements$.pipe(matchNonEmptyArray());
  public readonly anySystemUsages$ = this.systemUsages$.pipe(matchNonEmptyArray());
  public readonly relations$ = this.componentStore.systemRelations$;
  public readonly anyRelations$ = this.relations$.pipe(matchNonEmptyArray());
  public readonly relationsIsLoading$ = this.componentStore.systemRelationsIsLoading$;
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  public readonly agreementElementsEnabled$ = this.store.select(selectItContractEnableAgreementElements);
  public readonly systemUsagesEnabled$ = this.store.select(selectItContractEnableSystemUsages);
  public readonly systemRelationsEnabled$ = this.store.select(selectItContractEnableRelations);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly componentStore: ItContractSystemsComponentStore,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-agreement-element-types'));
  }

  public onAddNewAgreementElement(): void {
    this.dialog.open(AgreementElementCreateDialogComponent);
  }

  public onDeleteAgreementElement(agreementElementUuid: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.removeITContractSystemAgreementElement(agreementElementUuid));
          }
        }),
    );
  }

  public onAddNewSystemUsage(): void {
    const dialogRef = this.dialog.open(ConnectedDropdownDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.title = $localize`Tilføj system`;
    dialogInstance.dropdownText = $localize`IT System`;
    dialogInstance.data$ = this.componentStore.systemUsages$;
    dialogInstance.isLoading$ = this.componentStore.systemUsagesIsLoading$;
    dialogInstance.successActionType = ITContractActions.addITContractSystemUsageSuccess.type;
    dialogInstance.errorActionType = ITContractActions.addITContractSystemUsageError.type;
    dialogInstance.save.subscribe((data) => {
      this.store.dispatch(ITContractActions.addITContractSystemUsage(data.uuid));
    });
    dialogInstance.filterChange.subscribe((search) => this.searchSystemUsages(search));
  }

  public onDeleteSystemUsage(systemUsageUuid: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.removeITContractSystemUsage(systemUsageUuid));
          }
        }),
    );
  }

  private searchSystemUsages(search?: string): void {
    this.componentStore.searchSystemUsages(search);
  }
}
