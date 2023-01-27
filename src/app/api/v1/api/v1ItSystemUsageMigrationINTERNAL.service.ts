/**
 * OS2Kitos API - V1
 * <b><i>OBS: Dokumentation for V2 findes ved at skifte version på dokumentet til 2 øverst på siden</i></b><br/><br/><b>BEMÆRK: ADGANG TIL API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/>Denne dokumentation udstiller Kitos API\'et til brug for applikationsudvikling.<br/><br/>Den første udgave af API\'et (V1) blev udviklet til understøttelse af projektets brugerflade og vil med tiden blive erstattet af et selvstændigt API (V2) udviklet til brug for integration med udefrakommende systemer. Du vil i en periode kunne anvende både V1 og V2. Bemærk dog, at overflødiggjorte V1 endpoints vil blive udfaset efter en rum tid. KITOS sekretariatet vil i god tid forinden varsle udfasning af overflødige endpoints.<br/><br/>Særligt for V1 gælder der følgende:<br/>ObjectOwnerId, LastChanged og LastChangedByUserId bliver som udgangspunkt sat af systemet automatisk.<br/>Der er udelukkende adgang til læseoperationer i V1. Ved behov for adgang til funktionalitet, der ændrer i data, kontakt da venligst KITOS sekretariatet.<br/><br/>Generelt er anvendelsen beskrevet på projektets <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/658145384/S+dan+kommer+du+igang\'>Confluence side</a>.<br/><br/><b>BEMÆRK: ADGANG TIL API V1 LUKKES. <a href=\'https://os2web.atlassian.net/wiki/spaces/KITOS/pages/657293331/API+Design+V1#Varsling-om-lukning\'>LÆS MERE HER</a>.</b><br/><br/><b>KENDTE FEJL OG BEGRÆNSNINGER PÅ DENNE HJÆLPESIDE SAMT WORKAROUND</b><br/>Felter der består af lister af enum værdier vises ikke rigtigt i denne UI. Konkret vises de mulige valg ikke, men i stedet vises \'Array[string]\'. For et retvisende billede af dokumentationen anbefales derfor følgende workaround:<br/><br/>- JSON downloades via \'docs linket i toppen\'<br/>- Indholdet indsættes i anden editor f.eks. <a href=\'https://editor.swagger.io\' target=\'_blank\'>Swagger.io</a><br/><br/><b>BEMÆRK</b>: Funktionen \'Try it out\' virker p.t. ikke i den eksterne editor.
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
import { APIItSystemUsageMigrationAccessDTOApiReturnDTO } from '../model/aPIItSystemUsageMigrationAccessDTOApiReturnDTO';
// @ts-ignore
import { APIItSystemUsageMigrationDTOApiReturnDTO } from '../model/aPIItSystemUsageMigrationDTOApiReturnDTO';
// @ts-ignore
import { APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO } from '../model/aPINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class APIV1ItSystemUsageMigrationINTERNALService {

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
     * @param id 
     * @param getEntityAccessRights 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRightsById(id: number, getEntityAccessRights: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public gETItSystemUsageMigrationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRightsById(id: number, getEntityAccessRights: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETItSystemUsageMigrationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRightsById(id: number, getEntityAccessRights: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETItSystemUsageMigrationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRightsById(id: number, getEntityAccessRights: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling gETItSystemUsageMigrationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRightsById.');
        }
        if (getEntityAccessRights === null || getEntityAccessRights === undefined) {
            throw new Error('Required parameter getEntityAccessRights was null or undefined when calling gETItSystemUsageMigrationGetAccessRightsForEntityInt32IdNullable1GetEntityAccessRightsById.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (getEntityAccessRights !== undefined && getEntityAccessRights !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getEntityAccessRights, 'getEntityAccessRights');
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

        let localVarPath = `/api/ItSystemUsageMigration/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}`;
        return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param getEntitiesAccessRights 
     * @param organizationId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public gETItSystemUsageMigrationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETItSystemUsageMigrationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETItSystemUsageMigrationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights(getEntitiesAccessRights: boolean, organizationId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (getEntitiesAccessRights === null || getEntitiesAccessRights === undefined) {
            throw new Error('Required parameter getEntitiesAccessRights was null or undefined when calling gETItSystemUsageMigrationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights.');
        }
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling gETItSystemUsageMigrationGetAccessRightsInt32OrganizationIdNullable1GetEntitiesAccessRights.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (getEntitiesAccessRights !== undefined && getEntitiesAccessRights !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getEntitiesAccessRights, 'getEntitiesAccessRights');
        }
        if (organizationId !== undefined && organizationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationId, 'organizationId');
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

        let localVarPath = `/api/ItSystemUsageMigration`;
        return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationGetAccessibilityLevel(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<APIItSystemUsageMigrationAccessDTOApiReturnDTO>;
    public gETItSystemUsageMigrationGetAccessibilityLevel(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<APIItSystemUsageMigrationAccessDTOApiReturnDTO>>;
    public gETItSystemUsageMigrationGetAccessibilityLevel(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<APIItSystemUsageMigrationAccessDTOApiReturnDTO>>;
    public gETItSystemUsageMigrationGetAccessibilityLevel(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {

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

        let localVarPath = `/api/v1/ItSystemUsageMigration/Accessibility`;
        return this.httpClient.request<APIItSystemUsageMigrationAccessDTOApiReturnDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param usageId 
     * @param toSystemId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationGetMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<APIItSystemUsageMigrationDTOApiReturnDTO>;
    public gETItSystemUsageMigrationGetMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<APIItSystemUsageMigrationDTOApiReturnDTO>>;
    public gETItSystemUsageMigrationGetMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<APIItSystemUsageMigrationDTOApiReturnDTO>>;
    public gETItSystemUsageMigrationGetMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (usageId === null || usageId === undefined) {
            throw new Error('Required parameter usageId was null or undefined when calling gETItSystemUsageMigrationGetMigrationInt32ToSystemIdInt32UsageId.');
        }
        if (toSystemId === null || toSystemId === undefined) {
            throw new Error('Required parameter toSystemId was null or undefined when calling gETItSystemUsageMigrationGetMigrationInt32ToSystemIdInt32UsageId.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (usageId !== undefined && usageId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>usageId, 'usageId');
        }
        if (toSystemId !== undefined && toSystemId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>toSystemId, 'toSystemId');
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

        let localVarPath = `/api/v1/ItSystemUsageMigration`;
        return this.httpClient.request<APIItSystemUsageMigrationDTOApiReturnDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param organizationId 
     * @param nameContent 
     * @param numberOfItSystems 
     * @param getPublicFromOtherOrganizations 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent(organizationId: number, nameContent: string, numberOfItSystems: number, getPublicFromOtherOrganizations: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>;
    public gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent(organizationId: number, nameContent: string, numberOfItSystems: number, getPublicFromOtherOrganizations: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>>;
    public gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent(organizationId: number, nameContent: string, numberOfItSystems: number, getPublicFromOtherOrganizations: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>>;
    public gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent(organizationId: number, nameContent: string, numberOfItSystems: number, getPublicFromOtherOrganizations: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (organizationId === null || organizationId === undefined) {
            throw new Error('Required parameter organizationId was null or undefined when calling gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent.');
        }
        if (nameContent === null || nameContent === undefined) {
            throw new Error('Required parameter nameContent was null or undefined when calling gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent.');
        }
        if (numberOfItSystems === null || numberOfItSystems === undefined) {
            throw new Error('Required parameter numberOfItSystems was null or undefined when calling gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent.');
        }
        if (getPublicFromOtherOrganizations === null || getPublicFromOtherOrganizations === undefined) {
            throw new Error('Required parameter getPublicFromOtherOrganizations was null or undefined when calling gETItSystemUsageMigrationGetUnusedItSystemsBySearchAndOrganizationBooleanGetPublicFromOtherOrganizationsInt32NumberOfItSystemsInt32OrganizationIdStringNameContent.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (organizationId !== undefined && organizationId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>organizationId, 'organizationId');
        }
        if (nameContent !== undefined && nameContent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nameContent, 'nameContent');
        }
        if (numberOfItSystems !== undefined && numberOfItSystems !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>numberOfItSystems, 'numberOfItSystems');
        }
        if (getPublicFromOtherOrganizations !== undefined && getPublicFromOtherOrganizations !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getPublicFromOtherOrganizations, 'getPublicFromOtherOrganizations');
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

        let localVarPath = `/api/v1/ItSystemUsageMigration/UnusedItSystems`;
        return this.httpClient.request<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * @param usageId 
     * @param toSystemId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTItSystemUsageMigrationExecuteMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public pOSTItSystemUsageMigrationExecuteMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pOSTItSystemUsageMigrationExecuteMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pOSTItSystemUsageMigrationExecuteMigrationInt32ToSystemIdInt32UsageId(usageId: number, toSystemId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (usageId === null || usageId === undefined) {
            throw new Error('Required parameter usageId was null or undefined when calling pOSTItSystemUsageMigrationExecuteMigrationInt32ToSystemIdInt32UsageId.');
        }
        if (toSystemId === null || toSystemId === undefined) {
            throw new Error('Required parameter toSystemId was null or undefined when calling pOSTItSystemUsageMigrationExecuteMigrationInt32ToSystemIdInt32UsageId.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (usageId !== undefined && usageId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>usageId, 'usageId');
        }
        if (toSystemId !== undefined && toSystemId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>toSystemId, 'toSystemId');
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

        let localVarPath = `/api/v1/ItSystemUsageMigration`;
        return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`,
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
     * @param getEntityListAccessRights 
     * @param ids 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pOSTItSystemUsageMigrationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public pOSTItSystemUsageMigrationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pOSTItSystemUsageMigrationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pOSTItSystemUsageMigrationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights(getEntityListAccessRights: boolean, ids: Array<number>, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        if (getEntityListAccessRights === null || getEntityListAccessRights === undefined) {
            throw new Error('Required parameter getEntityListAccessRights was null or undefined when calling pOSTItSystemUsageMigrationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights.');
        }
        if (ids === null || ids === undefined) {
            throw new Error('Required parameter ids was null or undefined when calling pOSTItSystemUsageMigrationPostSearchAccessRightsForEntityListInt32IdsNullable1GetEntityListAccessRights.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (getEntityListAccessRights !== undefined && getEntityListAccessRights !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>getEntityListAccessRights, 'getEntityListAccessRights');
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


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/x-www-form-urlencoded'
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

        let localVarPath = `/api/ItSystemUsageMigration`;
        return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: ids,
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
