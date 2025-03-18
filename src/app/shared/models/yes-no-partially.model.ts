import { APIGeneralDataResponseDTO } from 'src/app/api/v2';

export interface YesNoPartiallyOption {
  name: string;
  value: YesNoPartiallyEnum;
}

export enum YesNoPartiallyEnum {
  Yes = 'Yes',
  No = 'No',
  Partially = 'Partially',
}

function toYesNoPartiallyEnum(value: APIGeneralDataResponseDTO.WebAccessibilityComplianceEnum): YesNoPartiallyEnum {
  switch (value) {
    case 'Yes':
      return YesNoPartiallyEnum.Yes;
    case 'No':
      return YesNoPartiallyEnum.No;
    case 'Partially':
      return YesNoPartiallyEnum.Partially;
    default:
      throw new Error(`Unknown value for conversion into API yes/no/partially enum: ${value}`);
  }
}

export const yesNoPartiallyOptions: YesNoPartiallyOption[] = [
  { name: 'Ja', value: YesNoPartiallyEnum.Yes },
  { name: 'Nej', value: YesNoPartiallyEnum.No },
  { name: 'Delvist', value: YesNoPartiallyEnum.Partially },
];

export function mapToYesNoPartiallyEnum(
  value: APIGeneralDataResponseDTO.WebAccessibilityComplianceEnum
): YesNoPartiallyOption | undefined {
  return yesNoPartiallyOptions.find((option) => option.value === toYesNoPartiallyEnum(value));
}
