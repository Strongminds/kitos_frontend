import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyChoiceOptions } from 'src/app/shared/models/it-system-usage/archive-duty-choice.model';
import { dataSensitivityLevelOptions } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { hostedAtOptions } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { lifeCycleStatusOptions } from 'src/app/shared/models/life-cycle-status.model';
import { yesNoIrrelevantOptions } from 'src/app/shared/models/yes-no-irrelevant.model';
import { USAGE_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectGridData,
  selectGridState,
  selectIsLoading,
  selectITSystemUsageHasCreateCollectionPermission,
  selectUsageGridColumns,
} from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-system-usages.component.html',
  styleUrls: ['it-system-usages.component.scss'],
})
export class ITSystemUsagesComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly gridData$ = this.store.select(selectGridData);
  public readonly gridState$ = this.store.select(selectGridState);
  public readonly gridColumns$ = this.store.select(selectUsageGridColumns);

  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasCreatePermission$ = this.store.select(selectITSystemUsageHasCreateCollectionPermission);

  //mock subscription, remove once working on the Usage overview task
  public readonly gridColumns: GridColumn[] = [
    {
      field: 'ActiveAccordingToValidityPeriod',
      title: $localize`Status (Datofelter)`,
      section: $localize`IT Systemer`,
      filter: 'boolean',
      filterData: [
        {
          name: $localize`Aktivt`,
          value: true,
        },
        {
          name: $localize`Ikke aktivt`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'ActiveAccordingToLifeCycle',
      title: $localize`Status (Livscyklus)`,
      section: $localize`IT Systemer`,
      filter: 'boolean',
      filterData: [
        {
          name: $localize`Aktivt`,
          value: true,
        },
        {
          name: $localize`Ikke aktivt`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'MainContractIsActive',
      title: $localize`Status (Markeret kontrakt)`,
      section: $localize`IT Systemer`,
      filter: 'boolean',
      filterData: [
        {
          name: $localize`Aktivt`,
          value: true,
        },
        {
          name: $localize`Ikke aktivt`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      width: 340,
      hidden: false,
    },
    { field: 'LocalSystemId', title: $localize`Lokal System ID`, section: 'IT Systemer', hidden: true },
    { field: 'ItSystemUuid', title: $localize`IT-System (UUID)`, section: 'IT Systemer', width: 320, hidden: true },
    {
      field: 'ExternalSystemUuid',
      title: $localize`IT-System (Externt UUID)`,
      section: 'IT Systemer',
      width: 320,
      hidden: true,
    },
    {
      field: 'ParentItSystemName',
      title: $localize`Overordnet IT System`,
      section: 'IT Systemer',
      width: 320,
      hidden: true,
    },
    { field: 'SystemName', title: $localize`IT System`, section: 'IT Systemer', style: 'primary', hidden: false },
    { field: 'Version', title: $localize`Version`, section: 'IT Systemer', hidden: true },
    { field: 'LocalCallName', title: $localize`Lokal kaldenavn`, section: 'IT Systemer', hidden: true },
    {
      field: 'ResponsibleOrganizationUnitName',
      title: $localize`Ansv. organisationsenhed`,
      section: 'IT Systemer',
      width: 350,
      hidden: false,
    },
    {
      field: 'SystemPreviousName',
      title: $localize`Tidligere systemnavn`,
      section: 'IT Systemer',
      width: 350,
      hidden: false,
    },
    //Role columns
    {
      field: 'ItSystemBusinessTypeName',
      idField: 'ItSystemBusinessTypeUuid',
      title: $localize`Forretningstype`,
      section: 'IT Systemer',
      hidden: false,
    },
    { field: 'ItSystemKLEIdsAsCsv', title: $localize`KLE ID`, section: 'IT Systemer', noFilter: true, hidden: true },
    {
      field: 'ItSystemKLENamesAsCsv',
      title: $localize`KLE navn`,
      section: 'IT Systemer',
      noFilter: true,
      hidden: false,
    },
    {
      field: 'LocalReferenceTitle',
      idField: 'LocalReferenceUrl',
      title: $localize`Lokal Reference`,
      section: 'IT Systemer',
      style: 'title-link',
      hidden: false,
    },
    {
      field: 'LocalReferenceDocumentId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: 'IT Systemer',
      width: 300,
      hidden: true,
    },
    {
      field: 'SensitiveDataLevelsAsCsv',
      title: $localize`DataType`,
      section: 'IT Systemer',
      extraFilter: 'enum',
      filterData: dataSensitivityLevelOptions,
      hidden: false,
    },
    { field: 'MainContractSupplierName', title: $localize`Leverandør`, section: 'IT Systemer', hidden: false },
    { field: 'ItSystemRightsHolderName', title: $localize`Rettighedshaver`, section: 'IT Systemer', hidden: false },
    {
      field: 'ObjectOwnerName',
      title: $localize`Taget i anvendelse af`,
      section: 'IT Systemer',
      width: 280,
      hidden: true,
    },
    {
      field: 'LastChangedByName',
      title: $localize`Sidst redigeret: Bruger`,
      section: 'IT Systemer',
      width: 320,
      hidden: true,
    },
    {
      field: 'LastChangedAt',
      title: $localize`Sidst redigeret: Dato`,
      section: 'IT Systemer',
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: true,
    },
    {
      field: 'Concluded',
      title: $localize`Ibrugtagningsdato`,
      section: 'IT Systemer',
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'ExpirationDate',
      title: $localize`Slutdato for anvendelse`,
      section: 'IT Systemer',
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'LifeCycleStatus',
      title: $localize`Livscyklus`,
      section: 'IT Systemer',
      style: 'enum',
      extraFilter: 'enum',
      filterData: lifeCycleStatusOptions,
      hidden: false,
    },
    {
      field: 'ArchiveDuty',
      title: $localize`Arkiveringspligt`,
      section: 'IT Systemer',
      style: 'enum',
      extraFilter: 'enum',
      filterData: archiveDutyChoiceOptions,
      hidden: false,
    },
    {
      field: 'IsHoldingDocument',
      title: $localize`Er dokumentbærende`,
      section: $localize`IT Systemer`,
      filter: 'boolean',
      filterData: [
        {
          name: $localize`Ja`,
          value: true,
        },
        {
          name: $localize`Nej`,
          value: false,
        },
      ],
      entityType: 'it-system-usage',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'ActiveArchivePeriodEndDate',
      title: $localize`Journalperiode slutdato`,
      section: 'IT Systemer',
      style: 'date',
      noFilter: true,
      width: 350,
      hidden: true,
    },
    {
      field: 'RiskSupervisionDocumentationName',
      title: $localize`Risikovurdering`,
      section: 'IT Systemer',
      idField: 'RiskSupervisionDocumentationUrl',
      style: 'title-link',
      hidden: true,
    },
    {
      field: 'LinkToDirectoryName',
      title: $localize`Fortegnelse`,
      section: 'IT Systemer',
      idField: 'LinkToDirectoryUrl',
      style: 'title-link',
      hidden: true,
    },
    {
      field: 'HostedAt',
      title: $localize`IT systemet driftes`,
      section: 'IT Systemer',
      style: 'enum',
      extraFilter: 'enum',
      filterData: hostedAtOptions,
      hidden: false,
    },
    {
      field: 'GeneralPurpose',
      title: $localize`Systemets overordnede formål`,
      section: 'IT Systemer',
      width: 380,
      hidden: false,
    },
    {
      field: 'DataProcessingRegistrationsConcludedAsCsv',
      title: $localize`Databehandleraftale er indgået`,
      section: 'IT Systemer',
      style: 'enum',
      extraFilter: 'enum',
      width: 360,
      filterData: yesNoIrrelevantOptions,
      hidden: true,
    },
    {
      field: 'DataProcessingRegistrationNamesAsCsv',
      title: $localize`Databehandling`,
      section: 'IT Systemer',
      style: 'page-link',
      entityType: 'data-processing-registration',
      hidden: true,
    },
    {
      field: 'RiskAssessmentDate',
      title: $localize`Dato for seneste risikovurdering`,
      section: 'IT Systemer',
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'PlannedRiskAssessmentDate',
      title: $localize`Dato for planlagt risikovurdering`,
      section: 'IT Systemer',
      style: 'date',
      filter: 'date',
      width: 350,
      hidden: false,
    },
    { field: 'Note', title: $localize`Note`, section: 'IT Systemer', hidden: false },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private statePersistingService: StatePersistingService
  ) {}

  ngOnInit() {
    const existingColumns = this.statePersistingService.get<GridColumn[]>(USAGE_COLUMNS_ID);
    if (existingColumns) {
      this.store.dispatch(ITSystemUsageActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(ITSystemUsageActions.updateGridColumns(this.gridColumns));
    }

    // Refresh list on init
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemUsageActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
