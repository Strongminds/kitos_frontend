import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface GdprCriticality {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum | string;
}

export const gdprCriticalityOptions: GdprCriticality[] = [
  { name: $localize`Ikke kritisk`, value: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum.NotCritical },
  { name: $localize`Lav`, value: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum.Low },
  { name: $localize`Medium`, value: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum.Medium },
  { name: $localize`Høj`, value: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum.High },
  { name: $localize`Meget høj`, value: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum.VeryHigh },
];

export const mapGdprCriticality = (
  value?: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum
): GdprCriticality | undefined => {
  return gdprCriticalityOptions.find((option) => option.value === value);
};
