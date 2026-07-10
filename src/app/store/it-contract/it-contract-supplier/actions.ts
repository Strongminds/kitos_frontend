import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationGridConfigurationResponseDTO } from 'src/app/api/v2/model/models';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';

export const ITContractSupplierActions = createActionGroup({
  source: 'ITContractSupplier',
  events: {
    'Get Suppliers': (gridState: GridState) => ({ gridState }),
    'Get Suppliers Success': (suppliers: ITContractSupplier[], total: number) => ({ suppliers, total }),
    'Get Suppliers Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Delete Supplier Success': emptyProps(),

    'Reset To Organization IT Contract Suppliers Column Configuration': (
      disablePopupNotification: boolean = false,
    ) => ({
      disablePopupNotification,
    }),
    'Reset To Organization IT Contract Suppliers Column Configuration Success': (
      response: APIOrganizationGridConfigurationResponseDTO,
      disablePopupNotification: boolean = false,
    ) => ({ response, disablePopupNotification }),
    'Reset To Organization IT Contract Suppliers Column Configuration Error': (
      disablePopupNotification: boolean = false,
    ) => ({
      disablePopupNotification,
    }),

    'Save IT Contract Suppliers Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT Contract Suppliers Filter': (state: SavedFilterState) => ({ state }),
  },
});
