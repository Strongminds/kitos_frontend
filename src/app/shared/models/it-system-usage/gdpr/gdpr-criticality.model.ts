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

export const mapGdprCriticality = (value?: APIGDPRRegistrationsResponseDTO.GdprCriticalityEnum): GdprCriticality | undefined => {
  return gdprCriticalityOptions.find((option) => option.value === value);
};

// export const hostedAtOptionsGrid: GdprCriticality[] = [
//   { name: $localize`Ikke kritisk`, value: 'NotCritical' },
//   { name: $localize`Lav`, value: 'Low' },
//   { name: $localize`Medium`, value: 'Medium' },
//   { name: $localize`Høj`, value: 'High' },
//   { name: $localize`Meget høj`, value: 'VeryHigh' },
// ];

// export const mapGridHostedAt = (value?: APIGDPRRegistrationsResponseDTO.HostedAtEnum): GdprCriticality | undefined => {
//   return hostedAtOptionsGrid.find((option) => option.value === value);
// };
