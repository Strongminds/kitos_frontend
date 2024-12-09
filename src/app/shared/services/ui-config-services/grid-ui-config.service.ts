/* eslint-disable @ngrx/avoid-combining-selectors */
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
  selectDprEnableAgreementConcluded,
  selectDprEnableAssociatedContracts,
  selectDprEnableDataResponsible,
  selectDprEnabledOversightInterval,
  selectDprEnableItSystems,
  selectDprEnableLastChangedAt,
  selectDprEnableLastChangedBy,
  selectDprEnableMainContract,
  selectDprEnableOversightOptions,
  selectDprEnableOversights,
  selectDprEnableProcessors,
  selectDprEnableReferences,
  selectDprEnableRoles,
  selectDprEnableScheduledInspectionDate,
  selectDprEnableStatus,
  selectDprEnableSubProcessors,
  selectDprEnableTransferBasis,
  selectIContractsEnableSupplier,
  selectItContractEnableContractId,
  selectItContractEnableContractRoles,
  selectItContractEnableDataProcessing,
  selectItContractEnableReferences,
  selectItContractEnableRelations,
  selectItContractEnableSystemUsages,
  selectItContractsEnableAgreementDeadlines,
  selectItContractsEnableAgreementPeriod,
  selectItContractsEnableContractType,
  selectItContractsEnableCriticality,
  selectItContractsEnabledCreatedBy,
  selectItContractsEnabledlastModifedBy,
  selectItContractsEnabledlastModifedDate,
  selectItContractsEnableExternalPayment,
  selectItContractsEnableExternalSigner,
  selectItContractsEnableInternalSigner,
  selectItContractsEnableIsActive,
  selectItContractsEnableNotes,
  selectItContractsEnableParentContract,
  selectItContractsEnablePaymentModel,
  selectItContractsEnableProcurementInitiated,
  selectItContractsEnableProcurementPlan,
  selectItContractsEnableProcurementStrategy,
  selectItContractsEnablePurchaseForm,
  selectItContractsEnableResponsibleUnit,
  selectItContractsEnableTemplate,
  selectItContractsEnableTermination,
  selectITSystemUsageEnableAmountOfUsers,
  selectITSystemUsageEnableAssociatedContracts,
  selectITSystemUsageEnableDataClassification,
  selectITSystemUsageEnableDataProcessing,
  selectITSystemUsageEnableDescription,
  selectITSystemUsageEnabledSystemId,
  selectITSystemUsageEnableFrontPageUsagePeriod,
  selectITSystemUsageEnableGdprConductedRiskAssessment,
  selectITSystemUsageEnableGdprDataTypes,
  selectITSystemUsageEnableGdprDocumentation,
  selectITSystemUsageEnableGdprHostedAt,
  selectITSystemUsageEnableGdprPlannedRiskAssessmentDate,
  selectITSystemUsageEnableGdprPurpose,
  selectITSystemUsageEnableLastEditedAt,
  selectITSystemUsageEnableLastEditedBy,
  selectITSystemUsageEnableLifeCycleStatus,
  selectITSystemUsageEnableLocalReferences,
  selectITSystemUsageEnableRelevantUnits,
  selectITSystemUsageEnableResponsibleUnit,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
  selectITSystemUsageEnableStatus,
  selectITSystemUsageEnableSystemRelations,
  selectITSystemUsageEnableTabArchiving,
  selectITSystemUsageEnableTabSystemRoles,
  selectITSystemUsageEnableTakenIntoUsageBy,
  selectITSystemUsageEnableVersion,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { UIModuleConfigKey } from '../../enums/ui-module-config-key';
import { combineBooleansWithAnd } from '../../helpers/observable-helpers';
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
    const configObservables: Observable<UIConfigGridApplication>[] = [
      //Frontpage
      this.store.select(selectItContractEnableContractId).pipe(shouldEnable([ContractFields.ContractId])),
      this.store.select(selectItContractsEnableContractType).pipe(shouldEnable([ContractFields.ContractTypeUuid])),
      this.store.select(selectItContractsEnableTemplate).pipe(shouldEnable([ContractFields.ContractTemplateUuid])),
      this.store.select(selectItContractsEnableCriticality).pipe(shouldEnable([ContractFields.CriticalityUuid])),
      this.store.select(selectItContractsEnablePurchaseForm).pipe(shouldEnable([ContractFields.PurchaseFormUuid])),
      this.store.select(selectItContractsEnableIsActive).pipe(shouldEnable([ContractFields.IsActive])),
      this.store
        .select(selectItContractsEnableAgreementPeriod)
        .pipe(shouldEnable([ContractFields.Concluded, ContractFields.ExpirationDate])),
      this.store.select(selectItContractsEnableNotes).pipe(shouldEnable([])),

      this.store.select(selectItContractsEnableParentContract).pipe(shouldEnable([ContractFields.ParentContractName])),

      this.store
        .select(selectItContractsEnableResponsibleUnit)
        .pipe(shouldEnable([ContractFields.ResponsibleOrgUnitName])),
      this.store.select(selectItContractsEnableInternalSigner).pipe(shouldEnable([ContractFields.ContractSigner])),

      this.store.select(selectIContractsEnableSupplier).pipe(shouldEnable([ContractFields.SupplierName])),
      this.store.select(selectItContractsEnableExternalSigner).pipe(shouldEnable([])),

      this.store
        .select(selectItContractsEnableProcurementStrategy)
        .pipe(shouldEnable([ContractFields.ProcurementStrategyUuid])),
      this.store
        .select(selectItContractsEnableProcurementPlan)
        .pipe(shouldEnable([ContractFields.ProcurementPlanYear])),
      this.store
        .select(selectItContractsEnableProcurementInitiated)
        .pipe(shouldEnable([ContractFields.ProcurementInitiated])),

      this.store.select(selectItContractsEnabledCreatedBy).pipe(shouldEnable([])),
      this.store
        .select(selectItContractsEnabledlastModifedBy)
        .pipe(shouldEnable([ContractFields.LastEditedByUserName])),
      this.store.select(selectItContractsEnabledlastModifedDate).pipe(shouldEnable([ContractFields.LastEditedAtDate])),

      // IT Systems
      combineBooleansWithAnd([
        this.store.select(selectItContractEnableSystemUsages),
        this.store.select(selectShowItSystemModule),
      ]).pipe(shouldEnable([ContractFields.ItSystemUsages, ContractFields.ItSystemUsageUuidsAsCsv])),

      combineBooleansWithAnd([
        this.store.select(selectItContractEnableRelations),
        this.store.select(selectShowItSystemModule),
      ]).pipe(shouldEnable([ContractFields.NumberOfAssociatedSystemRelations])),

      //Data processing
      combineBooleansWithAnd([
        this.store.select(selectShowDataProcessingRegistrations),
        this.store.select(selectItContractEnableDataProcessing),
      ]).pipe(shouldEnable([ContractFields.DataProcessingAgreements])),

      //Agreement periods
      this.store
        .select(selectItContractsEnableAgreementDeadlines)
        .pipe(shouldEnable([ContractFields.Duration, ContractFields.OptionExtendUuid, ContractFields.IrrevocableTo])),

      this.store
        .select(selectItContractsEnableTermination)
        .pipe(shouldEnable([ContractFields.TerminationDeadlineUuid, ContractFields.TerminatedAt])),

      //Economy
      this.store
        .select(selectItContractsEnableExternalPayment)
        .pipe(
          shouldEnable([
            ContractFields.AccumulatedAcquisitionCost,
            ContractFields.AccumulatedOperationCost,
            ContractFields.AccumulatedOtherCost,
            ContractFields.LatestAuditDate,
            ContractFields.AuditStatusWhite,
            ContractFields.AuditStatusYellow,
            ContractFields.AuditStatusRed,
            ContractFields.AuditStatusGreen,
          ])
        ),

      this.store
        .select(selectItContractsEnablePaymentModel)
        .pipe(
          shouldEnable([
            ContractFields.OperationRemunerationBegunDate,
            ContractFields.PaymentModelUuid,
            ContractFields.PaymentFrequencyUuid,
          ])
        ),

      //Contract Roles
      this.store.select(selectItContractEnableContractRoles).pipe(shouldEnable([], ['Roles.Role'])),

      //References
      this.store
        .select(selectItContractEnableReferences)
        .pipe(shouldEnable([ContractFields.ActiveReferenceTitle, ContractFields.ActiveReferenceExternalReferenceId])),
    ];

    return combineLatest(configObservables);
  }

  private getItSystemUsageGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      //Frontpage
      this.store.select(selectITSystemUsageEnabledSystemId).pipe(shouldEnable([UsageFields.LocalSystemId])),
      this.store.select(selectITSystemUsageEnableVersion).pipe(shouldEnable([UsageFields.Version])),
      this.store.select(selectITSystemUsageEnableAmountOfUsers).pipe(shouldEnable([])),
      this.store.select(selectITSystemUsageEnableDataClassification).pipe(shouldEnable([])),
      this.store.select(selectITSystemUsageEnableDescription).pipe(shouldEnable([UsageFields.Note])),
      this.store.select(selectITSystemUsageEnableTakenIntoUsageBy).pipe(shouldEnable([UsageFields.ObjectOwnerName])),
      this.store.select(selectITSystemUsageEnableLastEditedBy).pipe(shouldEnable([UsageFields.LastChangedByName])),
      this.store.select(selectITSystemUsageEnableLastEditedAt).pipe(shouldEnable([UsageFields.LastChangedAt])),
      this.store
        .select(selectITSystemUsageEnableLifeCycleStatus)
        .pipe(shouldEnable([UsageFields.LifeCycleStatus, UsageFields.ActiveAccordingToLifeCycle])),
      this.store
        .select(selectITSystemUsageEnableFrontPageUsagePeriod)
        .pipe(
          shouldEnable([UsageFields.ExpirationDate, UsageFields.Concluded, UsageFields.ActiveAccordingToValidityPeriod])
        ),
      this.store.select(selectITSystemUsageEnableStatus).pipe(shouldEnable([])),

      //Contracts
      combineBooleansWithAnd([
        this.store.select(selectShowItContractModule),
        this.store.select(selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive),
      ]).pipe(shouldEnable([UsageFields.MainContractIsActive, UsageFields.MainContractSupplierName])),

      combineBooleansWithAnd([
        this.store.select(selectShowItContractModule),
        this.store.select(selectITSystemUsageEnableAssociatedContracts),
      ]).pipe(shouldEnable([UsageFields.AssociatedContractsNamesCsv])),

      //Data processing
      combineBooleansWithAnd([
        this.store.select(selectShowDataProcessingRegistrations),
        this.store.select(selectITSystemUsageEnableDataProcessing),
      ]).pipe(
        shouldEnable([
          UsageFields.DataProcessingRegistrationsConcludedAsCsv,
          UsageFields.DataProcessingRegistrationNamesAsCsv,
        ])
      ),

      //GDPR
      this.store
        .select(selectITSystemUsageEnableGdprDataTypes)
        .pipe(shouldEnable([UsageFields.SensitiveDataLevelsAsCsv])),
      this.store
        .select(selectITSystemUsageEnableGdprConductedRiskAssessment)
        .pipe(shouldEnable([UsageFields.RiskAssessmentDate, UsageFields.RiskSupervisionDocumentationName])),
      this.store
        .select(selectITSystemUsageEnableGdprPlannedRiskAssessmentDate)
        .pipe(shouldEnable([UsageFields.PlannedRiskAssessmentDate])),
      this.store.select(selectITSystemUsageEnableGdprPurpose).pipe(shouldEnable([UsageFields.GeneralPurpose])),
      this.store.select(selectITSystemUsageEnableGdprHostedAt).pipe(shouldEnable([UsageFields.HostedAt])),
      this.store
        .select(selectITSystemUsageEnableGdprDocumentation)
        .pipe(shouldEnable([UsageFields.LinkToDirectoryName])),

      //Organization

      this.store
        .select(selectITSystemUsageEnableResponsibleUnit)
        .pipe(shouldEnable([UsageFields.ResponsibleOrganizationUnitName])),

      this.store
        .select(selectITSystemUsageEnableRelevantUnits)
        .pipe(shouldEnable([UsageFields.RelevantOrganizationUnitNamesAsCsv])),

      this.store.select(selectITSystemUsageEnableTabSystemRoles).pipe(shouldEnable([], ['Roles.Role'])),

      this.store
        .select(selectITSystemUsageEnableLocalReferences)
        .pipe(shouldEnable([UsageFields.LocalReferenceTitle, UsageFields.LocalReferenceDocumentId])),

      this.store
        .select(selectITSystemUsageEnableTabArchiving)
        .pipe(
          shouldEnable([UsageFields.ArchiveDuty, UsageFields.IsHoldingDocument, UsageFields.ActiveArchivePeriodEndDate])
        ),

      this.store
        .select(selectITSystemUsageEnableSystemRelations)
        .pipe(
          shouldEnable([
            UsageFields.OutgoingRelatedItSystemUsagesNamesAsCsv,
            UsageFields.DependsOnInterfacesNamesAsCsv,
            UsageFields.IncomingRelatedItSystemUsagesNamesAsCsv,
          ])
        ),
    ];

    return combineLatest(configObservables);
  }

  private getDataProcessingGridConfig(): Observable<UIConfigGridApplication[]> {
    const configObservables: Observable<UIConfigGridApplication>[] = [
      // Frontpage
      this.store.select(selectDprEnableDataResponsible).pipe(shouldEnable([DprFields.DataResponsibleUuid])),
      this.store.select(selectDprEnableStatus).pipe(shouldEnable([DprFields.IsActive])),
      this.store
        .select(selectDprEnableLastChangedBy)
        .pipe(shouldEnable([DprFields.LastChangedById, DprFields.LastChangedByName])),
      this.store.select(selectDprEnableLastChangedAt).pipe(shouldEnable([DprFields.LastChangedAt])),
      this.store
        .select(selectDprEnableAgreementConcluded)
        .pipe(shouldEnable([DprFields.IsAgreementConcluded, DprFields.AgreementConcludedAt])),
      this.store
        .select(selectDprEnableTransferBasis)
        .pipe(shouldEnable([DprFields.BasisForTransferUuid, DprFields.TransferToInsecureThirdCountries])),
      this.store.select(selectDprEnableProcessors).pipe(shouldEnable([DprFields.DataProcessorNamesAsCsv])),
      this.store.select(selectDprEnableSubProcessors).pipe(shouldEnable([DprFields.SubDataProcessorNamesAsCsv])),
      // IT Systems
      combineBooleansWithAnd([
        this.store.select(selectShowItSystemModule),
        this.store.select(selectDprEnableItSystems),
      ]).pipe(shouldEnable([DprFields.SystemNamesAsCsv, DprFields.SystemUuidsAsCsv])),

      // Contracts
      this.store.select(selectDprEnableMainContract).pipe(shouldEnable([DprFields.ActiveAccordingToMainContract])),
      combineBooleansWithAnd([
        this.store.select(selectShowItContractModule),
        this.store.select(selectDprEnableAssociatedContracts),
      ]).pipe(shouldEnable([DprFields.ContractNamesAsCsv])),

      // Oversight
      this.store.select(selectDprEnabledOversightInterval).pipe(shouldEnable([DprFields.OversightInterval])),
      this.store
        .select(selectDprEnableScheduledInspectionDate)
        .pipe(shouldEnable([DprFields.OversightScheduledInspectionDate])),
      this.store.select(selectDprEnableOversightOptions).pipe(shouldEnable([DprFields.OversightOptionNamesAsCsv])),
      this.store
        .select(selectDprEnableOversights)
        .pipe(shouldEnable([DprFields.IsOversightCompleted, DprFields.LatestOversightDate])),

      // Roles
      this.store.select(selectDprEnableRoles).pipe(shouldEnable([], ['Roles.Role'])),

      // References
      this.store
        .select(selectDprEnableReferences)
        .pipe(shouldEnable([DprFields.MainReferenceTitle, DprFields.MainReferenceUserAssignedId])),
    ];

    return combineLatest(configObservables);
  }

  private getGdprGridConfig(): Observable<UIConfigGridApplication[]> {
    return combineLatest([
      this.store
        .select(selectITSystemUsageEnableGdprPlannedRiskAssessmentDate)
        .pipe(shouldEnable([GdprFields.PLANNED_RISK_ASSESSMENT_DATE])),
    ]);
  }
}

function shouldEnable(
  columnNamesToConfigure: string[],
  columnNameSubstringsToConfigure: string[] = []
): (source: Observable<boolean>) => Observable<UIConfigGridApplication> {
  return (source: Observable<boolean>) =>
    source.pipe(
      map((shouldEnable) => ({
        shouldEnable,
        columnNamesToConfigure: new Set(columnNamesToConfigure),
        columnNameSubstringsToConfigure: new Set(columnNameSubstringsToConfigure),
      }))
    );
}
