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

import {
  HttpClient,
  HttpContext,
  HttpEvent,
  HttpHeaders,
  HttpParameterCodec,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpParameterCodec } from '../encoder';

// @ts-ignore
import { APICreateUserRequestDTO } from '../model/aPICreateUserRequestDTO';
// @ts-ignore
import { APIUserCollectionPermissionsResponseDTO } from '../model/aPIUserCollectionPermissionsResponseDTO';
// @ts-ignore

// @ts-ignore
import { Configuration } from '../configuration';
import { BASE_PATH } from '../variables';

export interface GetSingleUsersInternalV2GetCollectionPermissionsRequestParams {
  organizationUuid: string;
}

export interface PostSingleUsersInternalV2CreateUnitRequestParams {
  organizationUuid: string;
  parameters: APICreateUserRequestDTO;
}

export interface PostSingleUsersInternalV2SendNotificationRequestParams {
  userUuid: string;
  organizationUuid: string;
}

@Injectable({
  providedIn: 'root',
})
export class APIV2UsersInternalINTERNALService {
  protected basePath = 'https://kitos-dev.strongminds.dk';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string | string[],
    @Optional() configuration: Configuration
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
          (k) => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k))
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
  public getSingleUsersInternalV2GetCollectionPermissions(
    requestParameters: GetSingleUsersInternalV2GetCollectionPermissionsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<APIUserCollectionPermissionsResponseDTO>;
  public getSingleUsersInternalV2GetCollectionPermissions(
    requestParameters: GetSingleUsersInternalV2GetCollectionPermissionsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<APIUserCollectionPermissionsResponseDTO>>;
  public getSingleUsersInternalV2GetCollectionPermissions(
    requestParameters: GetSingleUsersInternalV2GetCollectionPermissionsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<APIUserCollectionPermissionsResponseDTO>>;
  public getSingleUsersInternalV2GetCollectionPermissions(
    requestParameters: GetSingleUsersInternalV2GetCollectionPermissionsRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleUsersInternalV2GetCollectionPermissions.'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
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

    let localVarPath = `/api/v2/internal/organization/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/users/permissions`;
    return this.httpClient.request<APIUserCollectionPermissionsResponseDTO>(
      'get',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postSingleUsersInternalV2CreateUnit(
    requestParameters: PostSingleUsersInternalV2CreateUnitRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<object>;
  public postSingleUsersInternalV2CreateUnit(
    requestParameters: PostSingleUsersInternalV2CreateUnitRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<object>>;
  public postSingleUsersInternalV2CreateUnit(
    requestParameters: PostSingleUsersInternalV2CreateUnitRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<object>>;
  public postSingleUsersInternalV2CreateUnit(
    requestParameters: PostSingleUsersInternalV2CreateUnitRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleUsersInternalV2CreateUnit.'
      );
    }
    const parameters = requestParameters.parameters;
    if (parameters === null || parameters === undefined) {
      throw new Error(
        'Required parameter parameters was null or undefined when calling postSingleUsersInternalV2CreateUnit.'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
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
    const consumes: string[] = ['application/json'];
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

    let localVarPath = `/api/v2/internal/organization/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/users/create`;
    return this.httpClient.request<object>('post', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      body: parameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postSingleUsersInternalV2SendNotification(
    requestParameters: PostSingleUsersInternalV2SendNotificationRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any>;
  public postSingleUsersInternalV2SendNotification(
    requestParameters: PostSingleUsersInternalV2SendNotificationRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpResponse<any>>;
  public postSingleUsersInternalV2SendNotification(
    requestParameters: PostSingleUsersInternalV2SendNotificationRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<HttpEvent<any>>;
  public postSingleUsersInternalV2SendNotification(
    requestParameters: PostSingleUsersInternalV2SendNotificationRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: undefined; context?: HttpContext }
  ): Observable<any> {
    const userUuid = requestParameters.userUuid;
    if (userUuid === null || userUuid === undefined) {
      throw new Error(
        'Required parameter userUuid was null or undefined when calling postSingleUsersInternalV2SendNotification.'
      );
    }
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleUsersInternalV2SendNotification.'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = [];
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

    let localVarPath = `/api/v2/internal/organization/${this.configuration.encodeParam({
      name: 'organizationUuid',
      value: organizationUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/users/${this.configuration.encodeParam({
      name: 'userUuid',
      value: userUuid,
      in: 'path',
      style: 'simple',
      explode: false,
      dataType: 'string',
      dataFormat: 'uuid',
    })}/notifications/send`;
    return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }
}
