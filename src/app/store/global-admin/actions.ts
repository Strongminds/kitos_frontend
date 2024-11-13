import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIGlobalRoleOptionCreateRequestDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
  APIUserReferenceResponseDTO,
} from 'src/app/api/v2';
import { LocalAdminOptionType } from 'src/app/shared/models/options/local-admin-option-type.model';

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

    'Get Global Admins': () => emptyProps(),
  },
});

export const GlobalAdminActions = createActionGroup({
  source: 'GlobalAdmin',
  events: {
    'Get Global Admins': () => emptyProps(),
    'Get Global Admins Success': (admins: APIUserReferenceResponseDTO[]) => ({ admins }),
    'Get Global Admins Error': () => emptyProps(),

    'Add Global Admin': (userUuid: string) => ({ userUuid }),
    'Add Global Admin Success': (user: APIUserReferenceResponseDTO) => ({ user }),
    'Add Global Admin Error': () => emptyProps(),

    'Remove Global Admin': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Success': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Error': () => emptyProps(),
  },
});
