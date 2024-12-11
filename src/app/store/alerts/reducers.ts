import { createEntityAdapter } from '@ngrx/entity';
import { Alert, AlertsState, RelatedEntityType } from './state';
import { createFeature, createReducer } from '@ngrx/store';

export const alertsAdapter = createEntityAdapter<Alert>({
  selectId: (alert) => alert.uuid,
});

export const initialAlertsState: AlertsState = {
  alerts: {
    [RelatedEntityType.ItSystemUsage]: alertsAdapter.getInitialState(),
    [RelatedEntityType.ItContract]: alertsAdapter.getInitialState(),
    [RelatedEntityType.DataProcessingRegistration]: alertsAdapter.getInitialState(),
  },
};

export const alertsFeature = createFeature({
  name: 'alerts',
  reducer: createReducer(initialAlertsState),
});
