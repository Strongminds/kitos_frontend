import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { hostedAtOptions } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { riskAssessmentResultOptions } from 'src/app/shared/models/it-system-usage/gdpr/risk-assessment-result';
import { yesNoDontKnowOptions } from 'src/app/shared/models/yes-no-dont-know.model';
import { GdprReportActions } from 'src/app/store/it-system-usage/gdpr-report/actions';
import { selectGdprReports } from 'src/app/store/it-system-usage/gdpr-report/selectors';

@Component({
  selector: 'app-gdpr-overview',
  templateUrl: './gdpr-overview.component.html',
  styleUrl: './gdpr-overview.component.scss',
})
export class GdprOverviewComponent {
  public readonly gridColumns: GridColumn[] = [
    {
      field: 'systemUuid',
      title: $localize`UUID`,
      hidden: false,
    },
    {
      field: 'systemName',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'noData',
      title: $localize`Ingen personoplysninger`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'personalData',
      title: $localize`Almindelige personoplysninger`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'personalDataCpr',
      title: $localize`CPR-nr`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'personalDataSocialProblems',
      title: $localize`Væsentlige sociale problemer`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'personalDataSocialOtherPrivateMatters',
      title: $localize`Andre rent private forhold`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'sensitiveData',
      title: $localize`Følsomme personoplysninger`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'legalData',
      title: $localize`Straffesager og lovovertrædelser`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'sensitiveDataTypes',
      title: $localize`Valgte følsomme personoplysninger`,
      hidden: false,
      //TODO: How to handle this type
    },
    {
      field: 'businessCritical.name',
      title: $localize`Forretningskritisk IT-System`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: 'dataProcessingAgreementConcluded',
      title: $localize`Databehandleraftale`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'linkToDirectory',
      title: $localize`Link til fortegnelse`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: 'riskAssessment.name',
      title: $localize`Foretaget risikovurdering`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: 'riskAssessmentDate',
      title: $localize`Dato for seneste risikovurdering`,
      hidden: false,
      style: 'date',
      filter: 'date',
      width: 350,
    },
    {
      field: 'plannedRiskAssessmentDate',
      title: $localize`Dato for planlagt risikovurdering`,
      hidden: false,
      style: 'date',
      filter: 'date',
      width: 350,
    },
    {
      field: 'preRiskAssessment.name',
      title: $localize`Hvad viste seneste risikovurdering`,
      hidden: false,
      extraFilter: 'enum',
      extraData: riskAssessmentResultOptions,
    },
    {
      field: 'dpia.name',
      title: $localize`Gennemført DPIA / Konsekvensanalyse`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: 'hostedAt.name',
      title: $localize`IT-Systemet driftes`,
      hidden: false,
      extraData: hostedAtOptions,
      extraFilter: 'enum',
    },
  ];

  public readonly gdprReports$ = this.store.select(selectGdprReports);

  constructor(private store: Store) {
    this.store.dispatch(GdprReportActions.getGDPRReports());
  }
}
