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
import { APIItContract } from '../model/aPIItContract';
// @ts-ignore
import { APIItContractIQueryableODataResponse } from '../model/aPIItContractIQueryableODataResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class APIV1ODATAItContractsService {

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
     * Delete entity in EntitySet ItContracts
     * @param id key: Id
     * @param ifMatch If-Match header
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public dELETEItContractsDeleteInt32KeyById(id: number, ifMatch?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public dELETEItContractsDeleteInt32KeyById(id: number, ifMatch?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public dELETEItContractsDeleteInt32KeyById(id: number, ifMatch?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public dELETEItContractsDeleteInt32KeyById(id: number, ifMatch?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling dELETEItContractsDeleteInt32KeyById.');
        }

        let localVarHeaders = this.defaultHeaders;
        if (ifMatch !== undefined && ifMatch !== null) {
            localVarHeaders = localVarHeaders.set('If-Match', String(ifMatch));
        }

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

        let localVarPath = `/odata/ItContracts(${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})})`;
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
     * Hvis den autentificerede bruger er Global Admin, returneres alle kontrakter.  Ellers returneres de kontrakter som brugeren har rettigheder til at se.
     * @param $expand Expands related entities inline.
     * @param $filter Filters the results, based on a Boolean condition.
     * @param $select Selects which properties to include in the response.
     * @param $orderby Sorts the results.
     * @param $top Returns only the first n results.
     * @param $skip Skips the first n results.
     * @param $count Includes a count of the matching results in the response.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItContractsGet($expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<APIItContractIQueryableODataResponse>;
    public gETItContractsGet($expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<APIItContractIQueryableODataResponse>>;
    public gETItContractsGet($expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<APIItContractIQueryableODataResponse>>;
    public gETItContractsGet($expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if ($expand !== undefined && $expand !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$expand, '$expand');
        }
        if ($filter !== undefined && $filter !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$filter, '$filter');
        }
        if ($select !== undefined && $select !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$select, '$select');
        }
        if ($orderby !== undefined && $orderby !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$orderby, '$orderby');
        }
        if ($top !== undefined && $top !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$top, '$top');
        }
        if ($skip !== undefined && $skip !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$skip, '$skip');
        }
        if ($count !== undefined && $count !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$count, '$count');
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

        let localVarPath = `/odata/ItContracts`;
        return this.httpClient.request<APIItContractIQueryableODataResponse>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Returns the entity with the key from ItContracts
     * @param id key: Id
     * @param $expand Expands related entities inline.
     * @param $select Selects which properties to include in the response.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItContractsGetInt32KeyById(id: number, $expand?: string, $select?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public gETItContractsGetInt32KeyById(id: number, $expand?: string, $select?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public gETItContractsGetInt32KeyById(id: number, $expand?: string, $select?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public gETItContractsGetInt32KeyById(id: number, $expand?: string, $select?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling gETItContractsGetInt32KeyById.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if ($expand !== undefined && $expand !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$expand, '$expand');
        }
        if ($select !== undefined && $select !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$select, '$select');
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

        let localVarPath = `/odata/ItContracts(${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})})`;
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
     * Henter alle organisationens IT Kontrakter
     * @param key 
     * @param $expand Expands related entities inline.
     * @param $filter Filters the results, based on a Boolean condition.
     * @param $select Selects which properties to include in the response.
     * @param $orderby Sorts the results.
     * @param $top Returns only the first n results.
     * @param $skip Skips the first n results.
     * @param $count Includes a count of the matching results in the response.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public gETItContractsGetItContractsInt32KeyByKey(key: number, $expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<APIItContractIQueryableODataResponse>;
    public gETItContractsGetItContractsInt32KeyByKey(key: number, $expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpResponse<APIItContractIQueryableODataResponse>>;
    public gETItContractsGetItContractsInt32KeyByKey(key: number, $expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<HttpEvent<APIItContractIQueryableODataResponse>>;
    public gETItContractsGetItContractsInt32KeyByKey(key: number, $expand?: string, $filter?: string, $select?: string, $orderby?: string, $top?: number, $skip?: number, $count?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*', context?: HttpContext}): Observable<any> {
        if (key === null || key === undefined) {
            throw new Error('Required parameter key was null or undefined when calling gETItContractsGetItContractsInt32KeyByKey.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if ($expand !== undefined && $expand !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$expand, '$expand');
        }
        if ($filter !== undefined && $filter !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$filter, '$filter');
        }
        if ($select !== undefined && $select !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$select, '$select');
        }
        if ($orderby !== undefined && $orderby !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$orderby, '$orderby');
        }
        if ($top !== undefined && $top !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$top, '$top');
        }
        if ($skip !== undefined && $skip !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$skip, '$skip');
        }
        if ($count !== undefined && $count !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>$count, '$count');
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

        let localVarPath = `/odata/Organizations(${this.configuration.encodeParam({name: "key", value: key, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})})/ItContracts`;
        return this.httpClient.request<APIItContractIQueryableODataResponse>('get', `${this.configuration.basePath}${localVarPath}`,
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
     * Update entity in EntitySet ItContracts
     * @param id key: Id
     * @param itContract The entity to patch
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public pATCHItContractsPatchDelta1DeltaInt32KeyById(id: number, itContract: APIItContract, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<object>;
    public pATCHItContractsPatchDelta1DeltaInt32KeyById(id: number, itContract: APIItContract, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public pATCHItContractsPatchDelta1DeltaInt32KeyById(id: number, itContract: APIItContract, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public pATCHItContractsPatchDelta1DeltaInt32KeyById(id: number, itContract: APIItContract, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling pATCHItContractsPatchDelta1DeltaInt32KeyById.');
        }
        if (itContract === null || itContract === undefined) {
            throw new Error('Required parameter itContract was null or undefined when calling pATCHItContractsPatchDelta1DeltaInt32KeyById.');
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

        let localVarPath = `/odata/ItContracts(${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})})`;
        return this.httpClient.request<object>('patch', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: itContract,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
