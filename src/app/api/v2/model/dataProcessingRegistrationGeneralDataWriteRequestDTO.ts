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


export interface APIDataProcessingRegistrationGeneralDataWriteRequestDTO { 
    /**
     * Optional data responsible selection  Constraints:      - If changed from existing value, the option must currently be available in the organization
     */
    dataResponsibleUuid?: string;
    /**
     * Additional remark related to the data responsible
     */
    dataResponsibleRemark?: string;
    /**
     * Determines if a data processing agreement has been concluded
     */
    isAgreementConcluded?: APIDataProcessingRegistrationGeneralDataWriteRequestDTO.IsAgreementConcludedEnum;
    /**
     * Remark related to whether or not an agreement has been concluded
     */
    isAgreementConcludedRemark?: string;
    /**
     * Describes the date when the data processing agreement was concluded  Constraints:      - IsAgreementConcluded equals \'yes\'
     */
    agreementConcludedAt?: string;
    /**
     * Optional basis for transfer selection  Constraints:      - If changed from existing value, the option must currently be available in the organization
     */
    basisForTransferUuid?: string;
    /**
     * Determines if the data processing includes transfer to insecure third countries
     */
    transferToInsecureThirdCountries?: APIDataProcessingRegistrationGeneralDataWriteRequestDTO.TransferToInsecureThirdCountriesEnum;
    /**
     * Which insecure third countries are subject to data transfer as part of the data processing  Constraints:      - TransferToInsecureThirdCountries equals \'yes\'      - Duplicates are not allowed      - If changed from existing value, the options must currently be available in the organization
     */
    insecureCountriesSubjectToDataTransferUuids?: Array<string>;
    /**
     * UUID\'s of the organization entities selected as data processors  Constraints:      - No duplicates
     */
    dataProcessorUuids?: Array<string>;
    /**
     * Determines if the data processing involves sub data processors
     */
    hasSubDataProcessors?: APIDataProcessingRegistrationGeneralDataWriteRequestDTO.HasSubDataProcessorsEnum;
    /**
     * Defines the master contract for this Data Processing Registration (many contracts can point to a DPR but only one can be the master contract)  Constraint: The contract provided MUST point to this Data Processing Registration for it to be selected as \"main contract\".
     */
    mainContractUuid?: string;
}
export namespace APIDataProcessingRegistrationGeneralDataWriteRequestDTO {
    export type IsAgreementConcludedEnum = 'No' | 'Yes' | 'Irrelevant' | 'Undecided';
    export const IsAgreementConcludedEnum = {
        No: 'No' as IsAgreementConcludedEnum,
        Yes: 'Yes' as IsAgreementConcludedEnum,
        Irrelevant: 'Irrelevant' as IsAgreementConcludedEnum,
        Undecided: 'Undecided' as IsAgreementConcludedEnum
    };
    export type TransferToInsecureThirdCountriesEnum = 'No' | 'Yes' | 'Undecided';
    export const TransferToInsecureThirdCountriesEnum = {
        No: 'No' as TransferToInsecureThirdCountriesEnum,
        Yes: 'Yes' as TransferToInsecureThirdCountriesEnum,
        Undecided: 'Undecided' as TransferToInsecureThirdCountriesEnum
    };
    export type HasSubDataProcessorsEnum = 'No' | 'Yes' | 'Undecided';
    export const HasSubDataProcessorsEnum = {
        No: 'No' as HasSubDataProcessorsEnum,
        Yes: 'Yes' as HasSubDataProcessorsEnum,
        Undecided: 'Undecided' as HasSubDataProcessorsEnum
    };
}


