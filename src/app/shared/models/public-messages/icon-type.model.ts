import { APIPublicMessageIconTypeChoice } from 'src/app/api/v2';
import { IconType } from '../icon-type';

export interface PublicMessageIconType {
  name: string;
  icon: IconType;
  value: APIPublicMessageIconTypeChoice;
}

export const iconTypeOptions: PublicMessageIconType[] = [
  {
    name: $localize`Dokument`,
    icon: 'document',
    value: APIPublicMessageIconTypeChoice.NUMBER_0,
  },
  {
    name: $localize`Udklipsholder`,
    icon: 'clipboard',
    value: APIPublicMessageIconTypeChoice.NUMBER_1,
  },
  {
    name: $localize`Indstillinger`,
    icon: 'settings',
    value: APIPublicMessageIconTypeChoice.NUMBER_2,
  },
  {
    name: $localize`Kalendar`,
    icon: 'calendar',
    value: APIPublicMessageIconTypeChoice.NUMBER_3,
  },
  {
    name: $localize`Brugere`,
    icon: 'multiple-users',
    value: APIPublicMessageIconTypeChoice.NUMBER_4,
  },
  {
    name: $localize`Mail`,
    icon: 'mail',
    value: APIPublicMessageIconTypeChoice.NUMBER_5,
  },
];

export const mapIconType = (value?: APIPublicMessageIconTypeChoice): PublicMessageIconType | undefined => {
  return iconTypeOptions.find((option) => option.value === value);
};
