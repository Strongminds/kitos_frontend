/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { APIItContractOverviewReadModelSystemRelation } from './itContractOverviewReadModelSystemRelation';
import { APIItContractOverviewReadModelItSystemUsage } from './itContractOverviewReadModelItSystemUsage';
import { APIItContractOverviewRoleAssignmentReadModel } from './itContractOverviewRoleAssignmentReadModel';
import { APIItContractOverviewReadModelDataProcessingAgreement } from './itContractOverviewReadModelDataProcessingAgreement';


export interface APIItContractOverviewReadModel { 
    organizationId?: number;
    id?: number;
    sourceEntityId?: number;
    sourceEntityUuid?: string;
    name?: string;
    isActive?: boolean;
    contractId?: string;
    parentContractId?: number;
    parentContractName?: string;
    criticalityId?: number;
    criticalityName?: string;
    responsibleOrgUnitId?: number;
    responsibleOrgUnitName?: string;
    supplierId?: number;
    supplierName?: string;
    contractSigner?: string;
    contractTypeId?: number;
    contractTypeName?: string;
    contractTemplateId?: number;
    contractTemplateName?: string;
    purchaseFormId?: number;
    purchaseFormName?: string;
    procurementStrategyId?: number;
    procurementStrategyName?: string;
    procurementPlanYear?: number;
    procurementPlanQuarter?: number;
    procurementInitiated?: APIItContractOverviewReadModel.ProcurementInitiatedEnum;
    roleAssignments?: Array<APIItContractOverviewRoleAssignmentReadModel>;
    dataProcessingAgreements?: Array<APIItContractOverviewReadModelDataProcessingAgreement>;
    dataProcessingAgreementsCsv?: string;
    itSystemUsages?: Array<APIItContractOverviewReadModelItSystemUsage>;
    itSystemUsagesCsv?: string;
    itSystemUsagesSystemUuidCsv?: string;
    numberOfAssociatedSystemRelations?: number;
    systemRelations?: Array<APIItContractOverviewReadModelSystemRelation>;
    activeReferenceTitle?: string;
    activeReferenceUrl?: string;
    activeReferenceExternalReferenceId?: string;
    accumulatedAcquisitionCost?: number;
    accumulatedOperationCost?: number;
    accumulatedOtherCost?: number;
    operationRemunerationBegunDate?: string;
    paymentModelId?: number;
    paymentModelName?: string;
    paymentFrequencyId?: number;
    paymentFrequencyName?: string;
    latestAuditDate?: string;
    auditStatusWhite?: number;
    auditStatusRed?: number;
    auditStatusYellow?: number;
    auditStatusGreen?: number;
    duration?: string;
    optionExtendId?: number;
    optionExtendName?: string;
    terminationDeadlineId?: number;
    terminationDeadlineName?: string;
    irrevocableTo?: string;
    terminatedAt?: string;
    lastEditedByUserId?: number;
    lastEditedByUserName?: string;
    lastEditedAtDate?: string;
    concluded?: string;
    expirationDate?: string;
}
export namespace APIItContractOverviewReadModel {
    export type ProcurementInitiatedEnum = 'Yes' | 'No' | 'Undecided';
    export const ProcurementInitiatedEnum = {
        Yes: 'Yes' as ProcurementInitiatedEnum,
        No: 'No' as ProcurementInitiatedEnum,
        Undecided: 'Undecided' as ProcurementInitiatedEnum
    };
}


