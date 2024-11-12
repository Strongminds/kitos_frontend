import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIHelpTextCreateRequestDTO } from 'src/app/api/v2/model/helpTextCreateRequestDTO';
import { APIHelpTextResponseDTO } from 'src/app/api/v2/model/helpTextResponseDTO';
import { APIHelpTextUpdateRequestDTO } from 'src/app/api/v2/model/helpTextUpdateRequestDTO';

export const HelpTextActions = createActionGroup({
  source: 'HelpText',
  events: {
    'Get Help Texts': emptyProps(),
    'Get Help Texts success': (helpTexts: APIHelpTextResponseDTO[]) => ({ helpTexts }),
    'Get Help Texts error': emptyProps(),

    'Update Help Text': (key: string, request: APIHelpTextUpdateRequestDTO) => ({ key, request }),
    'Update Help Text Success': (helpText: APIHelpTextResponseDTO) => ({ helpText }),
    'Update Help Text Error': () => emptyProps(),

    'Create Help Text': (key: string, request: APIHelpTextCreateRequestDTO) => ({ key, request }),
    'Create Help Text Success': (helpText: APIHelpTextResponseDTO) => ({ helpText }),
    'Create Help Text Error': () => emptyProps(),

    'Delete Help Text': (key: string) => ({ key }),
    'Delete Help Text Success': () => emptyProps(),
    'Delete Help Text Error': () => emptyProps(),
  },
});
