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


export interface APIDataProcessingRegistrationOversightWriteRequestDTO { 
    /**
     * Applied oversight options.  Constraints:      - No duplicates      - Option must be available in the organization
     */
    oversightOptionUuids?: Array<string>;
    /**
     * Remark related to the selected oversight options
     */
    oversightOptionsRemark?: string;
    /**
     * Determines the interval of the oversight activity
     */
    oversightInterval?: APIDataProcessingRegistrationOversightWriteRequestDTO.OversightIntervalEnum;
    /**
     * Remark regarding the oversight interval
     */
    oversightIntervalRemark?: string;
    /**
     * Determines if an oversight activity has been completed
     */
    isOversightCompleted?: APIDataProcessingRegistrationOversightWriteRequestDTO.IsOversightCompletedEnum;
    /**
     * Remark related to the oversight completion
     */
    oversightCompletedRemark?: string;
    /**
     * Determines the date of a scheduled inspection
     */
    oversightScheduledInspectionDate?: string;
}
export namespace APIDataProcessingRegistrationOversightWriteRequestDTO {
    export type OversightIntervalEnum = 'BiYearly' | 'Yearly' | 'EveryOtherYear' | 'Other' | 'Undecided';
    export const OversightIntervalEnum = {
        BiYearly: 'BiYearly' as OversightIntervalEnum,
        Yearly: 'Yearly' as OversightIntervalEnum,
        EveryOtherYear: 'EveryOtherYear' as OversightIntervalEnum,
        Other: 'Other' as OversightIntervalEnum,
        Undecided: 'Undecided' as OversightIntervalEnum
    };
    export type IsOversightCompletedEnum = 'No' | 'Yes' | 'Undecided';
    export const IsOversightCompletedEnum = {
        No: 'No' as IsOversightCompletedEnum,
        Yes: 'Yes' as IsOversightCompletedEnum,
        Undecided: 'Undecided' as IsOversightCompletedEnum
    };
}


