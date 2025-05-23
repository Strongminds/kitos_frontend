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

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec,
  HttpContext,
} from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

// @ts-ignore
import { APIItSystemDTOIEnumerableApiReturnDTO } from '../model/aPIItSystemDTOIEnumerableApiReturnDTO';
// @ts-ignore
import { APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO } from '../model/aPINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO';
// @ts-ignore
import { APIUsingOrganizationDTOIEnumerableApiReturnDTO } from '../model/aPIUsingOrganizationDTOIEnumerableApiReturnDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

export interface GetSingleItSystemGetHierarchyRequestParams {
  id: number;
  hierarchy: boolean;
}

export interface GetSingleItSystemGetPublicRequestParams {
  organizationId: number;
  /** Mulighed for søgning på navneindhold */
  q: string;
  /** Størrelse på resultatsættet.  Standardværdien er \&#39;100\&#39; */
  take?: number;
  /** Antal der skal ignoreres inden resultatsættet dannes.  Standardværdien er \&#39;0\&#39; */
  skip?: number;
  /** Bestemmer hvilket felt der sorteres på inden resultatsættet dannes.  Standardværdien er \&#39;Id\&#39; */
  orderBy?: string;
  /** Bestemmer om sorteringen skal være faldende  Standardværdien er \&#39;false\&#39; */
  descending?: boolean;
}

export interface GetSingleItSystemGetUsingOrganizationsRequestParams {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class APIV1ItSystemINTERNALService {
  protected basePath = 'https://kitos-dev.strongminds.dk';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string | string[],
    @Optional() configuration: Configuration,
  ) {
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
    if (typeof value === 'object' && value instanceof Date === false) {
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

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach((elem) => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k)),
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSingleItSystemGetHierarchy(
    requestParameters: GetSingleItSystemGetHierarchyRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<APIItSystemDTOIEnumerableApiReturnDTO>;
  public getSingleItSystemGetHierarchy(
    requestParameters: GetSingleItSystemGetHierarchyRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<HttpResponse<APIItSystemDTOIEnumerableApiReturnDTO>>;
  public getSingleItSystemGetHierarchy(
    requestParameters: GetSingleItSystemGetHierarchyRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<HttpEvent<APIItSystemDTOIEnumerableApiReturnDTO>>;
  public getSingleItSystemGetHierarchy(
    requestParameters: GetSingleItSystemGetHierarchyRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<any> {
    const id = requestParameters.id;
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getSingleItSystemGetHierarchy.');
    }
    const hierarchy = requestParameters.hierarchy;
    if (hierarchy === null || hierarchy === undefined) {
      throw new Error('Required parameter hierarchy was null or undefined when calling getSingleItSystemGetHierarchy.');
    }

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (hierarchy !== undefined && hierarchy !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>hierarchy, 'hierarchy');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'text/json'];
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

    let localVarPath = `/api/ItSystem/${this.configuration.encodeParam({ name: 'id', value: id, in: 'path', style: 'simple', explode: false, dataType: 'number', dataFormat: 'int32' })}`;
    return this.httpClient.request<APIItSystemDTOIEnumerableApiReturnDTO>(
      'get',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        params: localVarQueryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Henter alle IT-Systemer i organisationen samt offentlige IT Systemer fra andre organisationer
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSingleItSystemGetPublic(
    requestParameters: GetSingleItSystemGetPublicRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>;
  public getSingleItSystemGetPublic(
    requestParameters: GetSingleItSystemGetPublicRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<HttpResponse<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>>;
  public getSingleItSystemGetPublic(
    requestParameters: GetSingleItSystemGetPublicRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<HttpEvent<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>>;
  public getSingleItSystemGetPublic(
    requestParameters: GetSingleItSystemGetPublicRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationId = requestParameters.organizationId;
    if (organizationId === null || organizationId === undefined) {
      throw new Error(
        'Required parameter organizationId was null or undefined when calling getSingleItSystemGetPublic.',
      );
    }
    const q = requestParameters.q;
    if (q === null || q === undefined) {
      throw new Error('Required parameter q was null or undefined when calling getSingleItSystemGetPublic.');
    }
    const take = requestParameters.take;
    const skip = requestParameters.skip;
    const orderBy = requestParameters.orderBy;
    const descending = requestParameters.descending;

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (organizationId !== undefined && organizationId !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>organizationId, 'organizationId');
    }
    if (q !== undefined && q !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>q, 'q');
    }
    if (take !== undefined && take !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>take, 'take');
    }
    if (skip !== undefined && skip !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>skip, 'skip');
    }
    if (orderBy !== undefined && orderBy !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>orderBy, 'orderBy');
    }
    if (descending !== undefined && descending !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>descending, 'descending');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'text/json'];
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

    let localVarPath = `/api/ItSystem`;
    return this.httpClient.request<APINamedEntityWithEnabledStatusDTOIEnumerableApiReturnDTO>(
      'get',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        params: localVarQueryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSingleItSystemGetUsingOrganizations(
    requestParameters: GetSingleItSystemGetUsingOrganizationsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<APIUsingOrganizationDTOIEnumerableApiReturnDTO>;
  public getSingleItSystemGetUsingOrganizations(
    requestParameters: GetSingleItSystemGetUsingOrganizationsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<HttpResponse<APIUsingOrganizationDTOIEnumerableApiReturnDTO>>;
  public getSingleItSystemGetUsingOrganizations(
    requestParameters: GetSingleItSystemGetUsingOrganizationsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<HttpEvent<APIUsingOrganizationDTOIEnumerableApiReturnDTO>>;
  public getSingleItSystemGetUsingOrganizations(
    requestParameters: GetSingleItSystemGetUsingOrganizationsRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' | 'text/json'; context?: HttpContext },
  ): Observable<any> {
    const id = requestParameters.id;
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling getSingleItSystemGetUsingOrganizations.',
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json', 'text/json'];
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

    let localVarPath = `/api/v1/ItSystem/${this.configuration.encodeParam({ name: 'id', value: id, in: 'path', style: 'simple', explode: false, dataType: 'number', dataFormat: 'int32' })}/usingOrganizations`;
    return this.httpClient.request<APIUsingOrganizationDTOIEnumerableApiReturnDTO>(
      'get',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}
