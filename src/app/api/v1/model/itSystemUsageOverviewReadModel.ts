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
import { APIItSystemUsageOverviewRoleAssignmentReadModel } from './itSystemUsageOverviewRoleAssignmentReadModel';
import { APIItSystemUsageOverviewSensitiveDataLevelReadModel } from './itSystemUsageOverviewSensitiveDataLevelReadModel';
import { APIItSystemUsageOverviewTaskRefReadModel } from './itSystemUsageOverviewTaskRefReadModel';
import { APIItSystemUsageOverviewRelevantOrgUnitReadModel } from './itSystemUsageOverviewRelevantOrgUnitReadModel';
import { APIItSystemUsageOverviewArchivePeriodReadModel } from './itSystemUsageOverviewArchivePeriodReadModel';
import { APIItSystemUsageOverviewDataProcessingRegistrationReadModel } from './itSystemUsageOverviewDataProcessingRegistrationReadModel';
import { APIItSystemUsageOverviewInterfaceReadModel } from './itSystemUsageOverviewInterfaceReadModel';
import { APIItSystemUsageOverviewUsedBySystemUsageReadModel } from './itSystemUsageOverviewUsedBySystemUsageReadModel';
import { APIItSystemUsageOverviewItContractReadModel } from './itSystemUsageOverviewItContractReadModel';
import { APIItSystemUsageOverviewUsingSystemUsageReadModel } from './itSystemUsageOverviewUsingSystemUsageReadModel';


export interface APIItSystemUsageOverviewReadModel { 
    readonly activeArchivePeriodEndDate?: string;
    organizationId?: number;
    id?: number;
    sourceEntityId?: number;
    sourceEntityUuid?: string;
    externalSystemUuid?: string;
    systemName?: string;
    systemPreviousName?: string;
    systemDescription?: string;
    itSystemDisabled?: boolean;
    activeAccordingToValidityPeriod?: boolean;
    activeAccordingToLifeCycle?: boolean;
    systemActive?: boolean;
    note?: string;
    parentItSystemName?: string;
    parentItSystemId?: number;
    parentItSystemUuid?: string;
    parentItSystemDisabled?: boolean;
    parentItSystemUsageUuid?: string;
    version?: string;
    containsAITechnology?: boolean;
    localCallName?: string;
    localSystemId?: string;
    roleAssignments?: Array<APIItSystemUsageOverviewRoleAssignmentReadModel>;
    itSystemUuid?: string;
    responsibleOrganizationUnitUuid?: string;
    responsibleOrganizationUnitId?: number;
    responsibleOrganizationUnitName?: string;
    itSystemBusinessTypeUuid?: string;
    itSystemBusinessTypeId?: number;
    itSystemBusinessTypeName?: string;
    itSystemRightsHolderId?: number;
    itSystemRightsHolderName?: string;
    itSystemCategoriesId?: number;
    itSystemCategoriesUuid?: string;
    itSystemCategoriesName?: string;
    itSystemKLEIdsAsCsv?: string;
    itSystemKLENamesAsCsv?: string;
    itSystemTaskRefs?: Array<APIItSystemUsageOverviewTaskRefReadModel>;
    localReferenceDocumentId?: string;
    localReferenceUrl?: string;
    localReferenceTitle?: string;
    objectOwnerId?: number;
    objectOwnerName?: string;
    lastChangedById?: number;
    lastChangedByName?: string;
    lastChangedAt?: string;
    concluded?: string;
    expirationDate?: string;
    mainContractId?: number;
    mainContractSupplierId?: number;
    mainContractSupplierName?: string;
    mainContractIsActive?: boolean;
    sensitiveDataLevelsAsCsv?: string;
    riskAssessmentDate?: string;
    plannedRiskAssessmentDate?: string;
    sensitiveDataLevels?: Array<APIItSystemUsageOverviewSensitiveDataLevelReadModel>;
    archiveDuty?: APIItSystemUsageOverviewReadModel.ArchiveDutyEnum;
    isHoldingDocument?: boolean;
    archivePeriods?: Array<APIItSystemUsageOverviewArchivePeriodReadModel>;
    riskSupervisionDocumentationName?: string;
    riskSupervisionDocumentationUrl?: string;
    linkToDirectoryName?: string;
    linkToDirectoryUrl?: string;
    lifeCycleStatus?: APIItSystemUsageOverviewReadModel.LifeCycleStatusEnum;
    dataProcessingRegistrationsConcludedAsCsv?: string;
    dataProcessingRegistrationNamesAsCsv?: string;
    dataProcessingRegistrations?: Array<APIItSystemUsageOverviewDataProcessingRegistrationReadModel>;
    generalPurpose?: string;
    hostedAt?: APIItSystemUsageOverviewReadModel.HostedAtEnum;
    userCount?: APIItSystemUsageOverviewReadModel.UserCountEnum;
    dependsOnInterfacesNamesAsCsv?: string;
    dependsOnInterfaces?: Array<APIItSystemUsageOverviewInterfaceReadModel>;
    incomingRelatedItSystemUsagesNamesAsCsv?: string;
    incomingRelatedItSystemUsages?: Array<APIItSystemUsageOverviewUsedBySystemUsageReadModel>;
    outgoingRelatedItSystemUsagesNamesAsCsv?: string;
    outgoingRelatedItSystemUsages?: Array<APIItSystemUsageOverviewUsingSystemUsageReadModel>;
    relevantOrganizationUnitNamesAsCsv?: string;
    relevantOrganizationUnits?: Array<APIItSystemUsageOverviewRelevantOrgUnitReadModel>;
    associatedContractsNamesCsv?: string;
    associatedContracts?: Array<APIItSystemUsageOverviewItContractReadModel>;
    dpiaConducted?: APIItSystemUsageOverviewReadModel.DpiaConductedEnum;
    isBusinessCritical?: APIItSystemUsageOverviewReadModel.IsBusinessCriticalEnum;
}
export namespace APIItSystemUsageOverviewReadModel {
    export type ArchiveDutyEnum = 'Undecided' | 'B' | 'K' | 'Unknown' | 'PreserveDataCanDiscardDocuments';
    export const ArchiveDutyEnum = {
        Undecided: 'Undecided' as ArchiveDutyEnum,
        B: 'B' as ArchiveDutyEnum,
        K: 'K' as ArchiveDutyEnum,
        Unknown: 'Unknown' as ArchiveDutyEnum,
        PreserveDataCanDiscardDocuments: 'PreserveDataCanDiscardDocuments' as ArchiveDutyEnum
    };
    export type LifeCycleStatusEnum = 'Undecided' | 'NotInUse' | 'PhasingIn' | 'Operational' | 'PhasingOut';
    export const LifeCycleStatusEnum = {
        Undecided: 'Undecided' as LifeCycleStatusEnum,
        NotInUse: 'NotInUse' as LifeCycleStatusEnum,
        PhasingIn: 'PhasingIn' as LifeCycleStatusEnum,
        Operational: 'Operational' as LifeCycleStatusEnum,
        PhasingOut: 'PhasingOut' as LifeCycleStatusEnum
    };
    export type HostedAtEnum = 'UNDECIDED' | 'ONPREMISE' | 'EXTERNAL';
    export const HostedAtEnum = {
        Undecided: 'UNDECIDED' as HostedAtEnum,
        Onpremise: 'ONPREMISE' as HostedAtEnum,
        External: 'EXTERNAL' as HostedAtEnum
    };
    export type UserCountEnum = 'BELOWTEN' | 'TENTOFIFTY' | 'FIFTYTOHUNDRED' | 'HUNDREDPLUS' | 'UNDECIDED';
    export const UserCountEnum = {
        Belowten: 'BELOWTEN' as UserCountEnum,
        Tentofifty: 'TENTOFIFTY' as UserCountEnum,
        Fiftytohundred: 'FIFTYTOHUNDRED' as UserCountEnum,
        Hundredplus: 'HUNDREDPLUS' as UserCountEnum,
        Undecided: 'UNDECIDED' as UserCountEnum
    };
    export type DpiaConductedEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const DpiaConductedEnum = {
        No: 'NO' as DpiaConductedEnum,
        Yes: 'YES' as DpiaConductedEnum,
        Dontknow: 'DONTKNOW' as DpiaConductedEnum,
        Undecided: 'UNDECIDED' as DpiaConductedEnum
    };
    export type IsBusinessCriticalEnum = 'NO' | 'YES' | 'DONTKNOW' | 'UNDECIDED';
    export const IsBusinessCriticalEnum = {
        No: 'NO' as IsBusinessCriticalEnum,
        Yes: 'YES' as IsBusinessCriticalEnum,
        Dontknow: 'DONTKNOW' as IsBusinessCriticalEnum,
        Undecided: 'UNDECIDED' as IsBusinessCriticalEnum
    };
}


