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
import { APIItSystemUsageOverviewUsingSystemUsageReadModel } from './itSystemUsageOverviewUsingSystemUsageReadModel';


export interface APIItSystemUsageOverviewReadModel { 
    readonly activeArchivePeriodEndDate?: string;
    organizationId?: number;
    id?: number;
    sourceEntityId?: number;
    sourceEntityUuid?: string;
    systemName?: string;
    itSystemDisabled?: boolean;
    activeAccordingToValidityPeriod?: boolean;
    activeAccordingToLifeCycle?: boolean;
    systemActive?: boolean;
    note?: string;
    parentItSystemName?: string;
    parentItSystemId?: number;
    parentItSystemUuid?: string;
    parentItSystemDisabled?: boolean;
    version?: string;
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
    dependsOnInterfacesNamesAsCsv?: string;
    dependsOnInterfaces?: Array<APIItSystemUsageOverviewInterfaceReadModel>;
    incomingRelatedItSystemUsagesNamesAsCsv?: string;
    incomingRelatedItSystemUsages?: Array<APIItSystemUsageOverviewUsedBySystemUsageReadModel>;
    outgoingRelatedItSystemUsagesNamesAsCsv?: string;
    outgoingRelatedItSystemUsages?: Array<APIItSystemUsageOverviewUsingSystemUsageReadModel>;
    relevantOrganizationUnitNamesAsCsv?: string;
    relevantOrganizationUnits?: Array<APIItSystemUsageOverviewRelevantOrgUnitReadModel>;
}
export namespace APIItSystemUsageOverviewReadModel {
    export type ArchiveDutyEnum = 'Undecided' | 'B' | 'K' | 'Unknown';
    export const ArchiveDutyEnum = {
        Undecided: 'Undecided' as ArchiveDutyEnum,
        B: 'B' as ArchiveDutyEnum,
        K: 'K' as ArchiveDutyEnum,
        Unknown: 'Unknown' as ArchiveDutyEnum
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
}


