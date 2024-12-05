import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { hostedAtOptions } from 'src/app/shared/models/it-system-usage/gdpr/hosted-at.model';
import { riskAssessmentResultOptions } from 'src/app/shared/models/it-system-usage/gdpr/risk-assessment-result';
import { yesNoDontKnowOptions } from 'src/app/shared/models/yes-no-dont-know.model';
import { GdprReportActions } from 'src/app/store/it-system-usage/gdpr-report/actions';
import { selectGdprReports } from 'src/app/store/it-system-usage/gdpr-report/selectors';
import * as GdprFields from 'src/app/shared/constants/gdpr-overview-grid-column-constants';
import { of } from 'rxjs';
import { UIConfigService } from 'src/app/shared/services/ui-config-services/ui-config.service';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { mapDateToString } from 'src/app/shared/helpers/date.helpers';
import { GDPR_REPORT_FILE_PREEFIX } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-gdpr-overview',
  templateUrl: './gdpr-overview.component.html',
  styleUrl: './gdpr-overview.component.scss',
})
export class GdprOverviewComponent {
  private readonly gridColumns: GridColumn[] = [
    {
      field: GdprFields.SYSTEM_UUID,
      title: $localize`System UUID`,
      hidden: false,
    },
    {
      field: GdprFields.SYSTEM_NAME,
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: GdprFields.NO_DATA,
      title: $localize`Ingen personoplysninger`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.PERSONAL_DATA,
      title: $localize`Almindelige personoplysninger`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.PERSONAL_DATA_CPR,
      title: $localize`CPR-nr`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.PERSONAL_DATA_SOCIAL_PROBLEMS,
      title: $localize`Væsentlige sociale problemer`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.PERSONAL_DATA_SOCIAL_OTHER_PRIVATE_MATTERS,
      title: $localize`Andre rent private forhold`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.SENSITIVE_DATA,
      title: $localize`Følsomme personoplysninger`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.LEGAL_DATA,
      title: $localize`Straffesager og lovovertrædelser`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.SENSITIVE_DATA_TYPES,
      title: $localize`Valgte følsomme personoplysninger`,
      hidden: false,
    },
    {
      field: GdprFields.BUSINESS_CRITICAL_NAME,
      title: $localize`Forretningskritisk IT-System`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.DATA_PROCESSING_AGREEMENT_CONCLUDED,
      title: $localize`Databehandleraftale`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.LINK_TO_DIRECTORY,
      title: $localize`Link til fortegnelse`,
      hidden: false,
      style: 'boolean',
    },
    {
      field: GdprFields.RISK_ASSESSMENT_NAME,
      title: $localize`Foretaget risikovurdering`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.RISK_ASSESSMENT_DATE,
      title: $localize`Dato for seneste risikovurdering`,
      hidden: false,
      style: 'date',
      width: 350,
    },
    {
      field: GdprFields.PLANNED_RISK_ASSESSMENT_DATE,
      title: $localize`Dato for planlagt risikovurdering`,
      hidden: false,
      style: 'date',
      width: 350,
    },
    {
      field: GdprFields.PRE_RISK_ASSESSMENT_NAME,
      title: $localize`Hvad viste seneste risikovurdering`,
      hidden: false,
      extraFilter: 'enum',
      extraData: riskAssessmentResultOptions,
    },
    {
      field: GdprFields.DPIA_NAME,
      title: $localize`Gennemført DPIA / Konsekvensanalyse`,
      hidden: false,
      extraData: yesNoDontKnowOptions,
      extraFilter: 'enum',
    },
    {
      field: GdprFields.HOSTED_AT_NAME,
      title: $localize`IT-Systemet driftes`,
      hidden: false,
      extraData: hostedAtOptions,
      extraFilter: 'enum',
    },
  ];

  public readonly filteredGridColumns$ = of(this.gridColumns).pipe(
    this.uiConfigService.filterGridColumnsByUIConfig(UIModuleConfigKey.Gdpr)
  );

  public readonly gdprReports$ = this.store.select(selectGdprReports);

  constructor(private store: Store, private uiConfigService: UIConfigService) {
    this.store.dispatch(GdprReportActions.getGDPRReports());
  }

  public getExportName(): string {
    const currentDate = new Date();
    const formattedDate = mapDateToString(currentDate);
    return `${GDPR_REPORT_FILE_PREEFIX}-${formattedDate}`;
  }
}