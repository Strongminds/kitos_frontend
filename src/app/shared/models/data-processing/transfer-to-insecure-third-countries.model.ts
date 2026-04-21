import { APIDataProcessingRegistrationDTO } from 'src/app/api/v1';
import { YesNoDontKnowEnum } from '../yes-no-dont-know.model';

export interface TransferToInsecureThirdCountries {
  name: string;
  value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum;
}

export const transferToInsecureThirdCountriesOptions: TransferToInsecureThirdCountries[] = [
  {
    name: $localize`Ja`,
    value: YesNoDontKnowEnum.,
  },
  {
    name: $localize`Nej`,
    value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum.No,
  },
  {
    name: '',
    value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum.Undecided,
  },
];

export const mapTransferToInsecureThirdCountries = (
  source?: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum,
): TransferToInsecureThirdCountries | undefined => {
  return transferToInsecureThirdCountriesOptions.find((option) => option.value === source);
};
