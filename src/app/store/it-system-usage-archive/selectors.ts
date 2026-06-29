import { createSelector } from '@ngrx/store';
import { itSystemArchiveFeature, itSystemArchiveAdapter } from './reducer';
import { GridData } from 'src/app/shared/models/grid-data.model';

const { selectITSystemArchiveState } = itSystemArchiveFeature;

export const selectAllArchives = createSelector(selectITSystemArchiveState, itSystemArchiveAdapter.getSelectors().selectAll);

export const selectArchiveTotal = createSelector(selectITSystemArchiveState, (state) => state.total);

export const selectArchiveGridData = createSelector(
  selectAllArchives,
  selectArchiveTotal,
  (data, total): GridData => ({ data, total }),
);

export const selectArchiveIds = createSelector(selectITSystemArchiveState, itSystemArchiveAdapter.getSelectors().selectIds);

export const selectArchiveEntities = createSelector(selectITSystemArchiveState, itSystemArchiveAdapter.getSelectors().selectEntities);

export const selectArchiveIsLoading = createSelector(
  selectITSystemArchiveState,
  (state) => state.isLoading,
);

export const selectArchiveError = createSelector(
  selectITSystemArchiveState,
  (state) => state.error,
);

export const selectArchiveGridState = createSelector(
  selectITSystemArchiveState,
  (state) => state.gridState,
);

export const selectArchivePreviousGridState = createSelector(
  selectITSystemArchiveState,
  (state) => state.previousGridState,
);

export const selectArchiveGridColumns = createSelector(
  selectITSystemArchiveState,
  (state) => state.gridColumns,
);

export const selectArchiveIsRemoving = createSelector(
  selectITSystemArchiveState,
  (state) => state.isRemoving,
);

export const selectArchiveCollectionPermissions = createSelector(
  selectITSystemArchiveState,
  (state) => state.collectionPermissions,
);

export const selectArchiveHasDeletePermission = createSelector(
  selectITSystemArchiveState,
  () => true, // Allow delete for now; can be connected to actual permissions later
);
