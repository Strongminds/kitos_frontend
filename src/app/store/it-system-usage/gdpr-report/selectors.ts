import { createSelector } from '@ngrx/store';
import { memoize } from 'lodash';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { gdprReportFeature } from './reducer';

const { selectGdprReportState } = gdprReportFeature;

export const selectGdprReportHasValidCache = memoize(() =>
  createSelector(
    selectGdprReportState,
    () => new Date(),
    (state, time) => hasValidCache(state.cacheTime, time)
  )
);
