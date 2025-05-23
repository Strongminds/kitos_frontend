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

export interface APIGdprReportResponseDTO {
  systemUuid?: string;
  systemName?: string;
  noData?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  legalData?: boolean;
  businessCritical?: APIGdprReportResponseDTO.BusinessCriticalEnum;
  dataProcessingAgreementConcluded?: boolean;
  linkToDirectory?: boolean;
  sensitiveDataTypes?: Array<string>;
  riskAssessment?: APIGdprReportResponseDTO.RiskAssessmentEnum;
  riskAssessmentDate?: string;
  plannedRiskAssessmentDate?: string;
  preRiskAssessment?: APIGdprReportResponseDTO.PreRiskAssessmentEnum;
  riskAssessmentNotes?: string;
  personalDataCpr?: boolean;
  personalDataSocialProblems?: boolean;
  personalDataSocialOtherPrivateMatters?: boolean;
  dpia?: APIGdprReportResponseDTO.DpiaEnum;
  dpiaDate?: string;
  hostedAt?: APIGdprReportResponseDTO.HostedAtEnum;
  technicalSupervisionDocumentationUrlName?: string;
  technicalSupervisionDocumentationUrl?: string;
  userSupervision?: APIGdprReportResponseDTO.UserSupervisionEnum;
  userSupervisionDocumentationUrl?: string;
  userSupervisionDocumentationUrlName?: string;
  nextDataRetentionEvaluationDate?: string;
  insecureCountriesSubjectToDataTransfer?: Array<string>;
}
export namespace APIGdprReportResponseDTO {
  export type BusinessCriticalEnum = 'No' | 'Yes' | 'DontKnow' | 'Undecided';
  export const BusinessCriticalEnum = {
    No: 'No' as BusinessCriticalEnum,
    Yes: 'Yes' as BusinessCriticalEnum,
    DontKnow: 'DontKnow' as BusinessCriticalEnum,
    Undecided: 'Undecided' as BusinessCriticalEnum,
  };
  export type RiskAssessmentEnum = 'No' | 'Yes' | 'DontKnow' | 'Undecided';
  export const RiskAssessmentEnum = {
    No: 'No' as RiskAssessmentEnum,
    Yes: 'Yes' as RiskAssessmentEnum,
    DontKnow: 'DontKnow' as RiskAssessmentEnum,
    Undecided: 'Undecided' as RiskAssessmentEnum,
  };
  export type PreRiskAssessmentEnum = 'Low' | 'Medium' | 'High' | 'Undecided';
  export const PreRiskAssessmentEnum = {
    Low: 'Low' as PreRiskAssessmentEnum,
    Medium: 'Medium' as PreRiskAssessmentEnum,
    High: 'High' as PreRiskAssessmentEnum,
    Undecided: 'Undecided' as PreRiskAssessmentEnum,
  };
  export type DpiaEnum = 'No' | 'Yes' | 'DontKnow' | 'Undecided';
  export const DpiaEnum = {
    No: 'No' as DpiaEnum,
    Yes: 'Yes' as DpiaEnum,
    DontKnow: 'DontKnow' as DpiaEnum,
    Undecided: 'Undecided' as DpiaEnum,
  };
  export type HostedAtEnum = 'Undecided' | 'OnPremise' | 'External' | 'Hybrid';
  export const HostedAtEnum = {
    Undecided: 'Undecided' as HostedAtEnum,
    OnPremise: 'OnPremise' as HostedAtEnum,
    External: 'External' as HostedAtEnum,
    Hybrid: 'Hybrid' as HostedAtEnum,
  };
  export type UserSupervisionEnum = 'No' | 'Yes' | 'DontKnow' | 'Undecided';
  export const UserSupervisionEnum = {
    No: 'No' as UserSupervisionEnum,
    Yes: 'Yes' as UserSupervisionEnum,
    DontKnow: 'DontKnow' as UserSupervisionEnum,
    Undecided: 'Undecided' as UserSupervisionEnum,
  };
}
