import { APIUserCollectionEditPermissionsResponseDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { MultiSelectDropdownItem } from '../../dropdown-option.model';

export interface UserRoleChoice {
  name: string;
  value: APIUserResponseDTO.RolesEnum;
  selected: boolean;
  dataCy?: string;
}

export const userRoleChoiceOptions: UserRoleChoice[] = [
  {
    name: $localize`Lokal admin`,
    value: APIUserResponseDTO.RolesEnum.LocalAdmin,
    selected: false,
    dataCy: 'local-admin-option',
  },
  {
    name: $localize`Organisations admin`,
    value: APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin,
    selected: false,
    dataCy: 'organization-admin-option',
  },
  {
    name: $localize`System admin`,
    value: APIUserResponseDTO.RolesEnum.SystemModuleAdmin,
    selected: false,
    dataCy: 'system-admin-option',
  },
  {
    name: $localize`Kontrakt admin`,
    value: APIUserResponseDTO.RolesEnum.ContractModuleAdmin,
    selected: false,
    dataCy: 'contract-admin-option',
  },
];

export const mapUserRoleChoice = (value?: APIUserResponseDTO.RolesEnum): UserRoleChoice | undefined => {
  return userRoleChoiceOptions.find((option) => option.value === value);
};

export function GetOptionsBasedOnRights(
  modifyPermissions: APIUserCollectionEditPermissionsResponseDTO | undefined
): MultiSelectDropdownItem<APIUserResponseDTO.RolesEnum>[] {
  return userRoleChoiceOptions.map((option) => mapUserRoleChoiceToMultiSelectOption(modifyPermissions, option));
}

function mapUserRoleChoiceToMultiSelectOption(
  modifyPermissions: APIUserCollectionEditPermissionsResponseDTO | undefined,
  item: UserRoleChoice
): MultiSelectDropdownItem<APIUserResponseDTO.RolesEnum> {
  if (!modifyPermissions) return { ...item, disabled: true };

  if (modifyPermissions.modifyContractRole && item.value === APIUserResponseDTO.RolesEnum.ContractModuleAdmin)
    return { ...item, disabled: false };
  if (modifyPermissions.modifyOrganizationRole && item.value === APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin)
    return { ...item, disabled: false };
  if (modifyPermissions.modifySystemRole && item.value === APIUserResponseDTO.RolesEnum.SystemModuleAdmin)
    return { ...item, disabled: false };

  return { ...item, disabled: true };
}
