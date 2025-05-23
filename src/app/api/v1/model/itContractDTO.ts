/**
 * OS2Kitos API - V1
 * <b><i>OBS: Dokumentation for V2 findes ved at skifte version på dokumentet til 2 øverst på siden</i></b><br/><br/><b>BEMÆRK: Ekstern Adgang TIL størstedelen af API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/><b>BEMÆRK: Lukningen påvirker ikke authorize endpointet</b><br/><br/>
 *
 * The version of the OpenAPI document: 1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { APIItSystemUsageSimpleDTO } from './itSystemUsageSimpleDTO';
import { APINamedEntityDTO } from './namedEntityDTO';
import { APIOptionDTO } from './optionDTO';
import { APIAdviceDTO } from './adviceDTO';
import { APIExternalReferenceDTO } from './externalReferenceDTO';

export interface APIItContractDTO {
  reference?: APIExternalReferenceDTO;
  id?: number;
  organizationId?: number;
  name?: string;
  note?: string;
  itContractId?: string;
  supplierContractSigner?: string;
  hasSupplierSigned?: boolean;
  supplierSignedDate?: string;
  concluded?: string;
  durationYears?: number;
  durationMonths?: number;
  durationOngoing?: boolean;
  irrevocableTo?: string;
  expirationDate?: string;
  operationRemunerationBegun?: string;
  terminated?: string;
  extendMultiplier?: number;
  terminationDeadlineId?: number;
  terminationDeadlineName?: string;
  paymentFreqencyId?: number;
  paymentFreqencyName?: string;
  paymentModelId?: number;
  paymentModelName?: string;
  priceRegulationId?: number;
  priceRegulationName?: string;
  optionExtendId?: number;
  optionExtendName?: string;
  contractSigner?: string;
  isSigned?: boolean;
  signedDate?: string;
  responsibleOrganizationUnitId?: number;
  supplierId?: number;
  supplierName?: string;
  supplierUuid?: string;
  procurementStrategyId?: number;
  procurementStrategyName?: string;
  procurementPlanQuarter?: number;
  procurementPlanYear?: number;
  contractTemplateId?: number;
  contractTemplateName?: string;
  contractTypeId?: number;
  contractTypeName?: string;
  contractTypeUuid?: string;
  purchaseFormId?: number;
  purchaseFormName?: string;
  parentId?: number;
  parentName?: string;
  agreementElements?: Array<APIOptionDTO>;
  associatedSystemUsages?: Array<APIItSystemUsageSimpleDTO>;
  advices?: Array<APIAdviceDTO>;
  lastChanged?: string;
  lastChangedByName?: string;
  lastChangedByUserId?: number;
  objectOwnerFullName?: string;
  objectOwnerId?: number;
  running?: APIItContractDTO.RunningEnum;
  byEnding?: APIItContractDTO.ByEndingEnum;
  active?: boolean;
  isActive?: boolean;
  externalReferences?: Array<APIExternalReferenceDTO>;
  referenceId?: number;
  dataProcessingRegistrations?: Array<APINamedEntityDTO>;
  uuid?: string;
  criticalityId?: number;
  criticalityName?: string;
  procurementInitiated?: APIItContractDTO.ProcurementInitiatedEnum;
}
export namespace APIItContractDTO {
  export type RunningEnum = 'EndOfCalendarYear' | 'EndOfQuarter' | 'EndOfMonth';
  export const RunningEnum = {
    EndOfCalendarYear: 'EndOfCalendarYear' as RunningEnum,
    EndOfQuarter: 'EndOfQuarter' as RunningEnum,
    EndOfMonth: 'EndOfMonth' as RunningEnum,
  };
  export type ByEndingEnum = 'EndOfCalendarYear' | 'EndOfQuarter' | 'EndOfMonth';
  export const ByEndingEnum = {
    EndOfCalendarYear: 'EndOfCalendarYear' as ByEndingEnum,
    EndOfQuarter: 'EndOfQuarter' as ByEndingEnum,
    EndOfMonth: 'EndOfMonth' as ByEndingEnum,
  };
  export type ProcurementInitiatedEnum = 'Yes' | 'No' | 'Undecided';
  export const ProcurementInitiatedEnum = {
    Yes: 'Yes' as ProcurementInitiatedEnum,
    No: 'No' as ProcurementInitiatedEnum,
    Undecided: 'Undecided' as ProcurementInitiatedEnum,
  };
}
