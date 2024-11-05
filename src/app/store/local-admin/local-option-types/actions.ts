import { createActionGroup, emptyProps } from '@ngrx/store';
import { APILocalRegularOptionUpdateRequestDTO } from 'src/app/api/v2';
import { AdminOptionType } from 'src/app/shared/models/options/admin-option-type.model';

export const LocalOptionTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Uppdate Option Type': (
      optionType: AdminOptionType,
      optionUuid: string,
      request: APILocalRegularOptionUpdateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Update Option Type Active Status': (optionType: AdminOptionType, optionUuid: string, isActive: boolean) => ({
      optionType,
      optionUuid,
      isActive,
    }),
    'Update Option Type Success': (optionType: AdminOptionType) => ({ optionType }),
    'Update Option Type Error': () => emptyProps(),
  },
});
