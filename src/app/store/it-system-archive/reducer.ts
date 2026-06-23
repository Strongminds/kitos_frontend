import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIItSystemArchiveResponseDTO } from 'src/app/api/v2';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemArchiveActions } from './actions';
import { ITSystemArchiveState } from './state';

export const itSystemArchiveAdapter = createEntityAdapter<APIItSystemArchiveResponseDTO>({
  selectId: (archive: APIItSystemArchiveResponseDTO) => archive.uuid,
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
});

export const itSystemArchiveFeature = createFeature({
  name: 'ITSystemArchive',
  reducer: createReducer(
    itSystemArchiveInitialState,
    on(ITSystemArchiveActions.getITSystemArchives, (state): ITSystemArchiveState => ({
      ...state,
      isLoading: true,
      error: undefined,
    })),
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
    on(ITSystemArchiveActions.deleteITSystemArchive, (state): ITSystemArchiveState => ({
      ...state,
      isRemoving: true,
    })),
    on(ITSystemArchiveActions.deleteITSystemArchiveSuccess, (state): ITSystemArchiveState => ({
      ...state,
      isRemoving: false,
    })),
    on(ITSystemArchiveActions.deleteITSystemArchiveError, (state): ITSystemArchiveState => ({
      ...state,
      isRemoving: false,
    })),
    on(
      ITSystemArchiveActions.getITSystemArchiveCollectionPermissionsSuccess,
      (state, { collectionPermissions }): ITSystemArchiveState => ({
        ...state,
        collectionPermissions,
      }),
    ),
  ),
});
