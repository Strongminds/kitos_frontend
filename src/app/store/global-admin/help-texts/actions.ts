import { createActionGroup } from "@ngrx/store";

export const HelpTextTypeActions = createActionGroup({
  source: 'HelpText',
  events: {
    'Update HelpText': (
      key: string,
      request: apihelptext
    ) => ({ optionType, optionUuid, request }),
    'Update Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Update Option Type Error': () => emptyProps(),

    'Create Option Type': (
      optionType: LocalAdminOptionType,
      request: APIGlobalRoleOptionCreateRequestDTO
    ) => ({ optionType, request }),
    'Create Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Create Option Type Error': () => emptyProps(),
  },
});
