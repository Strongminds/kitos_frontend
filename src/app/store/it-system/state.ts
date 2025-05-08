import { EntityState } from '@ngrx/entity';
import {
  APIItSystemPermissionsResponseDTO,
  APIItSystemResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
} from 'src/app/api/v2';
import { Cached } from 'src/app/shared/models/cache-item.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';

export interface ITSystemState extends EntityState<ITSystem> {
  total: number;
  isLoadingSystemsQuery: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];

  loading: boolean | undefined;
  itSystem: APIItSystemResponseDTO | undefined;

  permissions: Cached<APIItSystemPermissionsResponseDTO> | undefined;
  collectionPermissions: Cached<APIResourceCollectionPermissionsResponseDTO> | undefined;

  isRemoving: boolean;
}
