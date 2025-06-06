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
import { APIRecommendedArchiveDutyResponseDTO } from './recommendedArchiveDutyResponseDTO';
import { APIShallowOrganizationResponseDTO } from './shallowOrganizationResponseDTO';
import { APIExternalReferenceDataResponseDTO } from './externalReferenceDataResponseDTO';


export interface APIItSystemResponseDTO { 
    /**
     * Organizations using this IT-System
     */
    usingOrganizations: Array<APIShallowOrganizationResponseDTO>;
    /**
     * UTC timestamp of latest modification
     */
    lastModified: string;
    lastModifiedBy: APIIdentityNamePairResponseDTO;
    /**
     * Scope of the registration  - Local: The scope of the registration is local to the organization in which is was created  - Global: The scope of the registration is global to KITOS and can be accessed and associated by authorized clients
     */
    scope: APIItSystemResponseDTO.ScopeEnum;
    organizationContext: APIShallowOrganizationResponseDTO;
    legalName?: string;
    legalDataProcessorName?: string;
    /**
     * UUID for IT-System
     */
    uuid: string;
    /**
     * External Uuid for IT-System
     */
    externalUuid?: string;
    parentSystem?: APIIdentityNamePairResponseDTO;
    /**
     * Name of IT-System
     */
    name: string;
    /**
     * Former name of IT-System (if any)
     */
    formerName?: string;
    /**
     * Description
     */
    description?: string;
    /**
     * User defined external references
     */
    externalReferences: Array<APIExternalReferenceDataResponseDTO>;
    /**
     * List of KLE number representations as name and UUID pairs
     */
    kle: Array<APIIdentityNamePairResponseDTO>;
    /**
     * Active status
     */
    deactivated: boolean;
    businessType?: APIIdentityNamePairResponseDTO;
    rightsHolder?: APIShallowOrganizationResponseDTO;
    /**
     * Date of creation (on some legacy systems , this information is not available. If so, it will be null)
     */
    created: string;
    createdBy: APIIdentityNamePairResponseDTO;
    recommendedArchiveDuty: APIRecommendedArchiveDutyResponseDTO;
    /**
     * A list of unique suppliers associated with each usage’s main contract.
     */
    mainContractSuppliers: Array<APIShallowOrganizationResponseDTO>;
}
export namespace APIItSystemResponseDTO {
    export type ScopeEnum = 'Local' | 'Global';
    export const ScopeEnum = {
        Local: 'Local' as ScopeEnum,
        Global: 'Global' as ScopeEnum
    };
}


