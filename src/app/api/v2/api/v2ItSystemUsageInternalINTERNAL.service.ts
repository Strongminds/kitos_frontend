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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APIExtendedRoleAssignmentResponseDTO } from '../model/aPIExtendedRoleAssignmentResponseDTO';
// @ts-ignore
import { APIGeneralSystemRelationResponseDTO } from '../model/aPIGeneralSystemRelationResponseDTO';
// @ts-ignore
import { APIItSystemUsageSearchResultResponseDTO } from '../model/aPIItSystemUsageSearchResultResponseDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface DeleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuidRequestParams {
    organizationUuid: string;
    systemUuid: string;
}

export interface GetManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuidRequestParams {
    systemUsageUuid: string;
}

export interface GetManyItSystemUsageInternalV2GetItSystemUsagesRequestParams {
    /** Required organization filter */
    organizationUuid: string;
    /** Query by systems with outgoing relations related to another system */
    relatedToSystemUuid?: string;
    /** Query by system usages with outgoing relations to a specific system usage (more narrow search than using system id) */
    relatedToSystemUsageUuid?: string;
    /** Query by contracts which are part of a system relation */
    relatedToContractUuid?: string;
    /** Query usages based on system name */
    systemNameContent?: string;
    /** Include only changes which were LastModified (UTC) is equal to or greater than the provided value */
    changedSinceGtEq?: string;
    /** Ordering property */
    orderByProperty?: 'CreationOrder' | 'Name' | 'LastChanged';
    /** 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0 */
    page?: number;
    /** Size of the page referred by \&#39;page\&#39;.  Range: [1,250] Default: 250. */
    pageSize?: number;
}

export interface GetManyItSystemUsageInternalV2GetRelationsByContractuuidRequestParams {
    contractUuid: string;
}


@Injectable({
  providedIn: 'root'
})
export class APIV2ItSystemUsageInternalINTERNALService {

    protected basePath = 'https://localhost:44300';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Deletes a system usage by organizationUuid and systemUuid.
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid(requestParameters: DeleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuidRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<object>;
    public deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid(requestParameters: DeleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuidRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<object>>;
    public deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid(requestParameters: DeleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuidRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<object>>;
    public deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid(requestParameters: DeleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuidRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid.');
        }
        const systemUuid = requestParameters.systemUuid;
        if (systemUuid === null || systemUuid === undefined) {
            throw new Error('Required parameter systemUuid was null or undefined when calling deleteSingleItSystemUsageInternalV2DeleteItSystemUsageByOrganizationUuidAndSystemUuid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v2/internal/it-system-usages/system/${this.configuration.encodeParam({name: "systemUuid", value: systemUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/organization/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<object>('delete', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get roles assigned to the system usage
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuid(requestParameters: GetManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuidRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIExtendedRoleAssignmentResponseDTO>>;
    public getManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuid(requestParameters: GetManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuidRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIExtendedRoleAssignmentResponseDTO>>>;
    public getManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuid(requestParameters: GetManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuidRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIExtendedRoleAssignmentResponseDTO>>>;
    public getManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuid(requestParameters: GetManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuidRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const systemUsageUuid = requestParameters.systemUsageUuid;
        if (systemUsageUuid === null || systemUsageUuid === undefined) {
            throw new Error('Required parameter systemUsageUuid was null or undefined when calling getManyItSystemUsageInternalV2GetAddRoleAssignmentsBySystemusageuuid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v2/internal/it-system-usages/${this.configuration.encodeParam({name: "systemUsageUuid", value: systemUsageUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles`;
        return this.httpClient.request<Array<APIExtendedRoleAssignmentResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Low-payload search endpoint alternative to the public endpoint which returns full objects.  This one is a convenience endpoint for UI cases returning only   - Name   - Uuid   - Valid state of the local registration   - Deactivated state of the system master data
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyItSystemUsageInternalV2GetItSystemUsages(requestParameters: GetManyItSystemUsageInternalV2GetItSystemUsagesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIItSystemUsageSearchResultResponseDTO>>;
    public getManyItSystemUsageInternalV2GetItSystemUsages(requestParameters: GetManyItSystemUsageInternalV2GetItSystemUsagesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIItSystemUsageSearchResultResponseDTO>>>;
    public getManyItSystemUsageInternalV2GetItSystemUsages(requestParameters: GetManyItSystemUsageInternalV2GetItSystemUsagesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIItSystemUsageSearchResultResponseDTO>>>;
    public getManyItSystemUsageInternalV2GetItSystemUsages(requestParameters: GetManyItSystemUsageInternalV2GetItSystemUsagesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getManyItSystemUsageInternalV2GetItSystemUsages.');
        }
        const relatedToSystemUuid = requestParameters.relatedToSystemUuid;
        const relatedToSystemUsageUuid = requestParameters.relatedToSystemUsageUuid;
        const relatedToContractUuid = requestParameters.relatedToContractUuid;
        const systemNameContent = requestParameters.systemNameContent;
        const changedSinceGtEq = requestParameters.changedSinceGtEq;
        const orderByProperty = requestParameters.orderByProperty;
        const page = requestParameters.page;
        const pageSize = requestParameters.pageSize;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationUuid !== undefined && organizationUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationUuid, 'organizationUuid');
        }
        if (relatedToSystemUuid !== undefined && relatedToSystemUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>relatedToSystemUuid, 'relatedToSystemUuid');
        }
        if (relatedToSystemUsageUuid !== undefined && relatedToSystemUsageUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>relatedToSystemUsageUuid, 'relatedToSystemUsageUuid');
        }
        if (relatedToContractUuid !== undefined && relatedToContractUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>relatedToContractUuid, 'relatedToContractUuid');
        }
        if (systemNameContent !== undefined && systemNameContent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>systemNameContent, 'systemNameContent');
        }
        if (changedSinceGtEq !== undefined && changedSinceGtEq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>changedSinceGtEq, 'changedSinceGtEq');
        }
        if (orderByProperty !== undefined && orderByProperty !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>orderByProperty, 'orderByProperty');
        }
        if (page !== undefined && page !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>page, 'page');
        }
        if (pageSize !== undefined && pageSize !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>pageSize, 'pageSize');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v2/internal/it-system-usages/search`;
        return this.httpClient.request<Array<APIItSystemUsageSearchResultResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyItSystemUsageInternalV2GetRelationsByContractuuid(requestParameters: GetManyItSystemUsageInternalV2GetRelationsByContractuuidRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIGeneralSystemRelationResponseDTO>>;
    public getManyItSystemUsageInternalV2GetRelationsByContractuuid(requestParameters: GetManyItSystemUsageInternalV2GetRelationsByContractuuidRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIGeneralSystemRelationResponseDTO>>>;
    public getManyItSystemUsageInternalV2GetRelationsByContractuuid(requestParameters: GetManyItSystemUsageInternalV2GetRelationsByContractuuidRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIGeneralSystemRelationResponseDTO>>>;
    public getManyItSystemUsageInternalV2GetRelationsByContractuuid(requestParameters: GetManyItSystemUsageInternalV2GetRelationsByContractuuidRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling getManyItSystemUsageInternalV2GetRelationsByContractuuid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v2/internal/it-system-usages/relations/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<Array<APIGeneralSystemRelationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
