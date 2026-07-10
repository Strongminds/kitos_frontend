import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ITContractSupplierActions } from './actions';
import { ITContractSupplierState } from './state';

export const itContractSupplierInitialState: ITContractSupplierState = {
  suppliers: [],
  total: 0,
  isLoading: false,
  gridState: defaultODataGridState,
  previousGridState: defaultODataGridState,
  gridColumns: [],
  collectionPermissions: undefined,
};

export const itContractSupplierFeature = createFeature({
  name: 'ITContractSupplier',
  reducer: createReducer(
    itContractSupplierInitialState,
    on(
      ITContractSupplierActions.getSuppliers,
      (state): ITContractSupplierState => ({ ...state, isLoading: true }),
    ),
    on(
      ITContractSupplierActions.getSuppliersSuccess,
      (state, { suppliers, total }): ITContractSupplierState => ({
        ...state,
        suppliers,
        total,
        isLoading: false,
      }),
    ),
    on(
      ITContractSupplierActions.getSuppliersError,
      (state): ITContractSupplierState => ({
        ...state,
        isLoading: false,
      }),
    ),
    on(
      ITContractSupplierActions.updateGridState,
      (state, { gridState }): ITContractSupplierState => ({
        ...state,
        isLoading: true,
        gridState,
        previousGridState: state.gridState,
      }),
    ),
    on(
      ITContractSupplierActions.updateGridColumnsSuccess,
      (state, { gridColumns }): ITContractSupplierState => ({
        ...state,
        gridColumns,
      }),
    )
  ),
});
