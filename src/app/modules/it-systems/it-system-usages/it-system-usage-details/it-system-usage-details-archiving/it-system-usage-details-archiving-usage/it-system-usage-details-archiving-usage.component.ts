import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import {
  APIArchivingUpdateRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIJournalPeriodResponseDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { RadioButtonOption } from 'src/app/shared/components/radio-buttons/radio-buttons.component';
import { ARCHIVE_TEXT } from 'src/app/shared/constants/constants';
import {
  ArchiveDutyChoice,
  archiveDutyChoiceOptions,
  mapArchiveDutyChoice,
} from 'src/app/shared/models/it-system-usage/archive-duty-choice.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageArchiving,
  selectItSystemUsageSystemContextUuid,
} from 'src/app/store/it-system-usage/selectors';
import { selectItSystemRecomendedArchiveDutyComment } from 'src/app/store/it-system/selectors';
import {
  selectITSystemUsageEnableActive,
  selectITSystemUsageEnableArchiveFrequency,
  selectITSystemUsageEnableArchiveLocation,
  selectITSystemUsageEnableArchiveSupplier,
  selectITSystemUsageEnableArchiveTestLocation,
  selectITSystemUsageEnableArchiveType,
  selectITSystemUsageEnableCatalogArchiveDuty,
  selectITSystemUsageEnableCatalogArchiveDutyComment,
  selectITSystemUsageEnableDocumentBearing,
  selectITSystemUsageEnableJournalPeriods,
  selectITSystemUsageEnableNotes,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { ItSystemUsageDetailsArchivingComponentStore } from '../it-system-usage-details-archiving.component-store';
import { ItSystemUsageDetailsJournalPeriodWriteDialogComponent } from '../write-dialog/it-system-usage-details-journal-period-write-dialog.component';
import { CardComponent } from '../../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../../shared/components/card-header/card-header.component';
import { FormGridComponent } from '../../../../../../shared/components/form-grid/form-grid.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { TextBoxInfoComponent } from '../../../../../../shared/components/textbox-info/textbox-info.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../../../../../shared/components/paragraph/paragraph.component';
import { ConnectedDropdownComponent } from '../../../../../../shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { NumericInputComponent } from '../../../../../../shared/components/numeric-input/numeric-input.component';
import { ContentVerticalCenterComponent } from '../../../../../../shared/components/content-vertical-center/content-vertical-center.component';
import { CheckboxComponent } from '../../../../../../shared/components/checkbox/checkbox.component';
import { RadioButtonsComponent } from '../../../../../../shared/components/radio-buttons/radio-buttons.component';
import { TextAreaComponent } from '../../../../../../shared/components/textarea/textarea.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NativeTableComponent } from '../../../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../../../shared/components/content-space-between/content-space-between.component';
import { TableRowActionsComponent } from '../../../../../../shared/components/table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../../../../../shared/components/buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../../../../../shared/components/icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { AppDatePipe } from '../../../../../../shared/pipes/app-date.pipe';

@Component({
  selector: 'app-it-system-usage-details-archiving-usage',
  templateUrl: './it-system-usage-details-archiving-usage.component.html',
  styleUrl: './it-system-usage-details-archiving-usage.component.scss',
  providers: [ItSystemUsageDetailsArchivingComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    FormGridComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    TextBoxInfoComponent,
    NgIf,
    ParagraphComponent,
    ConnectedDropdownComponent,
    NumericInputComponent,
    ContentVerticalCenterComponent,
    CheckboxComponent,
    RadioButtonsComponent,
    TextAreaComponent,
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    PencilIconComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
    AppDatePipe,
  ],
})
export class ItSystemUsageDetailsArchivingUsageComponent extends BaseComponent implements OnInit {
  private readonly journalFrequencyInputUpperLimit = 100;

  public readonly archiveForm = new FormGroup(
    {
      archiveDuty: new FormControl<ArchiveDutyChoice | undefined>(undefined),
      type: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      location: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      supplier: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      active: new FormControl<boolean | undefined>(undefined),
      testLocation: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
      notes: new FormControl<string | undefined>(undefined),
      frequencyInMonths: new FormControl<number | undefined>(
        undefined,
        Validators.max(this.journalFrequencyInputUpperLimit),
      ),
      documentBearing: new FormControl<boolean | undefined>(undefined),
    },
    { updateOn: 'blur' },
  );

  public readonly archiving$ = this.store.select(selectItSystemUsageArchiving);
  public readonly journalPeriods$ = this.archiving$.pipe(
    filterNullish(),
    map((archive) => archive.journalPeriods),
  );
  public readonly anyJournalPeriods$ = this.journalPeriods$.pipe(matchEmptyArray(), invertBooleanValue());
  public readonly recommendedArchiveDutyComment$ = this.store.select(selectItSystemRecomendedArchiveDutyComment);
  public readonly supplierOrganizations$ = this.componentStore.supplierOrganizations$;

  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);

  public readonly archiveTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-archive-type'))
    .pipe(filterNullish());
  public readonly archiveLocationTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-archive-location-type'))
    .pipe(filterNullish());
  public readonly archiveLocationTestTypes$ = this.store
    .select(selectRegularOptionTypes('it-system_usage-archive-location-test-type'))
    .pipe(filterNullish());

  public readonly archiveDutyChoice = archiveDutyChoiceOptions;
  public isArchiveDutySelected = false;

  public readonly activeOptions: Array<RadioButtonOption<boolean>> = [
    { id: true, label: 'Ja' },
    { id: false, label: 'Nej' },
  ];

  public readonly nationalArchivesText = ARCHIVE_TEXT;

  public readonly archiveTypeEnabled$ = this.store.select(selectITSystemUsageEnableArchiveType);
  public readonly archiveLocationEnabled$ = this.store.select(selectITSystemUsageEnableArchiveLocation);
  public readonly archiveSupplierEnabled$ = this.store.select(selectITSystemUsageEnableArchiveSupplier);
  public readonly archiveTestLocationEnabled$ = this.store.select(selectITSystemUsageEnableArchiveTestLocation);
  public readonly archiveFrequencyEnabled$ = this.store.select(selectITSystemUsageEnableArchiveFrequency);
  public readonly documentBearingEnabled$ = this.store.select(selectITSystemUsageEnableDocumentBearing);
  public readonly activeEnabled$ = this.store.select(selectITSystemUsageEnableActive);
  public readonly notesEnabled$ = this.store.select(selectITSystemUsageEnableNotes);
  public readonly journalPeriodsEnabled$ = this.store.select(selectITSystemUsageEnableJournalPeriods);
  public readonly itSystemCatalogItemUuid$ = this.store.select(selectItSystemUsageSystemContextUuid);
  public readonly catalogArchiveDutyEnabled$ = this.store.select(selectITSystemUsageEnableCatalogArchiveDuty);
  public readonly catalogArchiveDutyCommentEnabled$ = this.store.select(
    selectITSystemUsageEnableCatalogArchiveDutyComment,
  );

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService,
    private readonly componentStore: ItSystemUsageDetailsArchivingComponentStore,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.dispatchGetRegularOptionTypes();
    this.subscribeToArchiveDutyChanges();
    this.initializeArchiveForm();
    this.subscribeToJournalPeriodsChanges();
  }

  public supplierFilterChange(search?: string) {
    this.componentStore.getOrganizations(search);
  }

  public patchJournalFrequency(archiving: APIArchivingUpdateRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (this.archiveForm.controls.frequencyInMonths.valid) this.patchArchiving(archiving, valueChange);
    else if (valueChange) this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
  }

  public patchArchiving(archiving: APIArchivingUpdateRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ archiving }));
    }
  }

  public patchActiveValue(activeValue: boolean | undefined, valueChange?: ValidatedValueChange<unknown>) {
    this.patchArchiving({ active: activeValue }, valueChange);
  }

  public onAddNew() {
    this.dialog.open(ItSystemUsageDetailsJournalPeriodWriteDialogComponent);
  }

  public onEdit(journalPeriod: APIJournalPeriodResponseDTO) {
    const modifyDialogRef = this.dialog.open(ItSystemUsageDetailsJournalPeriodWriteDialogComponent);
    const modifyDialogInstance =
      modifyDialogRef.componentInstance as ItSystemUsageDetailsJournalPeriodWriteDialogComponent;
    modifyDialogInstance.journalPeriod = journalPeriod;
  }

  public onDelete(journalPeriod: APIJournalPeriodResponseDTO) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på at du vil fjerne denne journalperiode?`;
    confirmationDialogInstance.confirmColor = 'warn';

    confirmationDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result === true) {
          this.store.dispatch(ITSystemUsageActions.removeItSystemUsageJournalPeriod(journalPeriod.uuid));
        }
      });
  }

  private changeFormState(value: ArchiveDutyChoice | null | undefined) {
    const typeControl = this.archiveForm.controls.type;
    const locationControl = this.archiveForm.controls.location;
    const supplierControl = this.archiveForm.controls.supplier;
    const testLocationControl = this.archiveForm.controls.testLocation;
    const notesControl = this.archiveForm.controls.notes;
    const frequencyInMonthsControl = this.archiveForm.controls.frequencyInMonths;
    const documentBearingControl = this.archiveForm.controls.documentBearing;

    //calling enable/disable on the form causes a max call stack size exceeded error
    if (value) {
      this.isArchiveDutySelected = true;
      typeControl.enable();
      locationControl.enable();
      supplierControl.enable();
      testLocationControl.enable();
      notesControl.enable();
      frequencyInMonthsControl.enable();
      documentBearingControl.enable();
    } else {
      this.isArchiveDutySelected = false;
      typeControl.disable();
      locationControl.disable();
      supplierControl.disable();
      testLocationControl.disable();
      notesControl.disable();
      frequencyInMonthsControl.disable();
      documentBearingControl.disable();
    }
  }

  private dispatchGetRegularOptionTypes() {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-archive-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-archive-location-type'));
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-archive-location-test-type'));
  }

  private subscribeToArchiveDutyChanges() {
    this.subscriptions.add(
      this.archiveForm.controls.archiveDuty.valueChanges.subscribe((value) => {
        this.changeFormState(value);
      }),
    );
  }

  private initializeArchiveForm() {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageArchiving)
        .pipe(
          filterNullish(),
          concatLatestFrom(() => this.hasModifyPermission$),
        )
        .subscribe(([archive, hasModifyPermission]) => {
          this.archiveForm.patchValue({
            archiveDuty: mapArchiveDutyChoice(archive.archiveDuty),
            type: archive.type,
            location: archive.location,
            supplier: archive.supplier,
            active: archive.active,
            testLocation: archive.testLocation,
            notes: archive.notes,
            frequencyInMonths: archive.frequencyInMonths,
            documentBearing: archive.documentBearing,
          });

          if (hasModifyPermission && archive.archiveDuty) {
            this.archiveForm.enable();
          } else if (hasModifyPermission && !archive.archiveDuty) {
            this.archiveForm.controls.archiveDuty.enable();
          } else {
            this.archiveForm.disable();
          }
        }),
    );
  }

  private subscribeToJournalPeriodsChanges() {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.removeItSystemUsageJournalPeriodSuccess,
            ITSystemUsageActions.addItSystemUsageJournalPeriodSuccess,
            ITSystemUsageActions.patchItSystemUsageJournalPeriodSuccess,
          ),
        )
        .subscribe(({ itSystemUsageUuid }) => {
          this.store.dispatch(ITSystemUsageActions.getITSystemUsage(itSystemUsageUuid));
        }),
    );
  }

  public journalFrequencyPlaceholder() {
    return $localize`Indtast et heltal mellem 0 og ${this.journalFrequencyInputUpperLimit}`;
  }
}
