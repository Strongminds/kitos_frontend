/**
 * OS2Kitos API - V2
 * <b><i>OBS: Dokumentation for V1 findes ved at skifte version på dokumentet til 1 øverst på siden</i></b><br/><br/>KITOS API V2 understøtter både læse- og skriveoperationer for de væsentlige registreringsobjekter i KITOS. <br/><br/>Se mere om designet og konventionerne i API\'et her: <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/2059599873/API+Design+V2\'>API V2</a>.<br/><br/>Generelt er anvendelsen af KITOS API(er) beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
 *
 * The version of the OpenAPI document: 2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { APIIdentityNamePairResponseDTO } from './identityNamePairResponseDTO';
import { APIOrganizationUsageResponseDTO } from './organizationUsageResponseDTO';
import { APIRoleAssignmentResponseDTO } from './roleAssignmentResponseDTO';
import { APIGDPRRegistrationsResponseDTO } from './gDPRRegistrationsResponseDTO';
import { APILocalKLEDeviationsResponseDTO } from './localKLEDeviationsResponseDTO';
import { APIOutgoingSystemRelationResponseDTO } from './outgoingSystemRelationResponseDTO';
import { APIArchivingRegistrationsResponseDTO } from './archivingRegistrationsResponseDTO';
import { APIShallowOrganizationResponseDTO } from './shallowOrganizationResponseDTO';
import { APIGeneralDataResponseDTO } from './generalDataResponseDTO';
import { APIExternalReferenceDataResponseDTO } from './externalReferenceDataResponseDTO';


/**
 * NOTE: IT-System usages are registrations which extend those of a system within the context of a specific organization.  IT-System usages have their own lifecycle and identity but the human readable name is inherited from the system context.
 */
export interface APIItSystemUsageResponseDTO { 
    /**
     * UUID of the IT-System usage registration instance
     */
    uuid: string;
    createdBy: APIIdentityNamePairResponseDTO;
    /**
     * UTC timestamp of latest modification
     */
    lastModified: string;
    lastModifiedBy: APIIdentityNamePairResponseDTO;
    systemContext: APIIdentityNamePairResponseDTO;
    organizationContext: APIShallowOrganizationResponseDTO;
    general: APIGeneralDataResponseDTO;
    /**
     * A collection of IT-System usage role option assignments
     */
    roles: Array<APIRoleAssignmentResponseDTO>;
    organizationUsage: APIOrganizationUsageResponseDTO;
    localKLEDeviations: APILocalKLEDeviationsResponseDTO;
    /**
     * User defined external references
     */
    externalReferences: Array<APIExternalReferenceDataResponseDTO>;
    archiving: APIArchivingRegistrationsResponseDTO;
    gdpr: APIGDPRRegistrationsResponseDTO;
    /**
     * Contains registered relations to other system usages within the organization
     */
    outgoingSystemRelations: Array<APIOutgoingSystemRelationResponseDTO>;
}

