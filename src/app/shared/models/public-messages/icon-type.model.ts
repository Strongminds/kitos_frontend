import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { IconType } from '../icon-type';

export interface PublicMessageIconType {
  name: string;
  icon: IconType;
  value: APIPublicMessageRequestDTO.IconTypeEnum;
}

export const iconTypeOptions: PublicMessageIconType[] = [
  {
    name: $localize`Document`,
    icon: 'document',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Contact,
  },
  {
    name: $localize`Clipboard`,
    icon: 'clipboard',
    value: APIPublicMessageRequestDTO.IconTypeEnum.ContactPerson,
  },
  {
    name: $localize`Settings`,
    icon: 'settings',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Events,
  },
  {
    name: $localize`Calendar`,
    icon: 'calendar',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Instructions,
  },
  {
    name: $localize`Multiple Users`,
    icon: 'multiple-users',
    value: APIPublicMessageRequestDTO.IconTypeEnum.OperationalStatus,
  },
  {
    name: $localize`Mail`,
    icon: 'mail',
    value: APIPublicMessageRequestDTO.IconTypeEnum.Templates,
  },
];

export const mapIconType = (value?: APIPublicMessageRequestDTO.IconTypeEnum): PublicMessageIconType | undefined => {
  return iconTypeOptions.find((option) => option.value === value);
};
