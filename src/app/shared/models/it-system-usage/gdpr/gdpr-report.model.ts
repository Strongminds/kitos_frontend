import { APIGdprReportResponseDTO } from 'src/app/api/v2';
import { mapToYesNoDontKnowEnum, YesNoDontKnowOptions } from '../../yes-no-dont-know.model';
import { HostedAt, mapHostedAt } from './hosted-at.model';
import { mapPreRiskAssessmentEnum, PreRiskAssessment } from './pre-risk-assessment.model';

export interface GdprReport {
  systemUuid: string;
  systemName?: string;
  noData?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  legalData?: boolean;
  businessCritical?: YesNoDontKnowOptions;
  dataProcessingAgreementConcluded?: boolean;
  linkToDirectory?: boolean;
  sensitiveDataTypes: string;
  riskAssessment?: YesNoDontKnowOptions;
  riskAssessmentDate?: string;
  plannedRiskAssessmentDate?: string;
  preRiskAssessment?: PreRiskAssessment;
  riskAssessmentNotes?: string;
  personalDataCpr?: boolean;
  personalDataSocialProblems?: boolean;
  personalDataSocialOtherPrivateMatters?: boolean;
  dpia?: YesNoDontKnowOptions;
  dpiaDate?: string;
  hostedAt?: HostedAt;
  technicalSupervisionDocumentationUrl?: string;
  technicalSupervisionDocumentationUrlName?: string;
  userSupervision?: YesNoDontKnowOptions;
  userSupervisionDocumentationUrl?: string;
  userSupervisionDocumentationUrlName?: string;
  nextDataRetentionEvaluationDate?: string;
}

export function adaptGdprReport(dto: APIGdprReportResponseDTO): GdprReport {
  if (!dto.systemUuid) throw new Error('GDPR Report is missing a systemUuid');
  return {
    systemUuid: dto.systemUuid,
    systemName: dto.systemName,
    noData: dto.noData,
    personalData: dto.personalData,
    sensitiveData: dto.sensitiveData,
    legalData: dto.legalData,
    businessCritical: mapToYesNoDontKnowEnum(dto.businessCritical),
    dataProcessingAgreementConcluded: dto.dataProcessingAgreementConcluded,
    linkToDirectory: dto.linkToDirectory,
    sensitiveDataTypes: dto.sensitiveDataTypes?.join(', ') ?? '',
    riskAssessment: mapToYesNoDontKnowEnum(dto.riskAssessment),
    riskAssessmentDate: dto.riskAssessmentDate,
    plannedRiskAssessmentDate: dto.plannedRiskAssessmentDate,
    preRiskAssessment: mapPreRiskAssessmentEnum(dto.preRiskAssessment),
    riskAssessmentNotes: TEMP(dto).riskAssessmentNotes,
    personalDataCpr: dto.personalDataCpr,
    personalDataSocialProblems: dto.personalDataSocialProblems,
    personalDataSocialOtherPrivateMatters: dto.personalDataSocialOtherPrivateMatters,
    dpia: mapToYesNoDontKnowEnum(dto.dpia),
    dpiaDate: TEMP(dto).dpiaDate,
    hostedAt: mapHostedAt(dto.hostedAt),
    technicalSupervisionDocumentationUrl: TEMP(dto).technicalSupervisionDocumentationUrl,
    technicalSupervisionDocumentationUrlName: TEMP(dto).technicalSupervisionDocumentationUrlName,
    userSupervision: mapToYesNoDontKnowEnum(TEMP(dto).userSupervision),
    userSupervisionDocumentationUrl: TEMP(dto).userSupervisionDocumentationUrl,
    userSupervisionDocumentationUrlName: TEMP(dto).userSupervisionDocumentationUrlName,
    nextDataRetentionEvaluationDate: TEMP(dto).nextDataRetentionEvaluationDate,
  };
}

/**
 * Temporary function to handle the fact that the API response type is not updated. SHOULD BE REMOVED before merge
 */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
function TEMP(dto: APIGdprReportResponseDTO): any {
  return dto;
}
