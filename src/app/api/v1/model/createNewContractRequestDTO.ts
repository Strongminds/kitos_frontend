/**
 * OS2Kitos API - V1
 * <b><i>OBS: Dokumentation for V2 findes ved at skifte version på dokumentet til 2 øverst på siden</i></b><br/><br/><b>BEMÆRK: ADGANG TIL API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/>Denne dokumentation udstiller Kitos API\'et til brug for applikationsudvikling.<br/><br/>Den første udgave af API\'et (V1) blev udviklet til understøttelse af projektets brugerflade og vil med tiden blive erstattet af et selvstændigt API (V2) udviklet til brug for integration med udefrakommende systemer. Du vil i en periode kunne anvende både V1 og V2. Bemærk dog, at overflødiggjorte V1 endpoints vil blive udfaset efter en rum tid. KITOS sekretariatet vil i god tid forinden varsle udfasning af overflødige endpoints.<br/><br/>Særligt for V1 gælder der følgende:<br/>ObjectOwnerId, LastChanged og LastChangedByUserId bliver som udgangspunkt sat af systemet automatisk.<br/>Der er udelukkende adgang til læseoperationer i V1. Ved behov for adgang til funktionalitet, der ændrer i data, kontakt da venligst KITOS sekretariatet.<br/><br/>Generelt er anvendelsen beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>BEMÆRK: ADGANG TIL API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ContractAgreementPeriodDataWriteRequestDTO } from './contractAgreementPeriodDataWriteRequestDTO';
import { ContractResponsibleDataWriteRequestDTO } from './contractResponsibleDataWriteRequestDTO';
import { RoleAssignmentRequestDTO } from './roleAssignmentRequestDTO';
import { ContractTerminationDataWriteRequestDTO } from './contractTerminationDataWriteRequestDTO';
import { ContractPaymentsDataWriteRequestDTO } from './contractPaymentsDataWriteRequestDTO';
import { ContractProcurementDataWriteRequestDTO } from './contractProcurementDataWriteRequestDTO';
import { ExternalReferenceDataDTO } from './externalReferenceDataDTO';
import { ContractPaymentModelDataWriteRequestDTO } from './contractPaymentModelDataWriteRequestDTO';
import { ContractSupplierDataWriteRequestDTO } from './contractSupplierDataWriteRequestDTO';
import { ContractGeneralDataWriteRequestDTO } from './contractGeneralDataWriteRequestDTO';


export interface CreateNewContractRequestDTO { 
    /**
     * UUID of the organization in which the contract will be created
     */
    organizationUuid: string;
    /**
     * Name of the contract.  Constraints:      - Max length: 200 characters      - Must be unique within the organization
     */
    name: string;
    /**
     * UUID of the optional parent contract  Constraints:      - Parent and child contract must belong to the same organization
     */
    parentContractUuid?: string;
    general?: ContractGeneralDataWriteRequestDTO;
    procurement?: ContractProcurementDataWriteRequestDTO;
    supplier?: ContractSupplierDataWriteRequestDTO;
    responsible?: ContractResponsibleDataWriteRequestDTO;
    /**
     * IT-System usages covered by this it-contract  Constraints:      - System usages must belong to the same organization as the it-contract      - No duplicates
     */
    systemUsageUuids?: Array<string>;
    /**
     * Data processing registrations associated with this it-contract  Constraints:      - Must belong to the same organization as the it-contract      - No duplicates
     */
    dataProcessingRegistrationUuids?: Array<string>;
    paymentModel?: ContractPaymentModelDataWriteRequestDTO;
    agreementPeriod?: ContractAgreementPeriodDataWriteRequestDTO;
    termination?: ContractTerminationDataWriteRequestDTO;
    payments?: ContractPaymentsDataWriteRequestDTO;
    /**
     * Role assignments  Constraints:      - No duplicates
     */
    roles?: Array<RoleAssignmentRequestDTO>;
    externalReferences?: Array<ExternalReferenceDataDTO>;
}

