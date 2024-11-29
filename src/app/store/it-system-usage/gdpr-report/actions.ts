import { createActionGroup, emptyProps } from '@ngrx/store';
import { GdprReport } from './state';

export const GdprReportActions = createActionGroup({
  source: 'GdprReport',
  events: {
    'Get GDPR report': emptyProps(),
    'Get GDPR report Success': (report: GdprReport[]) => ({ report }),
    'Get GDPR report Error': emptyProps(),
  },
});
