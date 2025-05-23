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
import { APIOversightDateDTO } from './oversightDateDTO';

export interface APIDataProcessingRegistrationOversightResponseDTO {
  /**
   * Applied oversight options.
   */
  oversightOptions: Array<APIIdentityNamePairResponseDTO>;
  /**
   * Remark related to the selected oversight options
   */
  oversightOptionsRemark?: string;
  /**
   * Determines the interval of the oversight activity
   */
  oversightInterval?: APIDataProcessingRegistrationOversightResponseDTO.OversightIntervalEnum;
  /**
   * Remark regarding the oversight interval
   */
  oversightIntervalRemark?: string;
  /**
   * Determines if an oversight activity has been completed
   */
  isOversightCompleted?: APIDataProcessingRegistrationOversightResponseDTO.IsOversightCompletedEnum;
  /**
   * Remark related to the oversight completion
   */
  oversightCompletedRemark?: string;
  /**
   * Determines the date of a scheduled inspection
   */
  oversightScheduledInspectionDate?: string;
  oversightDates: Array<APIOversightDateDTO>;
}
export namespace APIDataProcessingRegistrationOversightResponseDTO {
  export type OversightIntervalEnum = 'BiYearly' | 'Yearly' | 'EveryOtherYear' | 'Other' | 'Undecided';
  export const OversightIntervalEnum = {
    BiYearly: 'BiYearly' as OversightIntervalEnum,
    Yearly: 'Yearly' as OversightIntervalEnum,
    EveryOtherYear: 'EveryOtherYear' as OversightIntervalEnum,
    Other: 'Other' as OversightIntervalEnum,
    Undecided: 'Undecided' as OversightIntervalEnum,
  };
  export type IsOversightCompletedEnum = 'No' | 'Yes' | 'Undecided';
  export const IsOversightCompletedEnum = {
    No: 'No' as IsOversightCompletedEnum,
    Yes: 'Yes' as IsOversightCompletedEnum,
    Undecided: 'Undecided' as IsOversightCompletedEnum,
  };
}
