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
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface GetSingleTaskRefGetChildrenRequestParams {
    id: number;
    children: boolean;
    /** Størrelse på resultatsættet.  Standardværdien er \&#39;100\&#39; */
    take?: number;
    /** Antal der skal ignoreres inden resultatsættet dannes.  Standardværdien er \&#39;0\&#39; */
    skip?: number;
    /** Bestemmer hvilket felt der sorteres på inden resultatsættet dannes.  Standardværdien er \&#39;Id\&#39; */
    orderBy?: string;
    /** Bestemmer om sorteringen skal være faldende  Standardværdien er \&#39;false\&#39; */
    descending?: boolean;
}

export interface GetSingleTaskRefGetRootsRequestParams {
    roots: boolean;
    /** Størrelse på resultatsættet.  Standardværdien er \&#39;100\&#39; */
    take?: number;
    /** Antal der skal ignoreres inden resultatsættet dannes.  Standardværdien er \&#39;0\&#39; */
    skip?: number;
    /** Bestemmer hvilket felt der sorteres på inden resultatsættet dannes.  Standardværdien er \&#39;Id\&#39; */
    orderBy?: string;
    /** Bestemmer om sorteringen skal være faldende  Standardværdien er \&#39;false\&#39; */
    descending?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class APIV1TaskRefINTERNALService {

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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleTaskRefGetChildren(requestParameters: GetSingleTaskRefGetChildrenRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public getSingleTaskRefGetChildren(requestParameters: GetSingleTaskRefGetChildrenRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public getSingleTaskRefGetChildren(requestParameters: GetSingleTaskRefGetChildrenRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public getSingleTaskRefGetChildren(requestParameters: GetSingleTaskRefGetChildrenRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getSingleTaskRefGetChildren.');
        }
        const children = requestParameters.children;
        if (children === null || children === undefined) {
            throw new Error('Required parameter children was null or undefined when calling getSingleTaskRefGetChildren.');
        }
        const take = requestParameters.take;
        const skip = requestParameters.skip;
        const orderBy = requestParameters.orderBy;
        const descending = requestParameters.descending;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (children !== undefined && children !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>children, 'children');
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

        let localVarPath = `/api/TaskRef/${this.configuration.encodeParam({name: "id", value: id, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: "int32"})}`;
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
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleTaskRefGetRoots(requestParameters: GetSingleTaskRefGetRootsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<object>;
    public getSingleTaskRefGetRoots(requestParameters: GetSingleTaskRefGetRootsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpResponse<object>>;
    public getSingleTaskRefGetRoots(requestParameters: GetSingleTaskRefGetRootsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<HttpEvent<object>>;
    public getSingleTaskRefGetRoots(requestParameters: GetSingleTaskRefGetRootsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json' | 'text/json', context?: HttpContext}): Observable<any> {
        const roots = requestParameters.roots;
        if (roots === null || roots === undefined) {
            throw new Error('Required parameter roots was null or undefined when calling getSingleTaskRefGetRoots.');
        }
        const take = requestParameters.take;
        const skip = requestParameters.skip;
        const orderBy = requestParameters.orderBy;
        const descending = requestParameters.descending;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (roots !== undefined && roots !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>roots, 'roots');
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

        let localVarPath = `/api/TaskRef`;
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

}
