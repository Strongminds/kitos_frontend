import { APIYesNoDontKnowIrrelevantChoice } from 'src/app/api/v2';

export interface YesNoDontKnowIrrelevantOption {
  name: string;
  value: APIYesNoDontKnowIrrelevantChoice | string;
}

export enum YesNoDontKnowIrrelevantEnum {
  Yes = 'Yes',
  No = 'No',
  DontKnow = 'DontKnow',
  Irrelevant = 'Irrelevant',
  Undecided = 'Undecided',
}

export const yesNoDontKnowIrrelevantOptions: YesNoDontKnowIrrelevantOption[] = [
  { name: $localize`Ja`, value: YesNoDontKnowIrrelevantEnum.Yes },
  { name: $localize`Nej`, value: YesNoDontKnowIrrelevantEnum.No },
  { name: $localize`Ved ikke`, value: YesNoDontKnowIrrelevantEnum.DontKnow },
  { name: $localize`Ikke relevant`, value: YesNoDontKnowIrrelevantEnum.Irrelevant },
];

export interface YesNoDontKnowIrrelevantGridOption {
  name: string;
  value: string;
}

export const yesNoDontKnowIrrelevantOptionsGrid: YesNoDontKnowIrrelevantGridOption[] = [
  { name: $localize`Ja`, value: 'YES' },
  { name: $localize`Nej`, value: 'NO' },
  { name: $localize`Ved ikke`, value: 'DONTKNOW' },
  { name: $localize`Ikke relevant`, value: 'IRRELEVANT' },
];

export const mapGridYesNoDontKnowIrrelevantEnum = (value?: string): YesNoDontKnowIrrelevantGridOption | undefined => {
  return yesNoDontKnowIrrelevantOptionsGrid.find((option) => option.value === value);
};

export const mapToYesNoDontKnowIrrelevantEnum = (
  value?: APIYesNoDontKnowIrrelevantChoice,
): YesNoDontKnowIrrelevantOption | undefined => {
  return yesNoDontKnowIrrelevantOptions.find((option) => option.value === value);
};

export const mapFromCapitalizedStringToYesNoDontKnowIrrelevantEnum = (
  value?: string,
): YesNoDontKnowIrrelevantOption | undefined => {
  const enumValue = fromCapitalizedString(value);
  return yesNoDontKnowIrrelevantOptions.find((option) => option.value === enumValue);
};

function fromCapitalizedString(value?: string): YesNoDontKnowIrrelevantEnum {
  switch (value) {
    case 'YES':
      return YesNoDontKnowIrrelevantEnum.Yes;
    case 'NO':
      return YesNoDontKnowIrrelevantEnum.No;
    case 'DONTKNOW':
      return YesNoDontKnowIrrelevantEnum.DontKnow;
    case 'IRRELEVANT':
      return YesNoDontKnowIrrelevantEnum.Irrelevant;
    case null:
    case undefined:
    case 'UNDECIDED':
      return YesNoDontKnowIrrelevantEnum.Undecided;
    default:
      throw new Error(`Unknown value for conversion into API yes/no/dont-know/irrelevant/undecided enum: ${value}`);
  }
}
