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
import { APIExpectedUsersIntervalDTO } from './expectedUsersIntervalDTO';
import { APIItSystemUsageValidityWriteRequestDTO } from './itSystemUsageValidityWriteRequestDTO';


export interface APIGeneralDataWriteRequestDTO { 
    /**
     * System Id assigned locally within the organization  Max length: 200
     */
    localSystemId?: string;
    /**
     * Call name used locally within the organization  Max length: 100
     */
    localCallName?: string;
    /**
     * Optional classification of the registered data  Constraint: If an update changes this field, the option identified must be currently available in the organization context
     */
    dataClassificationUuid?: string;
    /**
     * Notes relevant to the system usage within the organization
     */
    notes?: string;
    /**
     * Locally registered system version  Max length: 100
     */
    systemVersion?: string;
    numberOfExpectedUsers?: APIExpectedUsersIntervalDTO;
    validity?: APIItSystemUsageValidityWriteRequestDTO;
    /**
     * Whether the system usage is known to include any kind of AI technology
     */
    containsAITechnology?: APIGeneralDataWriteRequestDTO.ContainsAITechnologyEnum;
}
export namespace APIGeneralDataWriteRequestDTO {
    export type ContainsAITechnologyEnum = 'No' | 'Yes' | 'Undecided';
    export const ContainsAITechnologyEnum = {
        No: 'No' as ContainsAITechnologyEnum,
        Yes: 'Yes' as ContainsAITechnologyEnum,
        Undecided: 'Undecided' as ContainsAITechnologyEnum
    };
}


