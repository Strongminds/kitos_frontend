import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ShallowOrganization } from 'src/app/shared/models/organization/shallow-organization.model';
import { OrganizationSuppliersActions } from './actions';
import { OrganizationSuppliersState } from './state';

export const organizationSuppliersAdapter = createEntityAdapter<ShallowOrganization>();

export const organizationSuppliersInitialState: OrganizationSuppliersState =
  organizationSuppliersAdapter.getInitialState({
    suppliers: [],
    availableSuppliers: [],
    suppliersLoading: false,
  });

export const organizationSuppliersFeature = createFeature({
  name: 'OrganizationSuppliers',
  reducer: createReducer(
    organizationSuppliersInitialState,
    on(OrganizationSuppliersActions.getOrganizationSuppliers, (state) => ({
      ...state,
      suppliersLoading: true,
    })),
    on(
      OrganizationSuppliersActions.getOrganizationSuppliersSuccess,
      (state, { suppliers }): OrganizationSuppliersState => ({ ...state, suppliers, suppliersLoading: false })
    ),
    on(OrganizationSuppliersActions.getOrganizationSuppliersError, (state) => ({ ...state, suppliersLoading: false })),
    on(
      OrganizationSuppliersActions.getAvailableOrganizationSuppliersSuccess,
      (state, { availableSuppliers }): OrganizationSuppliersState => ({ ...state, availableSuppliers })
    )
  ),
});
