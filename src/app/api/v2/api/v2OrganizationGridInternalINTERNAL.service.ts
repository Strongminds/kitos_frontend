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
import { APIOrganizationGridConfigurationRequestDTO } from '../model/aPIOrganizationGridConfigurationRequestDTO';
// @ts-ignore
import { APIOrganizationGridConfigurationResponseDTO } from '../model/aPIOrganizationGridConfigurationResponseDTO';
// @ts-ignore
import { APIOrganizationGridPermissionsResponseDTO } from '../model/aPIOrganizationGridPermissionsResponseDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

export interface DeleteSingleOrganizationGridInternalV2DeleteGridConfigurationRequestParams {
  organizationUuid: string;
  overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration';
}

export interface GetSingleOrganizationGridInternalV2GetGridConfigurationRequestParams {
  organizationUuid: string;
  overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration';
}

export interface GetSingleOrganizationGridInternalV2GetOrganizationGridPermissionsRequestParams {
  organizationUuid: string;
}

export interface PostSingleOrganizationGridInternalV2SaveGridConfigurationRequestParams {
  organizationUuid: string;
  overviewType: 'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration';
  config: APIOrganizationGridConfigurationRequestDTO;
}

@Injectable({
  providedIn: 'root',
})
export class APIV2OrganizationGridInternalINTERNALService {
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
  public deleteSingleOrganizationGridInternalV2DeleteGridConfiguration(
    requestParameters: DeleteSingleOrganizationGridInternalV2DeleteGridConfigurationRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<object>;
  public deleteSingleOrganizationGridInternalV2DeleteGridConfiguration(
    requestParameters: DeleteSingleOrganizationGridInternalV2DeleteGridConfigurationRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<HttpResponse<object>>;
  public deleteSingleOrganizationGridInternalV2DeleteGridConfiguration(
    requestParameters: DeleteSingleOrganizationGridInternalV2DeleteGridConfigurationRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<HttpEvent<object>>;
  public deleteSingleOrganizationGridInternalV2DeleteGridConfiguration(
    requestParameters: DeleteSingleOrganizationGridInternalV2DeleteGridConfigurationRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling deleteSingleOrganizationGridInternalV2DeleteGridConfiguration.',
      );
    }
    const overviewType = requestParameters.overviewType;
    if (overviewType === null || overviewType === undefined) {
      throw new Error(
        'Required parameter overviewType was null or undefined when calling deleteSingleOrganizationGridInternalV2DeleteGridConfiguration.',
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['*/*'];
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/grid/${this.configuration.encodeParam({ name: 'overviewType', value: overviewType, in: 'path', style: 'simple', explode: false, dataType: "'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration'", dataFormat: undefined })}/delete`;
    return this.httpClient.request<object>('delete', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
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
  public getSingleOrganizationGridInternalV2GetGridConfiguration(
    requestParameters: GetSingleOrganizationGridInternalV2GetGridConfigurationRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<object>;
  public getSingleOrganizationGridInternalV2GetGridConfiguration(
    requestParameters: GetSingleOrganizationGridInternalV2GetGridConfigurationRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<object>>;
  public getSingleOrganizationGridInternalV2GetGridConfiguration(
    requestParameters: GetSingleOrganizationGridInternalV2GetGridConfigurationRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<object>>;
  public getSingleOrganizationGridInternalV2GetGridConfiguration(
    requestParameters: GetSingleOrganizationGridInternalV2GetGridConfigurationRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleOrganizationGridInternalV2GetGridConfiguration.',
      );
    }
    const overviewType = requestParameters.overviewType;
    if (overviewType === null || overviewType === undefined) {
      throw new Error(
        'Required parameter overviewType was null or undefined when calling getSingleOrganizationGridInternalV2GetGridConfiguration.',
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/grid/${this.configuration.encodeParam({ name: 'overviewType', value: overviewType, in: 'path', style: 'simple', explode: false, dataType: "'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration'", dataFormat: undefined })}/get`;
    return this.httpClient.request<object>('get', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
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
  public getSingleOrganizationGridInternalV2GetOrganizationGridPermissions(
    requestParameters: GetSingleOrganizationGridInternalV2GetOrganizationGridPermissionsRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<APIOrganizationGridPermissionsResponseDTO>;
  public getSingleOrganizationGridInternalV2GetOrganizationGridPermissions(
    requestParameters: GetSingleOrganizationGridInternalV2GetOrganizationGridPermissionsRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<APIOrganizationGridPermissionsResponseDTO>>;
  public getSingleOrganizationGridInternalV2GetOrganizationGridPermissions(
    requestParameters: GetSingleOrganizationGridInternalV2GetOrganizationGridPermissionsRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<APIOrganizationGridPermissionsResponseDTO>>;
  public getSingleOrganizationGridInternalV2GetOrganizationGridPermissions(
    requestParameters: GetSingleOrganizationGridInternalV2GetOrganizationGridPermissionsRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleOrganizationGridInternalV2GetOrganizationGridPermissions.',
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/grid/permissions`;
    return this.httpClient.request<APIOrganizationGridPermissionsResponseDTO>(
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

  /**
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public postSingleOrganizationGridInternalV2SaveGridConfiguration(
    requestParameters: PostSingleOrganizationGridInternalV2SaveGridConfigurationRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<APIOrganizationGridConfigurationResponseDTO>;
  public postSingleOrganizationGridInternalV2SaveGridConfiguration(
    requestParameters: PostSingleOrganizationGridInternalV2SaveGridConfigurationRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<APIOrganizationGridConfigurationResponseDTO>>;
  public postSingleOrganizationGridInternalV2SaveGridConfiguration(
    requestParameters: PostSingleOrganizationGridInternalV2SaveGridConfigurationRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<APIOrganizationGridConfigurationResponseDTO>>;
  public postSingleOrganizationGridInternalV2SaveGridConfiguration(
    requestParameters: PostSingleOrganizationGridInternalV2SaveGridConfigurationRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleOrganizationGridInternalV2SaveGridConfiguration.',
      );
    }
    const overviewType = requestParameters.overviewType;
    if (overviewType === null || overviewType === undefined) {
      throw new Error(
        'Required parameter overviewType was null or undefined when calling postSingleOrganizationGridInternalV2SaveGridConfiguration.',
      );
    }
    const config = requestParameters.config;
    if (config === null || config === undefined) {
      throw new Error(
        'Required parameter config was null or undefined when calling postSingleOrganizationGridInternalV2SaveGridConfiguration.',
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

    let localVarPath = `/api/v2/internal/organizations/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/grid/${this.configuration.encodeParam({ name: 'overviewType', value: overviewType, in: 'path', style: 'simple', explode: false, dataType: "'ItSystemUsage' | 'ItContract' | 'DataProcessingRegistration'", dataFormat: undefined })}/save`;
    return this.httpClient.request<APIOrganizationGridConfigurationResponseDTO>(
      'post',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        body: config,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}
