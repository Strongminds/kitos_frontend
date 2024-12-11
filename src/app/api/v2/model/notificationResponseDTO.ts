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
import { APIIdentityNamePairResponseDTO } from './identityNamePairResponseDTO';
import { APIRecipientResponseDTO } from './recipientResponseDTO';


export interface APINotificationResponseDTO {
    /**
     * Uuid of the Notification
     */
    uuid?: string;
    /**
     * Indicates whether notification is active
     */
    active?: boolean;
    /**
     * Name of the notification (different field than Subject)
     */
    name?: string;
    /**
     * Date when the notification was sent last time
     */
    lastSent?: string;
    /**
     * Date when the notification becomes active
     */
    fromDate?: string;
    /**
     * Date when the notification expires
     */
    toDate?: string;
    /**
     * Subject of the email
     */
    subject?: string;
    /**
     * Body of the email
     */
    body?: string;
    /**
     * Resource owning the notification (e.g. ItContract)
     */
    ownerResourceType?: APINotificationResponseDTO.OwnerResourceTypeEnum;
    /**
     * Type of the notification (Immediate/Scheduled)
     */
    notificationType?: APINotificationResponseDTO.NotificationTypeEnum;
    ownerResource?: APIIdentityNamePairResponseDTO;
    /**
     * Indicates how often should a scheduled notification be repeated
     */
    repetitionFrequency?: APINotificationResponseDTO.RepetitionFrequencyEnum;
    receivers?: APIRecipientResponseDTO;
    cCs?: APIRecipientResponseDTO;
}
export namespace APINotificationResponseDTO {
    export type OwnerResourceTypeEnum = 'ItContract' | 'ItSystemUsage' | 'DataProcessingRegistration';
    export const OwnerResourceTypeEnum = {
        ItContract: 'ItContract' as OwnerResourceTypeEnum,
        ItSystemUsage: 'ItSystemUsage' as OwnerResourceTypeEnum,
        DataProcessingRegistration: 'DataProcessingRegistration' as OwnerResourceTypeEnum
    };
    export type NotificationTypeEnum = 'Immediate' | 'Repeat';
    export const NotificationTypeEnum = {
        Immediate: 'Immediate' as NotificationTypeEnum,
        Repeat: 'Repeat' as NotificationTypeEnum
    };
    export type RepetitionFrequencyEnum = 'Hour' | 'Day' | 'Week' | 'Month' | 'Quarter' | 'HalfYear' | 'Year';
    export const RepetitionFrequencyEnum = {
        Hour: 'Hour' as RepetitionFrequencyEnum,
        Day: 'Day' as RepetitionFrequencyEnum,
        Week: 'Week' as RepetitionFrequencyEnum,
        Month: 'Month' as RepetitionFrequencyEnum,
        Quarter: 'Quarter' as RepetitionFrequencyEnum,
        HalfYear: 'HalfYear' as RepetitionFrequencyEnum,
        Year: 'Year' as RepetitionFrequencyEnum
    };
}


