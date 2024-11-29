import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
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
    },
    {
      field: 'personalData',
      title: $localize`Almindelige personoplysninger`,
      hidden: false,
    },
    {
      field: 'personalDataCpr',
      title: $localize`CPR-nr`,
      hidden: false,
    },
    {
      field: 'personalDataSocialProblems',
      title: $localize`Væsentlige sociale problemer`,
      hidden: false,
    },
    {
      field: 'personalDataSocialOtherPrivateMatters',
      title: $localize`Andre rent private forhold`,
      hidden: false,
    },
    {
      field: 'sensitiveData',
      title: $localize`Følsomme personoplysninger`,
      hidden: false,
    },
    {
      field: 'legalData',
      title: $localize`Straffesager og lovovertrædelser`,
      hidden: false,
    },
    {
      field: 'sensitiveDataTypes',
      title: $localize`Valgte følsomme personoplysninger`,
      hidden: false,
    },
    {
      field: 'businessCritical',
      title: $localize`Forretningskritisk IT-System`,
      hidden: false,
    },
    {
      field: 'dataProcessingAgreementConcluded',
      title: $localize`Databehandleraftale`,
      hidden: false,
    },
    {
      field: 'linkToDirectory',
      title: $localize`Link til fortegnelse`,
      hidden: false,
    },
    {
      field: 'riskAssessment',
      title: $localize`Foretaget risikovurdering`,
      hidden: false,
    },
    {
      field: 'riskAssessmentDate',
      title: $localize`Dato for seneste risikovurdering`,
      hidden: false,
    },
    {
      field: 'plannedRiskAssessmentDate',
      title: $localize`Dato for planlagt risikovurdering`,
      hidden: false,
    },
    {
      field: 'preRiskAssessment',
      title: $localize`Hvad viste seneste risikovurdering`,
      hidden: false,
    },
    {
      field: 'dpia',
      title: $localize`Gennemført DPIA / Konsekvensanalyse`,
      hidden: false,
    },
    {
      field: 'hostedAt',
      title: $localize`IT-Systemet driftes`,
      hidden: false,
    },
  ];

  public readonly gdprReports$ = this.store.select(selectGdprReports);

  constructor(private store: Store) {
    this.store.dispatch(GdprReportActions.getGDPRReports());
  }
}
