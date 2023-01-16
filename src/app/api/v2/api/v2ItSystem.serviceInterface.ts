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
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { APIDeactivationReasonRequestDTO } from '../model/models';
import { APIItSystemResponseDTO } from '../model/models';
import { APIRightsHolderCreateItSystemRequestDTO } from '../model/models';
import { APIRightsHolderItSystemResponseDTO } from '../model/models';
import { APIRightsHolderPartialUpdateSystemPropertiesRequestDTO } from '../model/models';
import { APIRightsHolderWritableITSystemPropertiesDTO } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface APIV2ItSystemServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Deactivates an IT-System
     * 
     * @param uuid Specific IT-System UUID
     * @param request Reason for deactivation
     */
    dELETEItSystemV2DeactivateSystemAsRightsHolderGuidUuidDeactivationReasonRequestDTORequest(uuid: string, request: APIDeactivationReasonRequestDTO, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Returns requested IT-System
     * 
     * @param uuid Specific IT-System UUID
     */
    gETItSystemV2GetItSystemByRightsHoldersAccessGuidUuid(uuid: string, extraHttpRequestParams?: any): Observable<APIRightsHolderItSystemResponseDTO>;

    /**
     * Returns requested IT-System
     * 
     * @param uuid Specific IT-System UUID
     */
    gETItSystemV2GetItSystemGuidUuid(uuid: string, extraHttpRequestParams?: any): Observable<APIItSystemResponseDTO>;

    /**
     * Returns IT-Systems for which the current user has rights holders access
     * 
     * @param rightsHolderUuid Optional filtering if a user is rights holder in multiple organizations and wishes to scope the request to a single one
     * @param includeDeactivated If set to true, the response will also include deactivated it-interfaces
     * @param changedSinceGtEq Include only changes which were LastModified (UTC) is equal to or greater than the provided value
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     */
    gETItSystemV2GetItSystemsByRightsHoldersAccessNullable1RightsHolderUuidNullable1IncludeDeactivatedNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQuery(rightsHolderUuid?: string, includeDeactivated?: boolean, changedSinceGtEq?: string, page?: number, pageSize?: number, extraHttpRequestParams?: any): Observable<Array<APIRightsHolderItSystemResponseDTO>>;

    /**
     * Returns all IT-Systems available to the current user
     * 
     * @param rightsHolderUuid Rightsholder UUID filter
     * @param businessTypeUuid Business type UUID filter
     * @param kleNumber KLE number filter (\&quot;NN.NN.NN\&quot; format)
     * @param kleUuid KLE UUID number filter
     * @param numberOfUsers Greater than or equal to number of users filter
     * @param includeDeactivated If set to true, the response will also include deactivated it-interfaces
     * @param changedSinceGtEq Include only changes which were LastModified (UTC) is equal to or greater than the provided value
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     */
    gETItSystemV2GetItSystemsNullable1RightsHolderUuidNullable1BusinessTypeUuidStringKleNumberNullable1KleUuidNullable1NumberOfUsersNullable1IncludeDeactivatedNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQuery(rightsHolderUuid?: string, businessTypeUuid?: string, kleNumber?: string, kleUuid?: string, numberOfUsers?: number, includeDeactivated?: boolean, changedSinceGtEq?: string, page?: number, pageSize?: number, extraHttpRequestParams?: any): Observable<Array<APIItSystemResponseDTO>>;

    /**
     * Partially updates an existing it-system using json merge patch semantics (RFC7396)  NOTE: Only active systems can be modified.
     * 
     * @param uuid Specific IT-System UUID
     * @param request 
     */
    pATCHItSystemV2PatchItSystemAsRightsHolderGuidUuidRightsHolderPartialUpdateSystemPropertiesRequestDTORequest(uuid: string, request: APIRightsHolderPartialUpdateSystemPropertiesRequestDTO, extraHttpRequestParams?: any): Observable<APIRightsHolderItSystemResponseDTO>;

    /**
     * Creates a new IT-System based on given input values
     * 
     * @param request A collection of specific IT-System values
     */
    pOSTItSystemV2PostItSystemAsRightsHolderRightsHolderCreateItSystemRequestDTORequest(request: APIRightsHolderCreateItSystemRequestDTO, extraHttpRequestParams?: any): Observable<APIRightsHolderItSystemResponseDTO>;

    /**
     * Sets IT-System values  If a property value is not provided, KITOS will fallback to the default value of the type and that will be written to the it-system so remember to define all data specified in the request DTO want them to have a value after the request.  Required properties dictate the minimum value set accepted by KITOS.  NOTE: Only active systems can be modified.
     * 
     * @param uuid Specific IT-System UUID
     * @param request 
     */
    pUTItSystemV2PutItSystemAsRightsHolderGuidUuidRightsHolderWritableITSystemPropertiesDTORequest(uuid: string, request: APIRightsHolderWritableITSystemPropertiesDTO, extraHttpRequestParams?: any): Observable<APIRightsHolderItSystemResponseDTO>;

}
