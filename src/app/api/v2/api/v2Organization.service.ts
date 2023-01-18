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
import { APIOrganizationResponseDTO } from '../model/aPIOrganizationResponseDTO';
// @ts-ignore
import { APIOrganizationUnitResponseDTO } from '../model/aPIOrganizationUnitResponseDTO';
// @ts-ignore
import { APIOrganizationUserResponseDTO } from '../model/aPIOrganizationUserResponseDTO';
// @ts-ignore
import { APIShallowOrganizationResponseDTO } from '../model/aPIShallowOrganizationResponseDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import {
    APIV2OrganizationServiceInterface
} from './v2Organization.serviceInterface';



@Injectable({
  providedIn: 'root'
})
export class APIV2OrganizationService implements APIV2OrganizationServiceInterface {

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
     * Returns organization identified by uuid
     * @param organizationUuid UUID of the organization
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationGuidOrganizationUuidByOrganizationuuid(organizationUuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIOrganizationResponseDTO>>;
    public gETOrganizationV2GetOrganizationGuidOrganizationUuidByOrganizationuuid(organizationUuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIOrganizationResponseDTO>>>;
    public gETOrganizationV2GetOrganizationGuidOrganizationUuidByOrganizationuuid(organizationUuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIOrganizationResponseDTO>>>;
    public gETOrganizationV2GetOrganizationGuidOrganizationUuidByOrganizationuuid(organizationUuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling gETOrganizationV2GetOrganizationGuidOrganizationUuidByOrganizationuuid.');
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

        let localVarPath = `/api/v2/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<Array<APIOrganizationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns the a specific organization unit inside an organization
     * @param organizationUuid UUID of the organization
     * @param organizationUnitId UUID of the organization unit in KITOS
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationUnitGuidOrganizationUuidGuidOrganizationUnitIdByOrganizationuuidAndOrganizationunitid(organizationUuid: string, organizationUnitId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIOrganizationUnitResponseDTO>;
    public gETOrganizationV2GetOrganizationUnitGuidOrganizationUuidGuidOrganizationUnitIdByOrganizationuuidAndOrganizationunitid(organizationUuid: string, organizationUnitId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIOrganizationUnitResponseDTO>>;
    public gETOrganizationV2GetOrganizationUnitGuidOrganizationUuidGuidOrganizationUnitIdByOrganizationuuidAndOrganizationunitid(organizationUuid: string, organizationUnitId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIOrganizationUnitResponseDTO>>;
    public gETOrganizationV2GetOrganizationUnitGuidOrganizationUuidGuidOrganizationUnitIdByOrganizationuuidAndOrganizationunitid(organizationUuid: string, organizationUnitId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling gETOrganizationV2GetOrganizationUnitGuidOrganizationUuidGuidOrganizationUnitIdByOrganizationuuidAndOrganizationunitid.');
        }
        if (organizationUnitId === null || organizationUnitId === undefined) {
            throw new Error('Required parameter organizationUnitId was null or undefined when calling gETOrganizationV2GetOrganizationUnitGuidOrganizationUuidGuidOrganizationUnitIdByOrganizationuuidAndOrganizationunitid.');
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

        let localVarPath = `/api/v2/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/organization-units/${this.configuration.encodeParam({name: "organizationUnitId", value: organizationUnitId, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIOrganizationUnitResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns the organization units of an organization if the authenticated user is a member of the organization.
     * @param organizationUuid UUID of the organization
     * @param nameQuery Query by text in name or email
     * @param changedSinceGtEq Include only changes which were LastModified (UTC) is equal to or greater than the provided value
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationUnitsGuidOrganizationUuidStringNameQueryNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameQuery?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIOrganizationUnitResponseDTO>>;
    public gETOrganizationV2GetOrganizationUnitsGuidOrganizationUuidStringNameQueryNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameQuery?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIOrganizationUnitResponseDTO>>>;
    public gETOrganizationV2GetOrganizationUnitsGuidOrganizationUuidStringNameQueryNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameQuery?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIOrganizationUnitResponseDTO>>>;
    public gETOrganizationV2GetOrganizationUnitsGuidOrganizationUuidStringNameQueryNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameQuery?: string, changedSinceGtEq?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling gETOrganizationV2GetOrganizationUnitsGuidOrganizationUuidStringNameQueryNullable1ChangedSinceGtEqBoundedPaginationQueryPaginationQueryByOrganizationuuid.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (nameQuery !== undefined && nameQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameQuery, 'nameQuery');
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

        let localVarPath = `/api/v2/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/organization-units`;
        return this.httpClient.request<Array<APIOrganizationUnitResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns the a specific user within an organization
     * @param organizationUuid UUID of the organization
     * @param userUuid UUID of the user entity in KITOS
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationUserGuidOrganizationUuidGuidUserUuidByOrganizationuuidAndUseruuid(organizationUuid: string, userUuid: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<APIOrganizationUserResponseDTO>;
    public gETOrganizationV2GetOrganizationUserGuidOrganizationUuidGuidUserUuidByOrganizationuuidAndUseruuid(organizationUuid: string, userUuid: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<APIOrganizationUserResponseDTO>>;
    public gETOrganizationV2GetOrganizationUserGuidOrganizationUuidGuidUserUuidByOrganizationuuidAndUseruuid(organizationUuid: string, userUuid: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<APIOrganizationUserResponseDTO>>;
    public gETOrganizationV2GetOrganizationUserGuidOrganizationUuidGuidUserUuidByOrganizationuuidAndUseruuid(organizationUuid: string, userUuid: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling gETOrganizationV2GetOrganizationUserGuidOrganizationUuidGuidUserUuidByOrganizationuuidAndUseruuid.');
        }
        if (userUuid === null || userUuid === undefined) {
            throw new Error('Required parameter userUuid was null or undefined when calling gETOrganizationV2GetOrganizationUserGuidOrganizationUuidGuidUserUuidByOrganizationuuidAndUseruuid.');
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

        let localVarPath = `/api/v2/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/users/${this.configuration.encodeParam({name: "userUuid", value: userUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}`;
        return this.httpClient.request<APIOrganizationUserResponseDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns the users of an organization if the authenticated user is a member of the organization.
     * @param organizationUuid UUID of the organization
     * @param nameOrEmailQuery Query by text in name or email
     * @param roleQuery Query by role assignment
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationUsersGuidOrganizationUuidStringNameOrEmailQueryNullable1RoleQueryBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameOrEmailQuery?: string, roleQuery?: 'User' | 'LocalAdmin' | 'OrganizationModuleAdmin' | 'SystemModuleAdmin' | 'ContractModuleAdmin' | 'RightsHolderAccess', page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIOrganizationUserResponseDTO>>;
    public gETOrganizationV2GetOrganizationUsersGuidOrganizationUuidStringNameOrEmailQueryNullable1RoleQueryBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameOrEmailQuery?: string, roleQuery?: 'User' | 'LocalAdmin' | 'OrganizationModuleAdmin' | 'SystemModuleAdmin' | 'ContractModuleAdmin' | 'RightsHolderAccess', page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIOrganizationUserResponseDTO>>>;
    public gETOrganizationV2GetOrganizationUsersGuidOrganizationUuidStringNameOrEmailQueryNullable1RoleQueryBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameOrEmailQuery?: string, roleQuery?: 'User' | 'LocalAdmin' | 'OrganizationModuleAdmin' | 'SystemModuleAdmin' | 'ContractModuleAdmin' | 'RightsHolderAccess', page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIOrganizationUserResponseDTO>>>;
    public gETOrganizationV2GetOrganizationUsersGuidOrganizationUuidStringNameOrEmailQueryNullable1RoleQueryBoundedPaginationQueryPaginationQueryByOrganizationuuid(organizationUuid: string, nameOrEmailQuery?: string, roleQuery?: 'User' | 'LocalAdmin' | 'OrganizationModuleAdmin' | 'SystemModuleAdmin' | 'ContractModuleAdmin' | 'RightsHolderAccess', page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (organizationUuid === null || organizationUuid === undefined) {
            throw new Error('Required parameter organizationUuid was null or undefined when calling gETOrganizationV2GetOrganizationUsersGuidOrganizationUuidStringNameOrEmailQueryNullable1RoleQueryBoundedPaginationQueryPaginationQueryByOrganizationuuid.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (nameOrEmailQuery !== undefined && nameOrEmailQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameOrEmailQuery, 'nameOrEmailQuery');
        }
        if (roleQuery !== undefined && roleQuery !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>roleQuery, 'roleQuery');
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

        let localVarPath = `/api/v2/organizations/${this.configuration.encodeParam({name: "organizationUuid", value: organizationUuid, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: "uuid"})}/users`;
        return this.httpClient.request<Array<APIOrganizationUserResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns organizations in which the current user has \&quot;RightsHolderAccess\&quot; permission
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationsAsRightsHolderBoundedPaginationQueryPagination(page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIShallowOrganizationResponseDTO>>;
    public gETOrganizationV2GetOrganizationsAsRightsHolderBoundedPaginationQueryPagination(page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIShallowOrganizationResponseDTO>>>;
    public gETOrganizationV2GetOrganizationsAsRightsHolderBoundedPaginationQueryPagination(page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIShallowOrganizationResponseDTO>>>;
    public gETOrganizationV2GetOrganizationsAsRightsHolderBoundedPaginationQueryPagination(page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
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

        let localVarPath = `/api/v2/rightsholder/organizations`;
        return this.httpClient.request<Array<APIShallowOrganizationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns organizations organizations from KITOS
     * @param onlyWhereUserHasMembership If set to true, only organizations where the user has role(s) will be included.
     * @param nameContent Optional query for name content
     * @param cvrContent Optional query on CVR number
     * @param page 0-based page number. Use this parameter to page through the requested collection.  Offset in the source collection will be (pageSize * page)  Range: [0,2^31] Default: 0
     * @param pageSize Size of the page referred by \&#39;page\&#39;.  Range: [1,100] Default: 100.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETOrganizationV2GetOrganizationsBooleanOnlyWhereUserHasMembershipStringNameContentStringCvrContentBoundedPaginationQueryPagination(onlyWhereUserHasMembership?: boolean, nameContent?: string, cvrContent?: string, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<APIOrganizationResponseDTO>>;
    public gETOrganizationV2GetOrganizationsBooleanOnlyWhereUserHasMembershipStringNameContentStringCvrContentBoundedPaginationQueryPagination(onlyWhereUserHasMembership?: boolean, nameContent?: string, cvrContent?: string, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<APIOrganizationResponseDTO>>>;
    public gETOrganizationV2GetOrganizationsBooleanOnlyWhereUserHasMembershipStringNameContentStringCvrContentBoundedPaginationQueryPagination(onlyWhereUserHasMembership?: boolean, nameContent?: string, cvrContent?: string, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<APIOrganizationResponseDTO>>>;
    public gETOrganizationV2GetOrganizationsBooleanOnlyWhereUserHasMembershipStringNameContentStringCvrContentBoundedPaginationQueryPagination(onlyWhereUserHasMembership?: boolean, nameContent?: string, cvrContent?: string, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (onlyWhereUserHasMembership !== undefined && onlyWhereUserHasMembership !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>onlyWhereUserHasMembership, 'onlyWhereUserHasMembership');
        }
        if (nameContent !== undefined && nameContent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameContent, 'nameContent');
        }
        if (cvrContent !== undefined && cvrContent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>cvrContent, 'cvrContent');
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

        let localVarPath = `/api/v2/organizations`;
        return this.httpClient.request<Array<APIOrganizationResponseDTO>>('get', `${this.configuration.basePath}${localVarPath}`,
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

}
