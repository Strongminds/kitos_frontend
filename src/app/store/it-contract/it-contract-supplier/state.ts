import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { APIResourceCollectionPermissionsResponseDTO } from 'src/app/api/v2';
import { ITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';

export interface ITContractSupplierState {
  suppliers: ITContractSupplier[];
  total: number;
  isLoading: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
}
