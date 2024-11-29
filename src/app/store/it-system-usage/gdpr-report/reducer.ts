import { createEntityAdapter } from '@ngrx/entity';
import { GdprReport } from './state';
import { createFeature, createReducer } from '@ngrx/store';

export const gdprReportAdapter = createEntityAdapter<GdprReport>();

export const initialGdprReportState = gdprReportAdapter.getInitialState({
  cacheTime: undefined,
});

export const gdprReportFeature = createFeature({
  name: 'GdprReport',
  reducer: createReducer(
    initialGdprReportState,
  ),
});
