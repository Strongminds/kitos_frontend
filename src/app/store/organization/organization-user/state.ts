import { EntityState } from '@ngrx/entity';
import { APIUserCollectionPermissionsResponseDTO } from 'src/app/api/v2';
import { Cached } from 'src/app/shared/models/cache-item.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';

export interface OrganizationUserState extends EntityState<ODataOrganizationUser> {
  total: number;
  isLoadingUsersQuery: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];

  permissions: Cached<APIUserCollectionPermissionsResponseDTO> | null;
  createLoading: boolean;
}
