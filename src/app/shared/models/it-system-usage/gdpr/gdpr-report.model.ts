import { APIGdprReportResponseDTO } from 'src/app/api/v2';
import { HostedAt, mapHostedAt } from './hosted-at.model';

export interface GdprReport {
  systemUuid: string;
  systemName?: string;
  noData?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  legalData?: boolean;
  businessCritical?: APIGdprReportResponseDTO.BusinessCriticalEnum;
  dataProcessingAgreementConcluded?: boolean;
  linkToDirectory?: boolean;
  sensitiveDataTypes: Array<string>;
  riskAssessment?: APIGdprReportResponseDTO.RiskAssessmentEnum;
  riskAssessmentDate?: string;
  plannedRiskAssessmentDate?: string;
  preRiskAssessment?: APIGdprReportResponseDTO.PreRiskAssessmentEnum;
  personalDataCpr?: boolean;
  personalDataSocialProblems?: boolean;
  personalDataSocialOtherPrivateMatters?: boolean;
  dpia?: APIGdprReportResponseDTO.DpiaEnum;
  hostedAt?: HostedAt;
}

export function adaptGdprReport(dto: APIGdprReportResponseDTO): GdprReport {
  if (!dto.systemUuid) throw new Error('Missing systemUuid');
  return {
    systemUuid: dto.systemUuid,
    systemName: dto.systemName,
    noData: dto.noData,
    personalData: dto.personalData,
    sensitiveData: dto.sensitiveData,
    legalData: dto.legalData,
    businessCritical: dto.businessCritical,
    dataProcessingAgreementConcluded: dto.dataProcessingAgreementConcluded,
    linkToDirectory: dto.linkToDirectory,
    sensitiveDataTypes: dto.sensitiveDataTypes ?? [],
    riskAssessment: dto.riskAssessment,
    riskAssessmentDate: dto.riskAssessmentDate,
    plannedRiskAssessmentDate: dto.plannedRiskAssessmentDate,
    preRiskAssessment: dto.preRiskAssessment,
    personalDataCpr: dto.personalDataCpr,
    personalDataSocialProblems: dto.personalDataSocialProblems,
    personalDataSocialOtherPrivateMatters: dto.personalDataSocialOtherPrivateMatters,
    dpia: dto.dpia,
    hostedAt: mapHostedAt(dto.hostedAt),
  };
}
