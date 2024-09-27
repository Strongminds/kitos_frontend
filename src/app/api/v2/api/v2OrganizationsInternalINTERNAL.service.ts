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
import { APIOrganizationMasterDataRequestDTO } from '../model/aPIOrganizationMasterDataRequestDTO';
// @ts-ignore
import { APIOrganizationMasterDataResponseDTO } from '../model/aPIOrganizationMasterDataResponseDTO';
// @ts-ignore
import { APIOrganizationMasterDataRolesRequestDTO } from '../model/aPIOrganizationMasterDataRolesRequestDTO';
// @ts-ignore
import { APIOrganizationMasterDataRolesResponseDTO } from '../model/aPIOrganizationMasterDataRolesResponseDTO';
// @ts-ignore
import { APIResourcePermissionsResponseDTO } from '../model/aPIResourcePermissionsResponseDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface GetSingleOrganizationsInternalV2GetOrganizationMasterDataRequestParams {
    organizationUuid: string;
}

export interface GetSingleOrganizationsInternalV2GetOrganizationMasterDataRolesRequestParams {
    organizationUuid: string;
}

export interface GetSingleOrganizationsInternalV2GetPermissionsRequestParams {
    organizationUuid: string;
}

export interface PatchSingleOrganizationsInternalV2UpdateOrganizationMasterDataRequestParams {
    organizationUuid: string;
    requestDto: APIOrganizationMasterDataRequestDTO;
}

export interface PatchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRolesRequestParams {
    organizationUuid: string;
    requestDto: APIOrganizationMasterDataRolesRequestDTO;
}


@Injectable({
  providedIn: 'root'
})
export class APIV2OrganizationsInternalINTERNALService {

    protected basePath = 'https://kitos-dev.strongminds.dk';
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleOrganizationsInternalV2GetOrganizationMasterData(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIOrganizationMasterDataResponseDTO>;
    public getSingleOrganizationsInternalV2GetOrganizationMasterData(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIOrganizationMasterDataResponseDTO>>;
    public getSingleOrganizationsInternalV2GetOrganizationMasterData(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIOrganizationMasterDataResponseDTO>>;
    public getSingleOrganizationsInternalV2GetOrganizationMasterData(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getSingleOrganizationsInternalV2GetOrganizationMasterData.');
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

        let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/masterData`;
        return this.httpClient.request<APIOrganizationMasterDataResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRolesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIOrganizationMasterDataRolesResponseDTO>;
    public getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRolesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIOrganizationMasterDataRolesResponseDTO>>;
    public getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRolesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIOrganizationMasterDataRolesResponseDTO>>;
    public getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles(requestParameters: GetSingleOrganizationsInternalV2GetOrganizationMasterDataRolesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles.');
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

        let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/masterData/roles`;
        return this.httpClient.request<APIOrganizationMasterDataRolesResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleOrganizationsInternalV2GetPermissions(requestParameters: GetSingleOrganizationsInternalV2GetPermissionsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIResourcePermissionsResponseDTO>;
    public getSingleOrganizationsInternalV2GetPermissions(requestParameters: GetSingleOrganizationsInternalV2GetPermissionsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIResourcePermissionsResponseDTO>>;
    public getSingleOrganizationsInternalV2GetPermissions(requestParameters: GetSingleOrganizationsInternalV2GetPermissionsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIResourcePermissionsResponseDTO>>;
    public getSingleOrganizationsInternalV2GetPermissions(requestParameters: GetSingleOrganizationsInternalV2GetPermissionsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getSingleOrganizationsInternalV2GetPermissions.');
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

        let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/permissions`;
        return this.httpClient.request<APIResourcePermissionsResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public patchSingleOrganizationsInternalV2UpdateOrganizationMasterData(requestParameters: PatchSingleOrganizationsInternalV2UpdateOrganizationMasterDataRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIOrganizationMasterDataResponseDTO>;
    public patchSingleOrganizationsInternalV2UpdateOrganizationMasterData(requestParameters: PatchSingleOrganizationsInternalV2UpdateOrganizationMasterDataRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIOrganizationMasterDataResponseDTO>>;
    public patchSingleOrganizationsInternalV2UpdateOrganizationMasterData(requestParameters: PatchSingleOrganizationsInternalV2UpdateOrganizationMasterDataRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIOrganizationMasterDataResponseDTO>>;
    public patchSingleOrganizationsInternalV2UpdateOrganizationMasterData(requestParameters: PatchSingleOrganizationsInternalV2UpdateOrganizationMasterDataRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling patchSingleOrganizationsInternalV2UpdateOrganizationMasterData.');
        }
        const requestDto = requestParameters.requestDto;
        if (requestDto === null || requestDto === undefined) {
            throw new Error('Required parameter requestDto was null or undefined when calling patchSingleOrganizationsInternalV2UpdateOrganizationMasterData.');
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


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/merge-patch+json',
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
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

        let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/masterData`;
        return this.httpClient.request<APIOrganizationMasterDataResponseDTO>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: requestDto,
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
    public patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles(requestParameters: PatchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRolesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIOrganizationMasterDataRolesResponseDTO>;
    public patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles(requestParameters: PatchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRolesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIOrganizationMasterDataRolesResponseDTO>>;
    public patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles(requestParameters: PatchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRolesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIOrganizationMasterDataRolesResponseDTO>>;
    public patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles(requestParameters: PatchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRolesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles.');
        }
        const requestDto = requestParameters.requestDto;
        if (requestDto === null || requestDto === undefined) {
            throw new Error('Required parameter requestDto was null or undefined when calling patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles.');
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


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/merge-patch+json',
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
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

        let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/masterData/roles`;
        return this.httpClient.request<APIOrganizationMasterDataRolesResponseDTO>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: requestDto,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
