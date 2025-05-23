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
import { APILocalOptionCreateRequestDTO } from '../model/aPILocalOptionCreateRequestDTO';
// @ts-ignore
import { APILocalRegularOptionResponseDTO } from '../model/aPILocalRegularOptionResponseDTO';
// @ts-ignore
import { APILocalRegularOptionUpdateRequestDTO } from '../model/aPILocalRegularOptionUpdateRequestDTO';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

export interface DeleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelTypeRequestParams {
  organizationUuid: string;
  optionUuid: string;
}

export interface GetManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypesRequestParams {
  organizationUuid: string;
}

export interface GetSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionIdRequestParams {
  organizationUuid: string;
  optionUuid: string;
}

export interface PatchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelTypeRequestParams {
  organizationUuid: string;
  optionUuid: string;
  dto: APILocalRegularOptionUpdateRequestDTO;
}

export interface PostSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelTypeRequestParams {
  organizationUuid: string;
  dto: APILocalOptionCreateRequestDTO;
}

@Injectable({
  providedIn: 'root',
})
export class APIV2ItContractLocalPaymentModelTypesInternalINTERNALService {
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
  public deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType(
    requestParameters: DeleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelTypeRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<APILocalRegularOptionResponseDTO>;
  public deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType(
    requestParameters: DeleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelTypeRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
  public deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType(
    requestParameters: DeleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelTypeRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
  public deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType(
    requestParameters: DeleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelTypeRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: '*/*'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType.',
      );
    }
    const optionUuid = requestParameters.optionUuid;
    if (optionUuid === null || optionUuid === undefined) {
      throw new Error(
        'Required parameter optionUuid was null or undefined when calling deleteSingleItContractLocalPaymentModelTypesInternalV2DeleteLocalPaymentModelType.',
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

    let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/local-option-types/payment-model-types/${this.configuration.encodeParam({ name: 'optionUuid', value: optionUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}`;
    return this.httpClient.request<APILocalRegularOptionResponseDTO>(
      'delete',
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
  public getManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes(
    requestParameters: GetManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypesRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<Array<APILocalRegularOptionResponseDTO>>;
  public getManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes(
    requestParameters: GetManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypesRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<Array<APILocalRegularOptionResponseDTO>>>;
  public getManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes(
    requestParameters: GetManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypesRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<Array<APILocalRegularOptionResponseDTO>>>;
  public getManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes(
    requestParameters: GetManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypesRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getManyItContractLocalPaymentModelTypesInternalV2GetLocalPaymentModelTypes.',
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

    let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/local-option-types/payment-model-types`;
    return this.httpClient.request<Array<APILocalRegularOptionResponseDTO>>(
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
  public getSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionId(
    requestParameters: GetSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionIdRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<APILocalRegularOptionResponseDTO>;
  public getSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionId(
    requestParameters: GetSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionIdRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
  public getSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionId(
    requestParameters: GetSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionIdRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
  public getSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionId(
    requestParameters: GetSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionIdRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling getSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionId.',
      );
    }
    const optionUuid = requestParameters.optionUuid;
    if (optionUuid === null || optionUuid === undefined) {
      throw new Error(
        'Required parameter optionUuid was null or undefined when calling getSingleItContractLocalPaymentModelTypesInternalV2GetLocalTPaymentModelTypeByOptionId.',
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

    let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/local-option-types/payment-model-types/${this.configuration.encodeParam({ name: 'optionUuid', value: optionUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}`;
    return this.httpClient.request<APILocalRegularOptionResponseDTO>(
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
  public patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType(
    requestParameters: PatchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelTypeRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<APILocalRegularOptionResponseDTO>;
  public patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType(
    requestParameters: PatchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelTypeRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
  public patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType(
    requestParameters: PatchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelTypeRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
  public patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType(
    requestParameters: PatchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelTypeRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType.',
      );
    }
    const optionUuid = requestParameters.optionUuid;
    if (optionUuid === null || optionUuid === undefined) {
      throw new Error(
        'Required parameter optionUuid was null or undefined when calling patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType.',
      );
    }
    const dto = requestParameters.dto;
    if (dto === null || dto === undefined) {
      throw new Error(
        'Required parameter dto was null or undefined when calling patchSingleItContractLocalPaymentModelTypesInternalV2PatchLocalPaymentModelType.',
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
    const consumes: string[] = ['application/merge-patch+json', 'application/json'];
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

    let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/local-option-types/payment-model-types/${this.configuration.encodeParam({ name: 'optionUuid', value: optionUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}`;
    return this.httpClient.request<APILocalRegularOptionResponseDTO>(
      'patch',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        body: dto,
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
  public postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType(
    requestParameters: PostSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelTypeRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<APILocalRegularOptionResponseDTO>;
  public postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType(
    requestParameters: PostSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelTypeRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpResponse<APILocalRegularOptionResponseDTO>>;
  public postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType(
    requestParameters: PostSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelTypeRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<HttpEvent<APILocalRegularOptionResponseDTO>>;
  public postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType(
    requestParameters: PostSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelTypeRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext },
  ): Observable<any> {
    const organizationUuid = requestParameters.organizationUuid;
    if (organizationUuid === null || organizationUuid === undefined) {
      throw new Error(
        'Required parameter organizationUuid was null or undefined when calling postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType.',
      );
    }
    const dto = requestParameters.dto;
    if (dto === null || dto === undefined) {
      throw new Error(
        'Required parameter dto was null or undefined when calling postSingleItContractLocalPaymentModelTypesInternalV2CreateLocalPaymentModelType.',
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

    let localVarPath = `/api/v2/internal/it-contracts/${this.configuration.encodeParam({ name: 'organizationUuid', value: organizationUuid, in: 'path', style: 'simple', explode: false, dataType: 'string', dataFormat: 'uuid' })}/local-option-types/payment-model-types`;
    return this.httpClient.request<APILocalRegularOptionResponseDTO>(
      'post',
      `${this.configuration.basePath}${localVarPath}`,
      {
        context: localVarHttpContext,
        body: dto,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}
