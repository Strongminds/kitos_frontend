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
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { APIAdviceUserRelationDTO } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface APIV1AdviceUserRelationINTERNALServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Sletter adviser med det specificerede id fra en genereisk advis
     * 
     * @param adviceId 
     */
    dELETEAdviceUserRelationDeleteByAdviceIdInt32AdviceId(adviceId: number, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Delete from base entity controller
     * 
     * @param id 
     * @param organizationId 
     */
    dELETEAdviceUserRelationDeleteInt32IdInt32OrganizationIdById(id: number, organizationId: number, extraHttpRequestParams?: any): Observable<object>;

    /**
     * 
     * 
     * @param take Størrelse på resultatsættet.  Standardværdien er \&#39;100\&#39;
     * @param skip Antal der skal ignoreres inden resultatsættet dannes.  Standardværdien er \&#39;0\&#39;
     * @param orderBy Bestemmer hvilket felt der sorteres på inden resultatsættet dannes.  Standardværdien er \&#39;Id\&#39;
     * @param descending Bestemmer om sorteringen skal være faldende  Standardværdien er \&#39;false\&#39;
     */
    gETAdviceUserRelationGetAllPagingModel1Paging(take?: number, skip?: number, orderBy?: string, descending?: boolean, extraHttpRequestParams?: any): Observable<object>;

    /**
     * 
     * 
     * @param id 
     */
    gETAdviceUserRelationGetSingleInt32IdById(id: number, extraHttpRequestParams?: any): Observable<object>;

    /**
     * 
     * 
     * @param id 
     * @param organizationId 
     * @param obj 
     */
    pATCHAdviceUserRelationPatchJObjectObjInt32IdInt32OrganizationIdById(id: number, organizationId: number, obj: object, extraHttpRequestParams?: any): Observable<object>;

    /**
     * 
     * 
     * @param organizationId 
     * @param dto 
     */
    pOSTAdviceUserRelationPostAdviceUserRelationDTODtoInt32OrganizationId(organizationId: number, dto: APIAdviceUserRelationDTO, extraHttpRequestParams?: any): Observable<object>;

    /**
     * Put from base entity controller
     * 
     * @param id 
     * @param organizationId 
     * @param obj 
     */
    pUTAdviceUserRelationPutJObjectObjInt32IdInt32OrganizationIdById(id: number, organizationId: number, obj: object, extraHttpRequestParams?: any): Observable<object>;

}
