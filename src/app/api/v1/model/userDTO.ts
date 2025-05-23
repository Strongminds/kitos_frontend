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
import { APIOrganizationRightDTO } from './organizationRightDTO';

export interface APIUserDTO {
  id?: number;
  uuid?: string;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  defaultUserStartPreference?: string;
  defaultOrganizationUnitId?: number;
  defaultOrganizationUnitUuid?: string;
  defaultOrganizationUnitName?: string;
  isGlobalAdmin?: boolean;
  organizationRights?: Array<APIOrganizationRightDTO>;
  objectOwnerName?: string;
  objectOwnerLastName?: string;
  lastAdvisDate?: string;
  lastChanged?: string;
  lastChangedByUserId?: number;
  hasApiAccess?: boolean;
  readonly fullName?: string;
}
