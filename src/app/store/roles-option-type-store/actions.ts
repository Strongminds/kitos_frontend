import { createActionGroup } from '@ngrx/store';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';

export const RoleOptionTypeActions = createActionGroup({
  source: 'RoleOptionType',
  events: {
    'Get options': (optionType: RoleOptionTypes) => ({ optionType }),
    'Get options Success': (optionType: RoleOptionTypes, options: Array<APIRoleOptionResponseDTO>) => ({
      options,
      optionType,
    }),
    'Get options Error': (optionType: RoleOptionTypes) => ({ optionType }),

    'Update loading on valid cache': (optionType: RoleOptionTypes) => ({ optionType }),
  },
});
