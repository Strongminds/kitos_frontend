import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';
import { GdprReportActions } from './actions';
import { GdprReportState } from './state';

export const gdprReportsAdapter = createEntityAdapter<GdprReport>();

export const initialGdprReportState: GdprReportState = gdprReportsAdapter.getInitialState({
  cacheTime: undefined,
});

export const gdprReportFeature = createFeature({
  name: 'GdprReport',
  reducer: createReducer(
    initialGdprReportState,
    on(GdprReportActions.getGDPRReportsSuccess, (state, { report }): GdprReportState => {
      return {
        ...gdprReportsAdapter.setAll(report, state),
        cacheTime: new Date().getTime(),
      };
    })
  ),
});
