import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import * as DprFields from 'src/app/shared/constants/data-processing-grid-column-constants';
import * as GdprFields from 'src/app/shared/constants/gdpr-overview-grid-column-constants';
import * as ContractFields from 'src/app/shared/constants/it-contracts-grid-column-constants';
import * as UsageFields from 'src/app/shared/constants/it-system-usage-grid-column-constants';
import {
  selectShowDataProcessingRegistrations,
  selectShowItContractModule,
  selectShowItSystemModule,
} from 'src/app/store/organization/selectors';
import {
  selectDprEnableMainContract,
  selectDprEnableReferences,
  selectDprEnableRoles,
  selectDprEnableScheduledInspectionDate,
  selectItContractEnableContractId,
  selectItContractEnableContractRoles,
  selectItContractsEnableAgreementDeadlines,
  selectItContractsEnableAgreementPeriod,
  selectItContractsEnableContractType,
  selectItContractsEnableCriticality,
  selectItContractsEnableExternalPayment,
  selectItContractsEnableInternalSigner,
  selectItContractsEnablePaymentModel,
  selectItContractsEnableProcurementInitiated,
  selectItContractsEnableProcurementPlan,
  selectItContractsEnableProcurementStrategy,
  selectItContractsEnablePurchaseForm,
  selectItContractsEnableTemplate,
  selectItContractsEnableTermination,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableGdpr,
  selectITSystemUsageEnableGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableLocalReferences,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableSystemRelations,
  selectITSystemUsageEnableTabArchiving,
  selectITSystemUsageEnableTabOrganization,
  selectITSystemUsageEnableTabSystemRoles,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';

@Injectable({
  providedIn: 'root',
})
export class GridUIConfigService {
  constructor(private store: Store) {}

  public getUIConfigApplications(moduleKey: UIModuleConfigKey): Observable<UIConfigGridApplication[]> {
    switch (moduleKey) {
      case UIModuleConfigKey.ItContract:
        return this.getItContractGridConfig();
      case UIModuleConfigKey.ItSystemUsage:
        return this.getItSystemUsageGridConfig();
      case UIModuleConfigKey.DataProcessingRegistrations:
        return this.getDataProcessingGridConfig();
      case UIModuleConfigKey.Gdpr:
        return this.getGdprGridConfig();
      default:
        throw new Error(`Module key ${moduleKey} is not supported`);
    }
  }

  private getItContractGridConfig(): Observable<UIConfigGridApplication[]> {
    const enabledContractId$ = this.store.select(selectItContractEnableContractId);
    const enabledAgreementPeriod$ = this.store.select(selectItContractsEnableAgreementPeriod);
    const enabledCriticality$ = this.store.select(selectItContractsEnableCriticality);
    const enabledInternalSigner$ = this.store.select(selectItContractsEnableInternalSigner);
    const enabledContractType$ = this.store.select(selectItContractsEnableContractType);
    const enabledContractTemplate$ = this.store.select(selectItContractsEnableTemplate);
    const enabledPurchaseForm$ = this.store.select(selectItContractsEnablePurchaseForm);
    const enabledProcurementStrategy$ = this.store.select(selectItContractsEnableProcurementStrategy);
    const enabledProcurementPlan$ = this.store.select(selectItContractsEnableProcurementPlan);
    const enabledProcurementInitiated$ = this.store.select(selectItContractsEnableProcurementInitiated);
    const enabledExternalPayment$ = this.store.select(selectItContractsEnableExternalPayment);
    const enabledPaymentModel$ = this.store.select(selectItContractsEnablePaymentModel);
    const enabledAgreementDeadlines$ = this.store.select(selectItContractsEnableAgreementDeadlines);
    const enabledTermination$ = this.store.select(selectItContractsEnableTermination);
    const enabledContractRoles$ = this.store.select(selectItContractEnableContractRoles);
    const itSystemModuleEnabled$ = this.store.select(selectShowItSystemModule);
    const dataProcessingModuleEnabled$ = this.store.select(selectShowDataProcessingRegistrations);

    return combineLatest([
      enabledContractId$,
      enabledAgreementPeriod$,
      enabledCriticality$,
      enabledInternalSigner$,
      enabledContractType$,
      enabledContractTemplate$,
      enabledPurchaseForm$,
      enabledProcurementStrategy$,
      enabledProcurementPlan$,
      enabledProcurementInitiated$,
      enabledExternalPayment$,
      enabledPaymentModel$,
      enabledAgreementDeadlines$,
      enabledTermination$,
      enabledContractRoles$,
      itSystemModuleEnabled$,
      dataProcessingModuleEnabled$,
    ]).pipe(
      map(
        ([
          enabledContractId,
          enabledAgreementPeriod,
          enabledCriticality,
          enabledInternalSigner,
          enabledContractType,
          enabledContractTemplate,
          enabledPurchaseForm,
          enabledProcurementStrategy,
          enabledProcurementPlan,
          enabledProcurementInitiated,
          enabledExternalPayment,
          enabledPaymentModel,
          enabledAgreementDeadlines,
          enabledTermination,
          enabledContractRoles,
          itSystemModuleEnabled,
          dataProcessingModuleEnabled,
        ]): UIConfigGridApplication[] => [
          {
            shouldEnable: itSystemModuleEnabled,
            columnNamesToConfigure: new Set([
              ContractFields.ItSystemUsages,
              ContractFields.NumberOfAssociatedSystemRelations,
              ContractFields.SourceEntityUuid,
            ]),
          },
          {
            shouldEnable: dataProcessingModuleEnabled,
            columnNamesToConfigure: new Set([ContractFields.DataProcessingAgreements]),
          },
          {
            shouldEnable: enabledContractId,
            columnNamesToConfigure: new Set([ContractFields.ContractId]),
          },
          {
            shouldEnable: enabledAgreementPeriod,
            columnNamesToConfigure: new Set([ContractFields.Concluded, ContractFields.ExpirationDate]),
          },
          {
            shouldEnable: enabledCriticality,
            columnNamesToConfigure: new Set([ContractFields.CriticalityUuid]),
          },
          {
            shouldEnable: enabledInternalSigner,
            columnNamesToConfigure: new Set([ContractFields.ContractSigner]),
          },
          {
            shouldEnable: enabledContractType,
            columnNamesToConfigure: new Set([ContractFields.ContractTypeUuid]),
          },
          {
            shouldEnable: enabledContractTemplate,
            columnNamesToConfigure: new Set([ContractFields.ContractTemplateUuid]),
          },
          {
            shouldEnable: enabledPurchaseForm,
            columnNamesToConfigure: new Set([ContractFields.PurchaseFormUuid]),
          },
          {
            shouldEnable: enabledProcurementStrategy,
            columnNamesToConfigure: new Set([ContractFields.ProcurementStrategyUuid]),
          },
          {
            shouldEnable: enabledProcurementPlan,
            columnNamesToConfigure: new Set([ContractFields.ProcurementPlanYear]),
          },
          {
            shouldEnable: enabledProcurementInitiated,
            columnNamesToConfigure: new Set([ContractFields.ProcurementInitiated]),
          },
          {
            shouldEnable: enabledExternalPayment,
            columnNamesToConfigure: new Set([
              ContractFields.AccumulatedAcquisitionCost,
              ContractFields.AccumulatedOperationCost,
              ContractFields.AccumulatedOtherCost,
              ContractFields.LatestAuditDate,
              ContractFields.AuditStatusWhite,
              ContractFields.AuditStatusYellow,
              ContractFields.AuditStatusRed,
              ContractFields.AuditStatusGreen,
            ]),
          },
          {
            shouldEnable: enabledPaymentModel,
            columnNamesToConfigure: new Set([
              ContractFields.OperationRemunerationBegunDate,
              ContractFields.PaymentModelUuid,
              ContractFields.PaymentFrequencyUuid,
            ]),
          },
          {
            shouldEnable: enabledAgreementDeadlines,
            columnNamesToConfigure: new Set([
              ContractFields.Duration,
              ContractFields.OptionExtendUuid,
              ContractFields.IrrevocableTo,
            ]),
          },
          {
            shouldEnable: enabledTermination,
            columnNamesToConfigure: new Set([ContractFields.TerminationDeadlineUuid, ContractFields.TerminatedAt]),
          },
          {
            shouldEnable: enabledContractRoles,
            columnNamesToConfigure: new Set([]),
            columnNameSubstringsToConfigure: new Set(['Roles.Role']),
          },
        ]
      )
    );
  }

  private getItSystemUsageGridConfig(): Observable<UIConfigGridApplication[]> {
    const enableLifeCycleStatus$ = this.store.select(selectITSystemUsageEnableLifeCycleStatus);
    const enableUsagePeriod$ = this.store.select(selectITSystemUsageEnableFrontPageUsagePeriod);
    const enableSelectContractToDetermineIfItSystemIsActive$ = this.store.select(
      selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive
    );
    const enableOrganization$ = this.store.select(selectITSystemUsageEnableTabOrganization);
    const enableSystemRoles$ = this.store.select(selectITSystemUsageEnableTabSystemRoles);
    const enableReferences$ = this.store.select(selectITSystemUsageEnableLocalReferences);
    const enableGdpr$ = this.store.select(selectITSystemUsageEnableGdpr);
    const enableArchiving$ = this.store.select(selectITSystemUsageEnableTabArchiving);
    const enableSystemRelations$ = this.store.select(selectITSystemUsageEnableSystemRelations);
    const itContractsModuleEnabled$ = this.store.select(selectShowItContractModule);
    const dataProcessingModuleEnabled$ = this.store.select(selectShowDataProcessingRegistrations);

    return combineLatest([
      enableLifeCycleStatus$,
      enableUsagePeriod$,
      enableSelectContractToDetermineIfItSystemIsActive$,
      enableOrganization$,
      enableSystemRoles$,
      enableReferences$,
      enableGdpr$,
      enableArchiving$,
      enableSystemRelations$,
      itContractsModuleEnabled$,
      dataProcessingModuleEnabled$,
    ]).pipe(
      map(
        ([
          enableLifeCycleStatus,
          enableUsagePeriod,
          enableSelectContractToDetermineIfItSystemIsActive,
          enableOrganization,
          enableSystemRoles,
          enableReferences,
          enableGdpr,
          enableArchiving,
          enableSystemRelations,
          itContractsModuleEnabled,
          dataProcessingModuleEnabled,
        ]): UIConfigGridApplication[] => [
          {
            shouldEnable: itContractsModuleEnabled && enableSelectContractToDetermineIfItSystemIsActive,
            columnNamesToConfigure: new Set([UsageFields.MainContractIsActive]),
          },
          {
            shouldEnable: itContractsModuleEnabled,
            columnNamesToConfigure: new Set([
              UsageFields.MainContractSupplierName,
              UsageFields.AssociatedContractsNamesCsv,
            ]),
          },
          {
            shouldEnable: dataProcessingModuleEnabled && enableGdpr,
            columnNamesToConfigure: new Set([
              UsageFields.DataProcessingRegistrationsConcludedAsCsv,
              UsageFields.DataProcessingRegistrationNamesAsCsv,
            ]),
          },
          {
            shouldEnable: enableLifeCycleStatus,
            columnNamesToConfigure: new Set([UsageFields.LifeCycleStatus, UsageFields.ActiveAccordingToLifeCycle]),
          },
          {
            shouldEnable: enableUsagePeriod,
            columnNamesToConfigure: new Set([
              UsageFields.ExpirationDate,
              UsageFields.Concluded,
              UsageFields.ActiveAccordingToValidityPeriod,
            ]),
          },
          {
            shouldEnable: enableSelectContractToDetermineIfItSystemIsActive,
            columnNamesToConfigure: new Set([UsageFields.MainContractSupplierName]),
          },
          {
            shouldEnable: enableOrganization,
            columnNamesToConfigure: new Set([
              UsageFields.ResponsibleOrganizationUnitName,
              UsageFields.RelevantOrganizationUnitNamesAsCsv,
            ]),
          },
          {
            shouldEnable: enableSystemRoles,
            columnNamesToConfigure: new Set([]),
            columnNameSubstringsToConfigure: new Set(['Roles.Role']),
          },
          {
            shouldEnable: enableReferences,
            columnNamesToConfigure: new Set([UsageFields.LocalReferenceTitle, UsageFields.LocalReferenceDocumentId]),
          },
          {
            shouldEnable: enableGdpr,
            columnNamesToConfigure: new Set([
              UsageFields.SensitiveDataLevelsAsCsv,
              UsageFields.LocalReferenceDocumentId,
              UsageFields.RiskSupervisionDocumentationName,
              UsageFields.LinkToDirectoryName,
              UsageFields.HostedAt,
              UsageFields.GeneralPurpose,
              UsageFields.RiskAssessmentDate,
              UsageFields.PlannedRiskAssessmentDate,
            ]),
          },
          {
            shouldEnable: enableArchiving,
            columnNamesToConfigure: new Set([
              UsageFields.ArchiveDuty,
              UsageFields.IsHoldingDocument,
              UsageFields.ActiveArchivePeriodEndDate,
            ]),
          },
          {
            shouldEnable: enableSystemRelations,
            columnNamesToConfigure: new Set([
              UsageFields.OutgoingRelatedItSystemUsagesNamesAsCsv,
              UsageFields.DependsOnInterfacesNamesAsCsv,
              UsageFields.IncomingRelatedItSystemUsagesNamesAsCsv,
            ]),
          },
        ]
      )
    );
  }

  private getDataProcessingGridConfig(): Observable<UIConfigGridApplication[]> {
    const mainContract$ = this.store.select(selectDprEnableMainContract);
    const dprRolesEnabled$ = this.store.select(selectDprEnableRoles);
    const referenceEnabled$ = this.store.select(selectDprEnableReferences);
    const scheduledInspectionDateEnabled$ = this.store.select(selectDprEnableScheduledInspectionDate);
    const itSystemModuleEnabled$ = this.store.select(selectShowItSystemModule);
    const itContractsModuleEnabled$ = this.store.select(selectShowItContractModule);

    return combineLatest([
      mainContract$,
      dprRolesEnabled$,
      referenceEnabled$,
      scheduledInspectionDateEnabled$,
      itSystemModuleEnabled$,
      itContractsModuleEnabled$,
    ]).pipe(
      map(
        ([
          mainContractEnabled,
          dprRolesEnabled,
          referenceEnabled,
          scheduledInspectionDate,
          itSystemModuleEnabled,
          itContractsModuleEnabled,
        ]): UIConfigGridApplication[] => {
          return [
            {
              shouldEnable: itSystemModuleEnabled,
              columnNamesToConfigure: new Set([DprFields.SystemNamesAsCsv, DprFields.SystemUuidsAsCsv]),
            },
            {
              shouldEnable: itContractsModuleEnabled,
              columnNamesToConfigure: new Set([DprFields.ContractNamesAsCsv, DprFields.ActiveAccordingToMainContract]),
            },
            {
              shouldEnable: mainContractEnabled,
              columnNamesToConfigure: new Set([DprFields.ActiveAccordingToMainContract]),
            },
            {
              shouldEnable: dprRolesEnabled,
              columnNamesToConfigure: new Set([]),
              columnNameSubstringsToConfigure: new Set(['Roles.Role']),
            },
            {
              shouldEnable: referenceEnabled,
              columnNamesToConfigure: new Set([DprFields.MainReferenceTitle, DprFields.MainReferenceUserAssignedId]),
            },
            {
              shouldEnable: scheduledInspectionDate,
              columnNamesToConfigure: new Set([DprFields.OversightScheduledInspectionDate]),
            },
          ];
        }
      )
    );
  }

  private getGdprGridConfig(): Observable<UIConfigGridApplication[]> {
    const enabledPlannedRiskAssesmentDate$ = this.store.select(selectITSystemUsageEnableGdprPlannedRiskAssessmentDate);
    return combineLatest([enabledPlannedRiskAssesmentDate$]).pipe(
      map(([enabledPlannedRiskAssesmentDate]) => [
        {
          shouldEnable: enabledPlannedRiskAssesmentDate,
          columnNamesToConfigure: new Set([GdprFields.PLANNED_RISK_ASSESSMENT_DATE]),
        },
      ])
    );
  }
}
