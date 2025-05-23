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

export interface APIOrganizationUserResponseDTO {
  /**
   * User\'s first name
   */
  firstName: string;
  /**
   * User\'s last name(s)
   */
  lastName?: string;
  /**
   * User\'s email
   */
  email: string;
  /**
   * User\'s phone number
   */
  phoneNumber?: string;
  /**
   * Determines if the user credentials can be used to request a KITOS API token
   */
  apiAccess: boolean;
  /**
   * Roles assigned to the user within the context of the organization
   */
  roles: Array<APIOrganizationUserResponseDTO.RolesEnum>;
  /**
   * UUID which is unique within collection of entities of the same type
   */
  uuid: string;
  /**
   * Human readable name of the entity
   */
  name: string;
}
export namespace APIOrganizationUserResponseDTO {
  export type RolesEnum =
    | 'User'
    | 'LocalAdmin'
    | 'OrganizationModuleAdmin'
    | 'SystemModuleAdmin'
    | 'ContractModuleAdmin'
    | 'RightsHolderAccess';
  export const RolesEnum = {
    User: 'User' as RolesEnum,
    LocalAdmin: 'LocalAdmin' as RolesEnum,
    OrganizationModuleAdmin: 'OrganizationModuleAdmin' as RolesEnum,
    SystemModuleAdmin: 'SystemModuleAdmin' as RolesEnum,
    ContractModuleAdmin: 'ContractModuleAdmin' as RolesEnum,
    RightsHolderAccess: 'RightsHolderAccess' as RolesEnum,
  };
}
