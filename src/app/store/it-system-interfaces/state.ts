import { EntityState } from '@ngrx/entity';
import { APIItInterfacePermissionsResponseDTO, APIItInterfaceResponseDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITInterface } from 'src/app/shared/models/it-interface/it-interface.model';

export interface ITInterfaceState extends EntityState<ITInterface> {
  total: number;
  isLoadingInterfacesQuery: boolean;
  gridState: GridState;

  loading: boolean | undefined;
  itInterface: APIItInterfaceResponseDTO | undefined;

  isRemoving: boolean;
  isLoadingInterfaceDataRows: boolean;

  permissions: APIItInterfacePermissionsResponseDTO | undefined;
}
