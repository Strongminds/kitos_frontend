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
import { APILocalOptionCreateRequestDTO } from '../model/aPILocalOptionCreateRequestDTO';
// @ts-ignore
import { APILocalRegularOptionResponseDTO } from '../model/aPILocalRegularOptionResponseDTO';
// @ts-ignore
import { APILocalRegularOptionUpdateRequestDTO } from '../model/aPILocalRegularOptionUpdateRequestDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface DeleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyTypeRequestParams {
    organizationUuid: string;
    optionUuid: string;
}

export interface GetManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypesRequestParams {
    organizationUuid: string;
}

export interface GetSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionIdRequestParams {
    organizationUuid: string;
    optionUuid: string;
}

export interface PatchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyTypeRequestParams {
    organizationUuid: string;
    optionUuid: string;
    dto: APILocalRegularOptionUpdateRequestDTO;
}

export interface PostSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyTypeRequestParams {
    organizationUuid: string;
    dto: APILocalOptionCreateRequestDTO;
}


@Injectable({
  providedIn: 'root'
})
export class APIV2ItContractLocalProcurementStrategyTypesInternalINTERNALService {

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
    public deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType(requestParameters: DeleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyTypeRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<APILocalRegularOptionResponseDTO>;
    public deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType(requestParameters: DeleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyTypeRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
    public deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType(requestParameters: DeleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyTypeRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
    public deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType(requestParameters: DeleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyTypeRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType.');
        }
        const optionUuid = requestParameters.optionUuid;
        if (optionUuid === null || optionUuid === undefined) {
            throw new Error('Required parameter optionUuid was null or undefined when calling deleteSingleItContractLocalProcurementStrategyTypesInternalV2DeleteLocalProcurementStrategyType.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/local-option-types/procurement-strategy-types/${this.configuration.encodeParam({name: "optionUuid", value: optionUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APILocalRegularOptionResponseDTO>('delete', `${this.configuration.basePath}${localVarPath}`,
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
    public getManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes(requestParameters: GetManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APILocalRegularOptionResponseDTO>>;
    public getManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes(requestParameters: GetManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APILocalRegularOptionResponseDTO>>>;
    public getManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes(requestParameters: GetManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APILocalRegularOptionResponseDTO>>>;
    public getManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes(requestParameters: GetManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getManyItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypes.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/local-option-types/procurement-strategy-types`;
        return this.httpClient.request<Array<APILocalRegularOptionResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionId(requestParameters: GetSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionIdRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APILocalRegularOptionResponseDTO>;
    public getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionId(requestParameters: GetSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionIdRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
    public getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionId(requestParameters: GetSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionIdRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
    public getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionId(requestParameters: GetSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionIdRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionId.');
        }
        const optionUuid = requestParameters.optionUuid;
        if (optionUuid === null || optionUuid === undefined) {
            throw new Error('Required parameter optionUuid was null or undefined when calling getSingleItContractLocalProcurementStrategyTypesInternalV2GetLocalProcurementStrategyTypeByOptionId.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/local-option-types/procurement-strategy-types/${this.configuration.encodeParam({name: "optionUuid", value: optionUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APILocalRegularOptionResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType(requestParameters: PatchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyTypeRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APILocalRegularOptionResponseDTO>;
    public patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType(requestParameters: PatchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyTypeRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
    public patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType(requestParameters: PatchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyTypeRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
    public patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType(requestParameters: PatchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyTypeRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType.');
        }
        const optionUuid = requestParameters.optionUuid;
        if (optionUuid === null || optionUuid === undefined) {
            throw new Error('Required parameter optionUuid was null or undefined when calling patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType.');
        }
        const dto = requestParameters.dto;
        if (dto === null || dto === undefined) {
            throw new Error('Required parameter dto was null or undefined when calling patchSingleItContractLocalProcurementStrategyTypesInternalV2PatchLocalProcurementStrategyType.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/local-option-types/procurement-strategy-types/${this.configuration.encodeParam({name: "optionUuid", value: optionUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APILocalRegularOptionResponseDTO>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: dto,
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
    public postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType(requestParameters: PostSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyTypeRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APILocalRegularOptionResponseDTO>;
    public postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType(requestParameters: PostSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyTypeRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
    public postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType(requestParameters: PostSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyTypeRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
    public postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType(requestParameters: PostSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyTypeRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType.');
        }
        const dto = requestParameters.dto;
        if (dto === null || dto === undefined) {
            throw new Error('Required parameter dto was null or undefined when calling postSingleItContractLocalProcurementStrategyTypesInternalV2CreateLocalProcurementStrategyType.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/local-option-types/procurement-strategy-types`;
        return this.httpClient.request<APILocalRegularOptionResponseDTO>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: dto,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
