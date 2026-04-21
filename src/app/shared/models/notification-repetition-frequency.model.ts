import { APIRepetitionFrequencyOptions } from 'src/app/api/v2';

export interface NotificationRepetitionFrequency {
  name: string;
  value: APIRepetitionFrequencyOptions;
}

export const notificationRepetitionFrequencyOptions: NotificationRepetitionFrequency[] = [
  { name: $localize`Time`, value: APIRepetitionFrequencyOptions.NUMBER_0 },
  { name: $localize`Dag`, value: APIRepetitionFrequencyOptions.NUMBER_1 },
  { name: $localize`Uge`, value: APIRepetitionFrequencyOptions.NUMBER_2 },
  { name: $localize`Måned`, value: APIRepetitionFrequencyOptions.NUMBER_3 },
  { name: $localize`Kvartal`, value: APIRepetitionFrequencyOptions.NUMBER_4 },
  { name: $localize`Halvårlig`, value: APIRepetitionFrequencyOptions.NUMBER_5 },
  { name: $localize`År`, value: APIRepetitionFrequencyOptions.NUMBER_6 },
];

export const mapNotificationRepetitionFrequency = (
  value?: APIRepetitionFrequencyOptions,
): NotificationRepetitionFrequency | undefined => {
  return notificationRepetitionFrequencyOptions.find((option) => option.value === value);
};
