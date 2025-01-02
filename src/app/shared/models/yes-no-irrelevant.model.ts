import { APIDataProcessingRegistrationGeneralDataResponseDTO } from 'src/app/api/v2';

export interface YesNoIrrelevantOptions {
  name: string;
  value: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum | string;
}

export enum YesNoIrrelevantEnum {
  Yes = 'Yes',
  No = 'No',
  Irrelevant = 'Irrelevant',
  Undecided = 'Undecided',
}

export const yesNoIrrelevantOptions: YesNoIrrelevantOptions[] = [
  { name: $localize`Ja`, value: YesNoIrrelevantEnum.Yes },
  { name: $localize`Nej`, value: YesNoIrrelevantEnum.No },
  { name: $localize`Ikke relevant`, value: YesNoIrrelevantEnum.Irrelevant },
];

export const yesNoIrrelevantOptionsGrid: YesNoIrrelevantOptions[] = [
  { name: $localize`Ja`, value: 'Ja' },
  { name: $localize`Nej`, value: 'Nej' },
  { name: $localize`Ikke relevant`, value: 'Ikke relevant' },
];

export const fromCapitalizedString = (
  value: string
): APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum => {
  switch (value) {
    case 'YES':
      return YesNoIrrelevantEnum.Yes;
    case 'NO':
      return YesNoIrrelevantEnum.No;
    case 'IRRELEVANT':
      return YesNoIrrelevantEnum.Irrelevant;
    case 'UNDECIDED':
      return YesNoIrrelevantEnum.Undecided;
    default:
      throw new Error(`Unknown value for conversion into API yes/no/irrelevant enum: ${value}`);
  }
};

export const mapToYesNoIrrelevantEnum = (
  value?: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum
): YesNoIrrelevantOptions | undefined => {
  return yesNoIrrelevantOptions.find((option) => option.value === value);
};

export const mapToYesNoIrrelevantEnumGrid = (
  value?: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum
): YesNoIrrelevantOptions | undefined => {
  return yesNoIrrelevantOptionsGrid.find((option) => option.value === value);
};
