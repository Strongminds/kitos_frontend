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
import { APIJournalPeriodUpdateRequestDTO } from './journalPeriodUpdateRequestDTO';


export interface APIArchivingUpdateRequestDTO { 
    /**
     * Updated journal periods  Constraints:      - If the period has a uuid it will update an existing period (with the same uuid), uuid must exist      - If the period has no uuid, a new Period will be created      - Existing periods will be replaced by the input data, so unless identified using uuid in the updates, the existing references will be removed,        so if you want to retain \"identity\" of periods between updates make sure to specify the uuid.        Otherwise the data will be as the input dictates but the uuids will have changed.
     */
    journalPeriods?: Array<APIJournalPeriodUpdateRequestDTO>;
    /**
     * Archive duty for the system in the organization context. The recommendation from the archiving authority is found on the IT-System context.
     */
    archiveDuty?: APIArchivingUpdateRequestDTO.ArchiveDutyEnum;
    /**
     * Defines the archiving type associated with the it-system  Constraint: If an update changes this field, the option identified must be currently available in the organization context
     */
    typeUuid?: string;
    /**
     * Identifies the physical location for archive receiving the data  Constraint: If an update changes this field, the option identified must be currently available in the organization context
     */
    locationUuid?: string;
    /**
     * Identifies the physical location for the archiving test  Constraint: If an update changes this field, the option identified must be currently available in the organization context
     */
    testLocationUuid?: string;
    supplierOrganizationUuid?: string;
    /**
     * Determines if any archiving has occurred from this system
     */
    active?: boolean;
    /**
     * Archiving notes
     */
    notes?: string;
    /**
     * Determines the frequency of the archiving activity
     */
    frequencyInMonths?: number;
    documentBearing?: boolean;
}
export namespace APIArchivingUpdateRequestDTO {
    export type ArchiveDutyEnum = 'Undecided' | 'B' | 'K' | 'Unknown' | 'PreserveDataDiscardOption';
    export const ArchiveDutyEnum = {
        Undecided: 'Undecided' as ArchiveDutyEnum,
        B: 'B' as ArchiveDutyEnum,
        K: 'K' as ArchiveDutyEnum,
        Unknown: 'Unknown' as ArchiveDutyEnum,
        PreserveDataDiscardOption: 'PreserveDataDiscardOption' as ArchiveDutyEnum
    };
}


