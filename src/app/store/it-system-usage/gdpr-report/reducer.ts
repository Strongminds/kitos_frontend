import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer } from '@ngrx/store';
import { GdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';

export const gdprReportAdapter = createEntityAdapter<GdprReport>();

export const initialGdprReportState = gdprReportAdapter.getInitialState({
  cacheTime: undefined,
});

export const gdprReportFeature = createFeature({
  name: 'GdprReport',
  reducer: createReducer(initialGdprReportState),
});
