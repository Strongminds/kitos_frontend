import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIGlobalRegularOptionCreateRequestDTO, APIGlobalRegularOptionUpdateRequestDTO } from 'src/app/api/v2';
import { AdminOptionType } from 'src/app/shared/models/options/admin-option-type.model';

export const GlobalOptionTypeActions = createActionGroup({
  source: 'GlobalOptionType',
  events: {
    'Update Regular Option Type': (
      optionType: AdminOptionType,
      optionUuid: string,
      request: APIGlobalRegularOptionUpdateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Update Regular Option Type Success': (optionType: AdminOptionType) => ({ optionType }),
    'Update Regular Option Type Error': () => emptyProps(),

    'Create Regular Option Type': (
      optionType: AdminOptionType,
      optionUuid: string,
      request: APIGlobalRegularOptionCreateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Create Regular Option Type Success': (optionType: AdminOptionType) => ({ optionType }),
    'Create Regular Option Type Error': () => emptyProps(),
  },
});
