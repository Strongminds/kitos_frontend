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
import { APIDataProcessingRegistrationRoleAssignmentReadModel } from './dataProcessingRegistrationRoleAssignmentReadModel';


export interface APIDataProcessingRegistrationReadModel { 
    id?: number;
    name?: string;
    organizationId?: number;
    sourceEntityId?: number;
    sourceEntityUuid?: string;
    mainReferenceUserAssignedId?: string;
    mainReferenceUrl?: string;
    mainReferenceTitle?: string;
    systemNamesAsCsv?: string;
    systemUuidsAsCsv?: string;
    dataProcessorNamesAsCsv?: string;
    subDataProcessorNamesAsCsv?: string;
    roleAssignments?: Array<APIDataProcessingRegistrationRoleAssignmentReadModel>;
    isAgreementConcluded?: APIDataProcessingRegistrationReadModel.IsAgreementConcludedEnum;
    transferToInsecureThirdCountries?: APIDataProcessingRegistrationReadModel.TransferToInsecureThirdCountriesEnum;
    agreementConcludedAt?: string;
    latestOversightDate?: string;
    basisForTransfer?: string;
    basisForTransferUuid?: string;
    oversightInterval?: APIDataProcessingRegistrationReadModel.OversightIntervalEnum;
    dataResponsible?: string;
    dataResponsibleUuid?: string;
    oversightOptionNamesAsCsv?: string;
    isOversightCompleted?: APIDataProcessingRegistrationReadModel.IsOversightCompletedEnum;
    oversightScheduledInspectionDate?: string;
    isActive?: boolean;
    activeAccordingToMainContract?: boolean;
    contractNamesAsCsv?: string;
    lastChangedById?: number;
    lastChangedByName?: string;
    lastChangedAt?: string;
}
export namespace APIDataProcessingRegistrationReadModel {
    export type IsAgreementConcludedEnum = 'NO' | 'YES' | 'IRRELEVANT' | 'UNDECIDED';
    export const IsAgreementConcludedEnum = {
        No: 'NO' as IsAgreementConcludedEnum,
        Yes: 'YES' as IsAgreementConcludedEnum,
        Irrelevant: 'IRRELEVANT' as IsAgreementConcludedEnum,
        Undecided: 'UNDECIDED' as IsAgreementConcludedEnum
    };
    export type TransferToInsecureThirdCountriesEnum = 'Yes' | 'No' | 'Undecided';
    export const TransferToInsecureThirdCountriesEnum = {
        Yes: 'Yes' as TransferToInsecureThirdCountriesEnum,
        No: 'No' as TransferToInsecureThirdCountriesEnum,
        Undecided: 'Undecided' as TransferToInsecureThirdCountriesEnum
    };
    export type OversightIntervalEnum = 'Half_yearly' | 'Yearly' | 'Every_second_year' | 'Other' | 'Undecided';
    export const OversightIntervalEnum = {
        HalfYearly: 'Half_yearly' as OversightIntervalEnum,
        Yearly: 'Yearly' as OversightIntervalEnum,
        EverySecondYear: 'Every_second_year' as OversightIntervalEnum,
        Other: 'Other' as OversightIntervalEnum,
        Undecided: 'Undecided' as OversightIntervalEnum
    };
    export type IsOversightCompletedEnum = 'Yes' | 'No' | 'Undecided';
    export const IsOversightCompletedEnum = {
        Yes: 'Yes' as IsOversightCompletedEnum,
        No: 'No' as IsOversightCompletedEnum,
        Undecided: 'Undecided' as IsOversightCompletedEnum
    };
}


