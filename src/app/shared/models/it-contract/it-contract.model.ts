import { formatInvoiceDate } from '../../helpers/invoice-dates.helpers';
import { formatProcurementPlan } from '../../helpers/procurement-plan.helpers';
import { organizationNameWithCvrAndAvailability } from '../../helpers/string.helpers';
import {
  mapRoleAssignmentsToEmails,
  mapRoleAssignmentsToUserFullNames,
  RoleAssignmentEmailsMaps,
  RoleAssignmentsMap,
} from '../helpers/read-model-role-assignments';
import { mapToYesNoEnum } from '../yes-no.model';
import { formatInvoiceFrequency } from './invoice-frequency-choice';
import { OverviewAuditModel } from './audit-model';
import { mapYearSegmentChoice } from './year-segment-choice';

export interface ITContract {
  id: string;
  IsActive: boolean;
  ContractId: string;
  ParentContractName: string;
  ParentContractUuid: string;
  Name: string;
  Concluded: Date;
  ExpirationDate: Date;
  CriticalityName: string;
  ResponsibleOrgUnitName: string;
  SupplierName: string;
  ContractSigner: string;
  ContractTypeName: string;
  ContractTemplateName: string;
  PurchaseFormName: string;
  ProcurementStrategyName: string;
  ProcurementPlanYear: string;
  ProcurementInitiated: string;
  DataProcessingAgreements: { id: string; value: string }[];
  ItSystemUsages: { id: string; value: string }[];
  ItSystemUsageUuids: { value: string }[];
  ItSystemUsageUuidsAsCsv: string;
  ExternalPaymentOrganizationUnitsCsv: string;
  InternalPaymentOrganizationUnitsCsv: string;
  SourceEntityUuid: string;
  NumberOfAssociatedSystemRelations: number;
  ActiveReferenceTitle: string;
  ActiveReferenceUrl: string;
  ActiveReferenceExternalReferenceId: string;
  AccumulatedAcquisitionCost: number;
  AccumulatedOperationCost: number;
  AccumulatedOtherCost: number;
  LatestAuditDate: Date;
  AuditStatus: OverviewAuditModel;
  OperationRemunerationBegunDate: Date;
  PaymentModelName: string;
  PaymentFrequencyName: string;
  Duration: string;
  OptionExtendName: string;
  TerminationDeadlineName: string;
  IrrevocableTo: Date;
  TerminatedAt: Date;
  ByEnding: string;
  LastEditedByUserName: string;
  LastEditedAtDate: Date;
  Roles: RoleAssignmentsMap;
  RoleEmails: RoleAssignmentEmailsMaps;
  Note: string;
  InvoiceFrequency: string;
  InvoiceDate1Month: number | null;
  InvoiceDate1Day: number | null;
  InvoiceDate1: string;
  InvoiceDate2Month: number | null;
  InvoiceDate2Day: number | null;
  InvoiceDate2: string;
  InvoiceDate3Month: number | null;
  InvoiceDate3Day: number | null;
  InvoiceDate3: string;
  InvoiceDate4Month: number | null;
  InvoiceDate4Day: number | null;
  InvoiceDate4: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITContract = (value: any): ITContract | undefined => {
  if (!value.SourceEntityUuid) return;
  const procurementPlan =
    value.ProcurementPlanQuarter == null || value.ProcurementPlanYear == null
      ? ''
      : formatProcurementPlan(value.ProcurementPlanYear, value.ProcurementPlanQuarter);

  const audit = {
    total: value.AuditStatusGreen + value.AuditStatusRed + value.AuditStatusWhite + value.AuditStatusYellow,
    green: value.AuditStatusGreen,
    red: value.AuditStatusRed,
    yellow: value.AuditStatusYellow,
    white: value.AuditStatusWhite,
  } as OverviewAuditModel;
  return {
    id: value.SourceEntityUuid,
    IsActive: value.IsActive,
    ContractId: value.ContractId,
    ParentContractName: value.ParentContractName,
    ParentContractUuid: value.ParentContractUuid,
    Name: value.Name,
    Concluded: value.Concluded,
    ExpirationDate: value.ExpirationDate,
    CriticalityName: value.CriticalityName,
    ResponsibleOrgUnitName: value.ResponsibleOrgUnitName,
    SupplierName: organizationNameWithCvrAndAvailability(
      value.SupplierName,
      value.SupplierCvr,
      value.IsSupplierDisabled,
    ),
    ContractSigner: value.ContractSigner,
    ContractTypeName: value.ContractTypeName,
    ContractTemplateName: value.ContractTemplateName,
    PurchaseFormName: value.PurchaseFormName,
    ProcurementStrategyName: value.ProcurementStrategyName,
    ProcurementPlanYear: procurementPlan,
    ProcurementInitiated: mapToYesNoEnum(value.ProcurementInitiated)?.name ?? '',
    DataProcessingAgreements: value.DataProcessingAgreements.map(
      (dpa: { DataProcessingRegistrationUuid: string; DataProcessingRegistrationName: string }) => ({
        id: dpa.DataProcessingRegistrationUuid,
        value: dpa.DataProcessingRegistrationName,
      }),
    ),
    ItSystemUsageUuids: value.ItSystemUsageUuids,
    ItSystemUsageUuidsAsCsv: value.ItSystemUsagesSystemUuidCsv,
    ExternalPaymentOrganizationUnitsCsv: value.ExternalPaymentOrganizationUnitsCsv,
    InternalPaymentOrganizationUnitsCsv: value.InternalPaymentOrganizationUnitsCsv,
    ItSystemUsages: value.ItSystemUsages.map((usage: { ItSystemUsageUuid: string; ItSystemUsageName: string }) => ({
      id: usage.ItSystemUsageUuid,
      value: usage.ItSystemUsageName,
    })),
    SourceEntityUuid: value.SourceEntityUuid,
    NumberOfAssociatedSystemRelations: value.NumberOfAssociatedSystemRelations,
    ActiveReferenceTitle: value.ActiveReferenceTitle,
    ActiveReferenceUrl: value.ActiveReferenceUrl,
    ActiveReferenceExternalReferenceId: value.ActiveReferenceExternalReferenceId,
    AccumulatedAcquisitionCost: value.AccumulatedAcquisitionCost,
    AccumulatedOperationCost: value.AccumulatedOperationCost,
    AccumulatedOtherCost: value.AccumulatedOtherCost,
    OperationRemunerationBegunDate: value.OperationRemunerationBegunDate,
    LatestAuditDate: value.LatestAuditDate,
    AuditStatus: audit,
    PaymentModelName: value.PaymentModelName,
    PaymentFrequencyName: value.PaymentFrequencyName,
    Duration: value.Duration,
    OptionExtendName: value.OptionExtendName,
    TerminationDeadlineName: value.TerminationDeadlineName,
    IrrevocableTo: value.IrrevocableTo,
    TerminatedAt: value.TerminatedAt,
    ByEnding: mapYearSegmentChoice(value.ByEnding)?.name ?? '',
    LastEditedByUserName: value.LastEditedByUserName,
    LastEditedAtDate: value.LastEditedAtDate,
    Roles: mapRoleAssignmentsToUserFullNames(value.RoleAssignments),
    RoleEmails: mapRoleAssignmentsToEmails(value.RoleAssignments),
    Note: value.Note,
    InvoiceFrequency: formatInvoiceFrequency(value.InvoiceFrequency),
    InvoiceDate1Month: value.InvoiceDate1Month ?? null,
    InvoiceDate1Day: value.InvoiceDate1Day ?? null,
    InvoiceDate1: formatInvoiceDate(value.InvoiceDate1Month, value.InvoiceDate1Day),
    InvoiceDate2Month: value.InvoiceDate2Month ?? null,
    InvoiceDate2Day: value.InvoiceDate2Day ?? null,
    InvoiceDate2: formatInvoiceDate(value.InvoiceDate2Month, value.InvoiceDate2Day),
    InvoiceDate3Month: value.InvoiceDate3Month ?? null,
    InvoiceDate3Day: value.InvoiceDate3Day ?? null,
    InvoiceDate3: formatInvoiceDate(value.InvoiceDate3Month, value.InvoiceDate3Day),
    InvoiceDate4Month: value.InvoiceDate4Month ?? null,
    InvoiceDate4Day: value.InvoiceDate4Day ?? null,
    InvoiceDate4: formatInvoiceDate(value.InvoiceDate4Month, value.InvoiceDate4Day),
  };
};
