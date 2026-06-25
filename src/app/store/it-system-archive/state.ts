import { EntityState } from '@ngrx/entity';
import { APIItSystemArchiveResponseDTO, APIResourceCollectionPermissionsResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ItSystemArchiveOData } from 'src/app/shared/models/it-system/it-system-archive-odata.model';

export interface ITSystemArchiveState extends EntityState<ItSystemArchiveOData> {
  total: number;
  isLoading: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];
  isRemoving: boolean;
  error: string | undefined;
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
  itSystemArchive: APIItSystemArchiveResponseDTO | undefined;
  itSystemArchiveLoading: boolean;
}
