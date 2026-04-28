import { APIGdprCriticalityChoice } from 'src/app/api/v2';

export interface GdprCriticality {
  name: string;
  value: APIGdprCriticalityChoice | string;
}

export const gdprCriticalityOptions: GdprCriticality[] = [
  { name: $localize`Ikke kritisk`, value: APIGdprCriticalityChoice.NotCritical },
  { name: $localize`Lav`, value: APIGdprCriticalityChoice.Low },
  { name: $localize`Medium`, value: APIGdprCriticalityChoice.Medium },
  { name: $localize`Høj`, value: APIGdprCriticalityChoice.High },
  { name: $localize`Meget høj`, value: APIGdprCriticalityChoice.VeryHigh },
];

export const mapGdprCriticality = (value?: APIGdprCriticalityChoice): GdprCriticality | undefined => {
  return gdprCriticalityOptions.find((option) => option.value === value);
};
