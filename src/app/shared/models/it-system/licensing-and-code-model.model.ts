import { APILicensingAndCodeModelChoice } from 'src/app/api/v2';

export interface LicensingAndCodeModel {
  name: string;
  value: APILicensingAndCodeModelChoice;
}

export const licensingAndCodeModelOptions: LicensingAndCodeModel[] = [
  { name: $localize`Open Source`, value: APILicensingAndCodeModelChoice.OpenSource },
  { name: $localize`Freeware`, value: APILicensingAndCodeModelChoice.Freeware },
  { name: $localize`Proprietær`, value: APILicensingAndCodeModelChoice.Proprietary },
];

export const mapLicensingAndCodeModel = (
  source?: APILicensingAndCodeModelChoice,
): LicensingAndCodeModel | undefined => {
  return licensingAndCodeModelOptions.find((option) => option.value === source);
};

export const mapLicensingAndCodeModels = (sources: APILicensingAndCodeModelChoice[]): LicensingAndCodeModel[] =>
  sources?.map((source) => mapLicensingAndCodeModel(source)).filter((option) => option !== undefined);
