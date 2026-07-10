import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIResourceCollectionPermissionsResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';

export const ITContractSupplierActions = createActionGroup({
  source: 'ITContractSupplier',
  events: {
    'Get Suppliers': (gridState: GridState) => ({ gridState }),
    'Get Suppliers Success': (suppliers: any[], total: number) => ({ suppliers, total }),
    'Get Suppliers Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Get Supplier Collection Permissions': emptyProps(),
    'Get Supplier Collection Permissions Success': (
      permissions?: APIResourceCollectionPermissionsResponseDTO,
    ) => ({ permissions }),
    'Get Supplier Collection Permissions Error': emptyProps(),

    'Delete Supplier Success': emptyProps(),
  },
});
