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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { APIItContractDTOApiReturnDTO } from '../model/aPIItContractDTOApiReturnDTO';
// @ts-ignore
import { APINamedEntityDTOIEnumerableApiReturnDTO } from '../model/aPINamedEntityDTOIEnumerableApiReturnDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface GetSingleItContractGetRequestParams {
    q: string;
    orgId: number;
    /** Størrelse på resultatsættet.  Standardværdien er \&#39;100\&#39; */
    take?: number;
    /** Antal der skal ignoreres inden resultatsættet dannes.  Standardværdien er \&#39;0\&#39; */
    skip?: number;
    /** Bestemmer hvilket felt der sorteres på inden resultatsættet dannes.  Standardværdien er \&#39;Id\&#39; */
    orderBy?: string;
    /** Bestemmer om sorteringen skal være faldende  Standardværdien er \&#39;false\&#39; */
    descending?: boolean;
}

export interface GetSingleItContractGetAppliedProcurementsByOrganizationidRequestParams {
    organizationId: number;
}

export interface GetSingleItContractGetAvailableDataProcessingRegistrationsByIdRequestParams {
    id: number;
    nameQuery?: string;
    pageSize?: number;
}

export interface GetSingleItContractGetContractOptionsByOrganizationidRequestParams {
    organizationId: number;
}

export interface GetSingleItContractGetSingleByIdRequestParams {
    id: number;
}

export interface GetSingleItContractGetValidationStatusByContractidRequestParams {
    contractId: number;
}


@Injectable({
  providedIn: 'root'
})
export class APIV1ItContractINTERNALService {

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
    public getSingleItContractGet(requestParameters: GetSingleItContractGetRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<APINamedEntityDTOIEnumerableApiReturnDTO>;
    public getSingleItContractGet(requestParameters: GetSingleItContractGetRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<APINamedEntityDTOIEnumerableApiReturnDTO>>;
    public getSingleItContractGet(requestParameters: GetSingleItContractGetRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<APINamedEntityDTOIEnumerableApiReturnDTO>>;
    public getSingleItContractGet(requestParameters: GetSingleItContractGetRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        const q = requestParameters.q;
        if (q === null || q === undefined) {
            throw new Error('Required parameter q was null or undefined when calling getSingleItContractGet.');
        }
        const orgId = requestParameters.orgId;
        if (orgId === null || orgId === undefined) {
            throw new Error('Required parameter orgId was null or undefined when calling getSingleItContractGet.');
        }
        const take = requestParameters.take;
        const skip = requestParameters.skip;
        const orderBy = requestParameters.orderBy;
        const descending = requestParameters.descending;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (q !== undefined && q !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>q, 'q');
        }
        if (orgId !== undefined && orgId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>orgId, 'orgId');
        }
        if (take !== undefined && take !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>take, 'take');
        }
        if (skip !== undefined && skip !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>skip, 'skip');
        }
        if (orderBy !== undefined && orderBy !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>orderBy, 'orderBy');
        }
        if (descending !== undefined && descending !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>descending, 'descending');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
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

        let localVarPath = `/api/ItContract`;
        return this.httpClient.request<APINamedEntityDTOIEnumerableApiReturnDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getSingleItContractGetAppliedProcurementsByOrganizationid(requestParameters: GetSingleItContractGetAppliedProcurementsByOrganizationidRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public getSingleItContractGetAppliedProcurementsByOrganizationid(requestParameters: GetSingleItContractGetAppliedProcurementsByOrganizationidRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public getSingleItContractGetAppliedProcurementsByOrganizationid(requestParameters: GetSingleItContractGetAppliedProcurementsByOrganizationidRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public getSingleItContractGetAppliedProcurementsByOrganizationid(requestParameters: GetSingleItContractGetAppliedProcurementsByOrganizationidRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {
        const organizationId = requestParameters.organizationId;
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling getSingleItContractGetAppliedProcurementsByOrganizationid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
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

        let localVarPath = `/api/itcontract/applied-procurement-plans/${this.configuration.encodeParam({name: "organizationId", value: organizationId, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}`;
        return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getSingleItContractGetAvailableDataProcessingRegistrationsById(requestParameters: GetSingleItContractGetAvailableDataProcessingRegistrationsByIdRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public getSingleItContractGetAvailableDataProcessingRegistrationsById(requestParameters: GetSingleItContractGetAvailableDataProcessingRegistrationsByIdRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public getSingleItContractGetAvailableDataProcessingRegistrationsById(requestParameters: GetSingleItContractGetAvailableDataProcessingRegistrationsByIdRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public getSingleItContractGetAvailableDataProcessingRegistrationsById(requestParameters: GetSingleItContractGetAvailableDataProcessingRegistrationsByIdRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getSingleItContractGetAvailableDataProcessingRegistrationsById.');
        }
        const nameQuery = requestParameters.nameQuery;
        const pageSize = requestParameters.pageSize;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (nameQuery !== undefined && nameQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameQuery, 'nameQuery');
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

        let localVarPath = `/api/itcontract/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}/data-processing-registration/available`;
        return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getSingleItContractGetContractOptionsByOrganizationid(requestParameters: GetSingleItContractGetContractOptionsByOrganizationidRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public getSingleItContractGetContractOptionsByOrganizationid(requestParameters: GetSingleItContractGetContractOptionsByOrganizationidRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public getSingleItContractGetContractOptionsByOrganizationid(requestParameters: GetSingleItContractGetContractOptionsByOrganizationidRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public getSingleItContractGetContractOptionsByOrganizationid(requestParameters: GetSingleItContractGetContractOptionsByOrganizationidRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {
        const organizationId = requestParameters.organizationId;
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling getSingleItContractGetContractOptionsByOrganizationid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
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

        let localVarPath = `/api/itcontract/available-options-in/${this.configuration.encodeParam({name: "organizationId", value: organizationId, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}`;
        return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getSingleItContractGetSingleById(requestParameters: GetSingleItContractGetSingleByIdRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<APIItContractDTOApiReturnDTO>;
    public getSingleItContractGetSingleById(requestParameters: GetSingleItContractGetSingleByIdRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<APIItContractDTOApiReturnDTO>>;
    public getSingleItContractGetSingleById(requestParameters: GetSingleItContractGetSingleByIdRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<APIItContractDTOApiReturnDTO>>;
    public getSingleItContractGetSingleById(requestParameters: GetSingleItContractGetSingleByIdRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getSingleItContractGetSingleById.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json',
                'text/json'
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

        let localVarPath = `/api/ItContract/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}`;
        return this.httpClient.request<APIItContractDTOApiReturnDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getSingleItContractGetValidationStatusByContractid(requestParameters: GetSingleItContractGetValidationStatusByContractidRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public getSingleItContractGetValidationStatusByContractid(requestParameters: GetSingleItContractGetValidationStatusByContractidRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public getSingleItContractGetValidationStatusByContractid(requestParameters: GetSingleItContractGetValidationStatusByContractidRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public getSingleItContractGetValidationStatusByContractid(requestParameters: GetSingleItContractGetValidationStatusByContractidRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {
        const contractId = requestParameters.contractId;
        if (contractId === null || contractId === undefined) {
            throw new Error('Required parameter contractId was null or undefined when calling getSingleItContractGetValidationStatusByContractid.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
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

        let localVarPath = `/api/itcontract/${this.configuration.encodeParam({name: "contractId", value: contractId, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}/validation-details`;
        return this.httpClient.request<any>('get', `${this.configuration.basePath}${localVarPath}`,
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
