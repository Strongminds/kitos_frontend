import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ItSystemArchiveOData } from 'src/app/shared/models/it-system/it-system-archive-odata.model';
import { ITSystemArchiveActions } from './actions';
import { ITSystemArchiveState } from './state';

export const itSystemArchiveAdapter = createEntityAdapter<ItSystemArchiveOData>({
  selectId: (archive: ItSystemArchiveOData): string => archive.id,
});

export const itSystemArchiveInitialState: ITSystemArchiveState = itSystemArchiveAdapter.getInitialState({
  total: 0,
  isLoading: false,
  gridState: defaultODataGridState,
  previousGridState: defaultODataGridState,
  gridColumns: [],
  isRemoving: false,
  error: undefined,
  collectionPermissions: undefined,
  itSystemArchive: undefined,
  itSystemArchiveLoading: false,
});

export const itSystemArchiveFeature = createFeature({
  name: 'ITSystemArchive',
  reducer: createReducer(
    itSystemArchiveInitialState,
    on(
      ITSystemArchiveActions.getITSystemArchives,
      (state): ITSystemArchiveState => ({
        ...state,
        isLoading: true,
        error: undefined,
      }),
    ),
    on(
      ITSystemArchiveActions.getITSystemArchivesSuccess,
      (state, { archives, total }): ITSystemArchiveState => ({
        ...itSystemArchiveAdapter.setAll(archives, state),
        total,
        isLoading: false,
      }),
    ),
    on(
      ITSystemArchiveActions.getITSystemArchivesError,
      (state, { error }): ITSystemArchiveState => ({
        ...state,
        isLoading: false,
        error,
      }),
    ),
    on(
      ITSystemArchiveActions.updateGridState,
      (state, { gridState }): ITSystemArchiveState => ({
        ...state,
        isLoading: true,
        gridState,
        previousGridState: state.gridState,
      }),
    ),
    on(
      ITSystemArchiveActions.updateGridColumnsSuccess,
      (state, { gridColumns }): ITSystemArchiveState => ({
        ...state,
        gridColumns,
      }),
    ),
    on(
      ITSystemArchiveActions.deleteITSystemArchive,
      (state): ITSystemArchiveState => ({
        ...state,
        isRemoving: true,
      }),
    ),
    on(
      ITSystemArchiveActions.deleteITSystemArchiveSuccess,
      (state): ITSystemArchiveState => ({
        ...state,
        isRemoving: false,
      }),
    ),
    on(
      ITSystemArchiveActions.deleteITSystemArchiveError,
      (state): ITSystemArchiveState => ({
        ...state,
        isRemoving: false,
      }),
    ),
    on(
      ITSystemArchiveActions.getITSystemArchiveCollectionPermissionsSuccess,
      (state, { collectionPermissions }): ITSystemArchiveState => ({
        ...state,
        collectionPermissions,
      }),
    ),
    on(
      ITSystemArchiveActions.getITSystemArchive,
      (state): ITSystemArchiveState => ({
        ...state,
        itSystemArchive: undefined,
        itSystemArchiveLoading: true,
      }),
    ),
    on(
      ITSystemArchiveActions.getITSystemArchiveSuccess,
      (state, { itSystemArchive }): ITSystemArchiveState => ({
        ...state,
        itSystemArchive,
        itSystemArchiveLoading: false,
      }),
    ),
    on(
      ITSystemArchiveActions.getITSystemArchiveError,
      (state): ITSystemArchiveState => ({
        ...state,
        itSystemArchiveLoading: false,
      }),
    ),
  ),
});
