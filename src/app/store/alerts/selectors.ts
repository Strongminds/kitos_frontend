import { createSelector } from '@ngrx/store';
import { AlertsState, RelatedEntityType } from './state';
import { alertsFeature } from './reducers';

export const { selectAlertsState } = alertsFeature;

export const selectAlertsByType = (entityType: RelatedEntityType) =>
  createSelector(selectAlertsState, (state: AlertsState) => state.alerts[entityType]);

export const selectAllAlertCount = createSelector(selectAlertsState, (state: AlertsState) => {
  return Object.values(RelatedEntityType).reduce((total, type) => {
    const entityState = state.alerts[type];
    const count = entityState.ids.length;
    return total + count;
  }, 0);
});
