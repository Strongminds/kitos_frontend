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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APICreateNewContractRequestDTO } from '../model/aPICreateNewContractRequestDTO';
// @ts-ignore
import { APIItContractResponseDTO } from '../model/aPIItContractResponseDTO';
// @ts-ignore
import { APIUpdateContractRequestDTO } from '../model/aPIUpdateContractRequestDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import {
    APIV2ItContractServiceInterface
} from './v2ItContract.serviceInterface';



@Injectable({
  providedIn: 'root'
})
export class APIV2ItContractService implements APIV2ItContractServiceInterface {

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
     * Delete an existing contract
     * @param contractUuid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public dELETEItContractV2DeleteItContractGuidContractUuid(contractUuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<object>;
    public dELETEItContractV2DeleteItContractGuidContractUuid(contractUuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<object>>;
    public dELETEItContractV2DeleteItContractGuidContractUuid(contractUuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<object>>;
    public dELETEItContractV2DeleteItContractGuidContractUuid(contractUuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling dELETEItContractV2DeleteItContractGuidContractUuid.');
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

        let localVarPath = `/api/v2/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
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
     * Returns requested IT-Contract
     * @param contractUuid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItContractV2GetItContractGuidContractUuid(contractUuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItContractResponseDTO>;
    public gETItContractV2GetItContractGuidContractUuid(contractUuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItContractResponseDTO>>;
    public gETItContractV2GetItContractGuidContractUuid(contractUuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItContractResponseDTO>>;
    public gETItContractV2GetItContractGuidContractUuid(contractUuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling gETItContractV2GetItContractGuidContractUuid.');
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

        let localVarPath = `/api/v2/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIItContractResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns all IT-Contracts available to the current user within the provided organization context
     * @param organizationUuid Organization UUID filter
     * @param systemUuid Associated system UUID filter
     * @param systemUsageUuid Associated system usage UUID filter
     * @param dataProcessingRegistrationUuid Associated data processing registration UUID filter
     * @param responsibleOrgUnitUuid 
     * @param supplierUuid 
     * @param nameContent Name content filter
     * @param changedSinceGtEq Include only changes which were LastModified (UTC) is equal to or greater than the provided value
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItContractV2GetItContractsBoundedPaginationQueryPaginationQueryNullable1ChangedSinceGtEqNullable1DataProcessingRegistrationUuidNullable1OrganizationUuidNullable1ResponsibleOrgUnitUuidNullable1SupplierUuidNullable1SystemUsageUuidNullable1SystemUuidStringNameContent(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessingRegistrationUuid?: string, responsibleOrgUnitUuid?: string, supplierUuid?: string, nameContent?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIItContractResponseDTO>>;
    public gETItContractV2GetItContractsBoundedPaginationQueryPaginationQueryNullable1ChangedSinceGtEqNullable1DataProcessingRegistrationUuidNullable1OrganizationUuidNullable1ResponsibleOrgUnitUuidNullable1SupplierUuidNullable1SystemUsageUuidNullable1SystemUuidStringNameContent(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessingRegistrationUuid?: string, responsibleOrgUnitUuid?: string, supplierUuid?: string, nameContent?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIItContractResponseDTO>>>;
    public gETItContractV2GetItContractsBoundedPaginationQueryPaginationQueryNullable1ChangedSinceGtEqNullable1DataProcessingRegistrationUuidNullable1OrganizationUuidNullable1ResponsibleOrgUnitUuidNullable1SupplierUuidNullable1SystemUsageUuidNullable1SystemUuidStringNameContent(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessingRegistrationUuid?: string, responsibleOrgUnitUuid?: string, supplierUuid?: string, nameContent?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIItContractResponseDTO>>>;
    public gETItContractV2GetItContractsBoundedPaginationQueryPaginationQueryNullable1ChangedSinceGtEqNullable1DataProcessingRegistrationUuidNullable1OrganizationUuidNullable1ResponsibleOrgUnitUuidNullable1SupplierUuidNullable1SystemUsageUuidNullable1SystemUuidStringNameContent(organizationUuid?: string, systemUuid?: string, systemUsageUuid?: string, dataProcessingRegistrationUuid?: string, responsibleOrgUnitUuid?: string, supplierUuid?: string, nameContent?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationUuid !== undefined && organizationUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationUuid, 'organizationUuid');
        }
        if (systemUuid !== undefined && systemUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>systemUuid, 'systemUuid');
        }
        if (systemUsageUuid !== undefined && systemUsageUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>systemUsageUuid, 'systemUsageUuid');
        }
        if (dataProcessingRegistrationUuid !== undefined && dataProcessingRegistrationUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>dataProcessingRegistrationUuid, 'dataProcessingRegistrationUuid');
        }
        if (responsibleOrgUnitUuid !== undefined && responsibleOrgUnitUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>responsibleOrgUnitUuid, 'responsibleOrgUnitUuid');
        }
        if (supplierUuid !== undefined && supplierUuid !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>supplierUuid, 'supplierUuid');
        }
        if (nameContent !== undefined && nameContent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameContent, 'nameContent');
        }
        if (changedSinceGtEq !== undefined && changedSinceGtEq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>changedSinceGtEq, 'changedSinceGtEq');
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

        let localVarPath = `/api/v2/it-contracts`;
        return this.httpClient.request<Array<APIItContractResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Allows partial updates of an existing it-contract using json merge patch semantics (RFC7396)
     * @param contractUuid UUID of the contract in KITOS
     * @param request Full update of the contract
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pATCHItContractV2PatchItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItContractResponseDTO>;
    public pATCHItContractV2PatchItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItContractResponseDTO>>;
    public pATCHItContractV2PatchItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItContractResponseDTO>>;
    public pATCHItContractV2PatchItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling pATCHItContractV2PatchItContractUpdateContractRequestDTORequestGuidContractUuid.');
        }
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling pATCHItContractV2PatchItContractUpdateContractRequestDTORequestGuidContractUuid.');
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

        let localVarPath = `/api/v2/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIItContractResponseDTO>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: request,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Creates a new it-contract in the requested organization
     * @param request 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTItContractV2PostItContractCreateNewContractRequestDTORequest(request: APICreateNewContractRequestDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public pOSTItContractV2PostItContractCreateNewContractRequestDTORequest(request: APICreateNewContractRequestDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pOSTItContractV2PostItContractCreateNewContractRequestDTORequest(request: APICreateNewContractRequestDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pOSTItContractV2PostItContractCreateNewContractRequestDTORequest(request: APICreateNewContractRequestDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling pOSTItContractV2PostItContractCreateNewContractRequestDTORequest.');
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

        let localVarPath = `/api/v2/it-contracts`;
        return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: request,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Updates an existing it-contract  Note: PUT expects a full version of the updated contract. For partial updates, please use PATCH.
     * @param contractUuid UUID of the contract in KITOS
     * @param request Full update of the contract
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pUTItContractV2PutItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItContractResponseDTO>;
    public pUTItContractV2PutItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItContractResponseDTO>>;
    public pUTItContractV2PutItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItContractResponseDTO>>;
    public pUTItContractV2PutItContractUpdateContractRequestDTORequestGuidContractUuid(contractUuid: string, request: APIUpdateContractRequestDTO, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling pUTItContractV2PutItContractUpdateContractRequestDTORequestGuidContractUuid.');
        }
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling pUTItContractV2PutItContractUpdateContractRequestDTORequestGuidContractUuid.');
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

        let localVarPath = `/api/v2/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIItContractResponseDTO>('put', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: request,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
