import { APIDefaultUserStartPreferenceChoice } from 'src/app/api/v2';

export interface StartPreferenceChoice {
  name: string;
  value: APIDefaultUserStartPreferenceChoice;
}

export const startPreferenceChoiceOptions: StartPreferenceChoice[] = [
  {
    name: $localize`Start side`,
    value: APIDefaultUserStartPreferenceChoice.NUMBER_0,
  },
  {
    name: $localize`Organisation`,
    value: APIDefaultUserStartPreferenceChoice.NUMBER_1,
  },
  {
    name: $localize`IT Systemer`,
    value: APIDefaultUserStartPreferenceChoice.NUMBER_2,
  },
  {
    name: $localize`IT Systemkatalog`,
    value: APIDefaultUserStartPreferenceChoice.NUMBER_3,
  },
  {
    name: $localize`IT Kontrakter`,
    value: APIDefaultUserStartPreferenceChoice.NUMBER_4,
  },
  {
    name: $localize`Databehandling`,
    value: APIDefaultUserStartPreferenceChoice.NUMBER_5,
  },
];

export const mapStartPreferenceChoice = (
  value?: APIDefaultUserStartPreferenceChoice,
): StartPreferenceChoice | undefined => {
  return startPreferenceChoiceOptions.find((option) => option.value === value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapStartPreferenceChoiceFromV1 = (value: any): StartPreferenceChoice | undefined => {
  switch (value) {
    case 'index':
      return startPreferenceChoiceOptions[0];
    case 'organization.structure':
      return startPreferenceChoiceOptions[1];
    case 'it-system.overview':
      return startPreferenceChoiceOptions[2];
    case 'it-system.catalog':
      return startPreferenceChoiceOptions[3];
    case 'it-contract.overview':
      return startPreferenceChoiceOptions[4];
    case 'data-processing.overview':
      return startPreferenceChoiceOptions[5];
    default:
      return undefined;
  }
};
