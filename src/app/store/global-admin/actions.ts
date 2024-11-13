import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIGlobalRoleOptionCreateRequestDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
} from 'src/app/api/v2';
import { LocalAdminOptionType } from 'src/app/shared/models/options/local-admin-option-type.model';
import { GlobalAdminUser } from './state';

export const GlobalOptionTypeActions = createActionGroup({
  source: 'GlobalOptionType',
  events: {
    'Update Option Type': (
      optionType: LocalAdminOptionType,
      optionUuid: string,
      request: APIGlobalRoleOptionUpdateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Update Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Update Option Type Error': () => emptyProps(),

    'Create Option Type': (optionType: LocalAdminOptionType, request: APIGlobalRoleOptionCreateRequestDTO) => ({
      optionType,
      request,
    }),
    'Create Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Create Option Type Error': () => emptyProps(),
  },
});

export const GlobalAdminActions = createActionGroup({
  source: 'GlobalAdmin',
  events: {
    'Get Global Admins': () => emptyProps(),
    'Get Global Admins Success': (admins: GlobalAdminUser[]) => ({ admins }),
    'Get Global Admins Error': () => emptyProps(),

    'Add Global Admin': (userUuid: string) => ({ userUuid }),
    'Add Global Admin Success': (user: GlobalAdminUser) => ({ user }),
    'Add Global Admin Error': () => emptyProps(),

    'Remove Global Admin': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Success': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Error': () => emptyProps(),
  },
});
