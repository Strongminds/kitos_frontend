import { APIRiskLevelChoice } from 'src/app/api/v2';

export interface RiskAssessmentResultOptions {
  name: string;
  value: APIRiskLevelChoice;
}

export const riskAssessmentResultOptions: RiskAssessmentResultOptions[] = [
  { name: $localize`Lav risiko`, value: APIRiskLevelChoice.Low },
  { name: $localize`Mellem risiko`, value: APIRiskLevelChoice.Medium },
  { name: $localize`Høj risiko`, value: APIRiskLevelChoice.High },
];

export const mapRiskAssessmentEnum = (value?: APIRiskLevelChoice): RiskAssessmentResultOptions | undefined => {
  return riskAssessmentResultOptions.find((option) => option.value === value);
};
