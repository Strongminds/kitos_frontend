import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { APIResourceCollectionPermissionsResponseDTO } from 'src/app/api/v2';

export interface ITContractSupplierState {
  suppliers: any[];
  total: number;
  isLoading: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
}
