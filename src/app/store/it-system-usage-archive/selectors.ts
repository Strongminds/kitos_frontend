import { createSelector } from '@ngrx/store';
import { itSystemUsageArchiveAdapter, itSystemUsageArchiveFeature } from './reducer';
import { GridData } from 'src/app/shared/models/grid-data.model';

const { selectITSystemUsageArchiveState } = itSystemUsageArchiveFeature;

export const selectAllUsageArchives = createSelector(
  selectITSystemUsageArchiveState,
  itSystemUsageArchiveAdapter.getSelectors().selectAll,
);

export const selectUsageArchiveTotal = createSelector(selectITSystemUsageArchiveState, (state) => state.total);

export const selectUsageArchiveGridData = createSelector(
  selectAllUsageArchives,
  selectUsageArchiveTotal,
  (data, total): GridData => ({ data, total }),
);

export const selectUsageArchiveIds = createSelector(
  selectITSystemUsageArchiveState,
  itSystemUsageArchiveAdapter.getSelectors().selectIds,
);

export const selectUsageArchiveEntities = createSelector(
  selectITSystemUsageArchiveState,
  itSystemUsageArchiveAdapter.getSelectors().selectEntities,
);

export const selectUsageArchiveIsLoading = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.isLoading,
);

export const selectUsageArchiveError = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.error,
);

export const selectUsageArchiveGridState = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.gridState,
);

export const selectUsageArchivePreviousGridState = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.previousGridState,
);

export const selectUsageArchiveGridColumns = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.gridColumns,
);

export const selectUsageArchiveIsRemoving = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.isRemoving,
);

export const selectUsageArchiveCollectionPermissions = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.collectionPermissions,
);

export const selectUsageArchiveHasDeletePermission = createSelector(
  selectITSystemUsageArchiveState,
  () => true, // Allow delete for now; can be connected to actual permissions later
);

export const selectItSystemUsageArchive = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.itSystemUsageArchive,
);

export const selectItSystemUsageArchiveLegacyName = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.itSystemUsageArchive?.legacyName,
);

export const selectItSystemUsageArchiveUuid = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.itSystemUsageArchive?.uuid,
);

export const selectItSystemUsageArchiveLoading = createSelector(
  selectITSystemUsageArchiveState,
  (state) => state.itSystemUsageArchiveLoading,
);
