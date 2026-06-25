import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIItSystemArchiveResponseDTO, APIResourceCollectionPermissionsResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ItSystemArchiveOData } from 'src/app/shared/models/it-system/it-system-archive-odata.model';

export const ITSystemArchiveActions = createActionGroup({
  source: 'ITSystemArchive',
  events: {
    'Get IT System Archives': (gridState: GridState) => ({ gridState }),
    'Get IT System Archives Success': (archives: ItSystemArchiveOData[], total: number) => ({
      archives,
      total,
    }),
    'Get IT System Archives Error': (error?: string) => ({ error }),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Delete IT System Archive': (archiveUuid: string) => ({ archiveUuid }),
    'Delete IT System Archive Success': emptyProps(),
    'Delete IT System Archive Error': emptyProps(),

    'Get IT System Archive Collection Permissions': emptyProps(),
    'Get IT System Archive Collection Permissions Success': (
      collectionPermissions?: APIResourceCollectionPermissionsResponseDTO,
    ) => ({
      collectionPermissions,
    }),
    'Get IT System Archive Collection Permissions Error': emptyProps(),

    'Save IT System Archive Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT System Archive Filter': (state: SavedFilterState) => ({ state }),

    'Get IT System Archive': (systemArchiveUuid: string) => ({ systemArchiveUuid }),
    'Get IT System Archive Success ': (itSystemArchive?: APIItSystemArchiveResponseDTO) => ({ itSystemArchive }),
    'Get IT System Archive Error': emptyProps(),
  },
});
