import { createActionGroup, emptyProps } from '@ngrx/store';
import { GdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';

export const GdprReportActions = createActionGroup({
  source: 'GdprReport',
  events: {
    'Get GDPR report': emptyProps(),
    'Get GDPR report Success': (report: GdprReport[]) => ({ report }),
    'Get GDPR report Error': emptyProps(),
  },
});
