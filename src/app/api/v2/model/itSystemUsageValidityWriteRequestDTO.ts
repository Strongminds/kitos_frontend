/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 (authorize endpoint) findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface APIItSystemUsageValidityWriteRequestDTO { 
    /**
     * Determines the life cycle status of the system (e.g. Not in use, Operational)
     */
    lifeCycleStatus?: APIItSystemUsageValidityWriteRequestDTO.LifeCycleStatusEnum;
    /**
     * If specified, the entity is valid from this date.  Must be less than or equal to ValidTo
     */
    validFrom?: string;
    /**
     * If specified, the entity is valid up until and including this date.  Must be greater than or equal to ValidFrom
     */
    validTo?: string;
}
export namespace APIItSystemUsageValidityWriteRequestDTO {
    export type LifeCycleStatusEnum = 'Undecided' | 'NotInUse' | 'PhasingIn' | 'Operational' | 'PhasingOut';
    export const LifeCycleStatusEnum = {
        Undecided: 'Undecided' as LifeCycleStatusEnum,
        NotInUse: 'NotInUse' as LifeCycleStatusEnum,
        PhasingIn: 'PhasingIn' as LifeCycleStatusEnum,
        Operational: 'Operational' as LifeCycleStatusEnum,
        PhasingOut: 'PhasingOut' as LifeCycleStatusEnum
    };
}


