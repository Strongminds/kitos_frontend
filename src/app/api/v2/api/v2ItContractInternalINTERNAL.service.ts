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
import { APIAppliedProcurementPlanResponseDTO } from '../model/aPIAppliedProcurementPlanResponseDTO';
// @ts-ignore
import { APIExtendedRoleAssignmentResponseDTO } from '../model/aPIExtendedRoleAssignmentResponseDTO';
// @ts-ignore
import { APIIdentityNamePairResponseDTO } from '../model/aPIIdentityNamePairResponseDTO';
// @ts-ignore
import { APIItContractHierarchyNodeResponseDTO } from '../model/aPIItContractHierarchyNodeResponseDTO';
// @ts-ignore
import { APIItContractResponseDTO } from '../model/aPIItContractResponseDTO';
// @ts-ignore
import { APIMultipleContractsRequestDto } from '../model/aPIMultipleContractsRequestDto';
// @ts-ignore
import { APIRoleAssignmentRequestDTO } from '../model/aPIRoleAssignmentRequestDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface DeleteSingleItContractInternalV2DeleteItContractWithChildrenRequestParams {
    contractUuid: string;
}

export interface GetManyItContractInternalV2GetAddRoleAssignmentsRequestParams {
    contractUuid: string;
}

export interface GetManyItContractInternalV2GetAppliedProcurementPlansRequestParams {
    organizationUuid: string;
}

export interface GetManyItContractInternalV2GetDataProcessingRegistrationsRequestParams {
    contractUuid: string;
    nameQuery?: string;
    pageSize?: number;
}

export interface GetManyItContractInternalV2GetHierarchyRequestParams {
    contractUuid: string;
}

export interface PatchSingleItContractInternalV2PatchAddRoleAssignmentRequestParams {
    contractUuid: string;
    request: APIRoleAssignmentRequestDTO;
}

export interface PatchSingleItContractInternalV2PatchRemoveRoleAssignmentRequestParams {
    contractUuid: string;
    request: APIRoleAssignmentRequestDTO;
}

export interface PatchSingleItContractInternalV2TransferItContractRangeRequestParams {
    parentUuid: string;
    request: APIMultipleContractsRequestDto;
}


@Injectable({
  providedIn: 'root'
})
export class APIV2ItContractInternalINTERNALService {

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
     * Delete an existing contract together with all its children
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteSingleItContractInternalV2DeleteItContractWithChildren(requestParameters: DeleteSingleItContractInternalV2DeleteItContractWithChildrenRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<object>;
    public deleteSingleItContractInternalV2DeleteItContractWithChildren(requestParameters: DeleteSingleItContractInternalV2DeleteItContractWithChildrenRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<object>>;
    public deleteSingleItContractInternalV2DeleteItContractWithChildren(requestParameters: DeleteSingleItContractInternalV2DeleteItContractWithChildrenRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<object>>;
    public deleteSingleItContractInternalV2DeleteItContractWithChildren(requestParameters: DeleteSingleItContractInternalV2DeleteItContractWithChildrenRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling deleteSingleItContractInternalV2DeleteItContractWithChildren.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/delete-with-children`;
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
     * Get roles assigned to the contract
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyItContractInternalV2GetAddRoleAssignments(requestParameters: GetManyItContractInternalV2GetAddRoleAssignmentsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIExtendedRoleAssignmentResponseDTO>>;
    public getManyItContractInternalV2GetAddRoleAssignments(requestParameters: GetManyItContractInternalV2GetAddRoleAssignmentsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIExtendedRoleAssignmentResponseDTO>>>;
    public getManyItContractInternalV2GetAddRoleAssignments(requestParameters: GetManyItContractInternalV2GetAddRoleAssignmentsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIExtendedRoleAssignmentResponseDTO>>>;
    public getManyItContractInternalV2GetAddRoleAssignments(requestParameters: GetManyItContractInternalV2GetAddRoleAssignmentsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling getManyItContractInternalV2GetAddRoleAssignments.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles`;
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getManyItContractInternalV2GetAppliedProcurementPlans(requestParameters: GetManyItContractInternalV2GetAppliedProcurementPlansRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIAppliedProcurementPlanResponseDTO>>;
    public getManyItContractInternalV2GetAppliedProcurementPlans(requestParameters: GetManyItContractInternalV2GetAppliedProcurementPlansRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIAppliedProcurementPlanResponseDTO>>>;
    public getManyItContractInternalV2GetAppliedProcurementPlans(requestParameters: GetManyItContractInternalV2GetAppliedProcurementPlansRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIAppliedProcurementPlanResponseDTO>>>;
    public getManyItContractInternalV2GetAppliedProcurementPlans(requestParameters: GetManyItContractInternalV2GetAppliedProcurementPlansRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const organizationUuid = requestParameters.organizationUuid;
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling getManyItContractInternalV2GetAppliedProcurementPlans.');
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

        let localVarPath = `/api/v2/internal/it-contracts/applied-procurement-plans/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<Array<APIAppliedProcurementPlanResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getManyItContractInternalV2GetDataProcessingRegistrations(requestParameters: GetManyItContractInternalV2GetDataProcessingRegistrationsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIIdentityNamePairResponseDTO>>;
    public getManyItContractInternalV2GetDataProcessingRegistrations(requestParameters: GetManyItContractInternalV2GetDataProcessingRegistrationsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIIdentityNamePairResponseDTO>>>;
    public getManyItContractInternalV2GetDataProcessingRegistrations(requestParameters: GetManyItContractInternalV2GetDataProcessingRegistrationsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIIdentityNamePairResponseDTO>>>;
    public getManyItContractInternalV2GetDataProcessingRegistrations(requestParameters: GetManyItContractInternalV2GetDataProcessingRegistrationsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling getManyItContractInternalV2GetDataProcessingRegistrations.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/data-processing-registrations`;
        return this.httpClient.request<Array<APIIdentityNamePairResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public getManyItContractInternalV2GetHierarchy(requestParameters: GetManyItContractInternalV2GetHierarchyRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIItContractHierarchyNodeResponseDTO>>;
    public getManyItContractInternalV2GetHierarchy(requestParameters: GetManyItContractInternalV2GetHierarchyRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIItContractHierarchyNodeResponseDTO>>>;
    public getManyItContractInternalV2GetHierarchy(requestParameters: GetManyItContractInternalV2GetHierarchyRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIItContractHierarchyNodeResponseDTO>>>;
    public getManyItContractInternalV2GetHierarchy(requestParameters: GetManyItContractInternalV2GetHierarchyRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling getManyItContractInternalV2GetHierarchy.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/hierarchy`;
        return this.httpClient.request<Array<APIItContractHierarchyNodeResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
    public patchSingleItContractInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchAddRoleAssignmentRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItContractResponseDTO>;
    public patchSingleItContractInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchAddRoleAssignmentRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItContractResponseDTO>>;
    public patchSingleItContractInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchAddRoleAssignmentRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItContractResponseDTO>>;
    public patchSingleItContractInternalV2PatchAddRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchAddRoleAssignmentRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling patchSingleItContractInternalV2PatchAddRoleAssignment.');
        }
        const request = requestParameters.request;
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling patchSingleItContractInternalV2PatchAddRoleAssignment.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles/add`;
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
     * Remove an existing role assignment to the it-contract
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public patchSingleItContractInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchRemoveRoleAssignmentRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIItContractResponseDTO>;
    public patchSingleItContractInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchRemoveRoleAssignmentRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIItContractResponseDTO>>;
    public patchSingleItContractInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchRemoveRoleAssignmentRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIItContractResponseDTO>>;
    public patchSingleItContractInternalV2PatchRemoveRoleAssignment(requestParameters: PatchSingleItContractInternalV2PatchRemoveRoleAssignmentRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const contractUuid = requestParameters.contractUuid;
        if (contractUuid === null || contractUuid === undefined) {
            throw new Error('Required parameter contractUuid was null or undefined when calling patchSingleItContractInternalV2PatchRemoveRoleAssignment.');
        }
        const request = requestParameters.request;
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling patchSingleItContractInternalV2PatchRemoveRoleAssignment.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "contractUuid", value: contractUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/roles/remove`;
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
     * Transfer multiple contracts
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public patchSingleItContractInternalV2TransferItContractRange(requestParameters: PatchSingleItContractInternalV2TransferItContractRangeRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public patchSingleItContractInternalV2TransferItContractRange(requestParameters: PatchSingleItContractInternalV2TransferItContractRangeRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public patchSingleItContractInternalV2TransferItContractRange(requestParameters: PatchSingleItContractInternalV2TransferItContractRangeRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public patchSingleItContractInternalV2TransferItContractRange(requestParameters: PatchSingleItContractInternalV2TransferItContractRangeRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const parentUuid = requestParameters.parentUuid;
        if (parentUuid === null || parentUuid === undefined) {
            throw new Error('Required parameter parentUuid was null or undefined when calling patchSingleItContractInternalV2TransferItContractRange.');
        }
        const request = requestParameters.request;
        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling patchSingleItContractInternalV2TransferItContractRange.');
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

        let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({name: "parentUuid", value: parentUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/transfer`;
        return this.httpClient.request<object>('patch', `${this.configuration.basePath}${localVarPath}`,
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
