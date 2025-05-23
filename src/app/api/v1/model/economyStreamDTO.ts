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

export interface APIEconomyStreamDTO {
  id?: number;
  externPaymentForId?: number;
  internPaymentForId?: number;
  organizationUnitId?: number;
  organizationUnitName?: string;
  /**
   * The field \"anskaffelse\"
   */
  acquisition?: number;
  /**
   * The field \"drift/år\"
   */
  operation?: number;
  other?: number;
  /**
   * The field \"kontering\"
   */
  accountingEntry?: string;
  /**
   * Traffic light for audit
   */
  auditStatus?: APIEconomyStreamDTO.AuditStatusEnum;
  /**
   * DateTime for audit
   */
  auditDate?: string;
  note?: string;
}
export namespace APIEconomyStreamDTO {
  export type AuditStatusEnum = 'White' | 'Red' | 'Yellow' | 'Green';
  export const AuditStatusEnum = {
    White: 'White' as AuditStatusEnum,
    Red: 'Red' as AuditStatusEnum,
    Yellow: 'Yellow' as AuditStatusEnum,
    Green: 'Green' as AuditStatusEnum,
  };
}
