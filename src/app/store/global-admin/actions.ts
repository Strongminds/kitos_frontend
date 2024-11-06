import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIGlobalRegularOptionCreateRequestDTO, APIGlobalRegularOptionUpdateRequestDTO } from 'src/app/api/v2';
import { LocalAdminOptionType } from 'src/app/shared/models/options/local-admin-option-type.model';

export const GlobalOptionTypeActions = createActionGroup({
  source: 'GlobalOptionType',
  events: {
    'Update Regular Option Type': (
      optionType: LocalAdminOptionType,
      optionUuid: string,
      request: APIGlobalRegularOptionUpdateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Update Regular Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Update Regular Option Type Error': () => emptyProps(),

    'Create Regular Option Type': (
      optionType: LocalAdminOptionType,
      request: APIGlobalRegularOptionCreateRequestDTO
    ) => ({ optionType, request }),
    'Create Regular Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Create Regular Option Type Error': () => emptyProps(),
  },
});
