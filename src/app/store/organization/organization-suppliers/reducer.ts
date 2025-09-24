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
  });

export const organizationSuppliersFeature = createFeature({
  name: 'OrganizationSuppliers',
  reducer: createReducer(
    organizationSuppliersInitialState,
    on(
      OrganizationSuppliersActions.getOrganizationSuppliersSuccess,
      (state, { suppliers }): OrganizationSuppliersState => ({ ...state, suppliers })
    ),
    on(
      OrganizationSuppliersActions.getAvailableOrganizationSuppliersSuccess,
      (state, { availableSuppliers }): OrganizationSuppliersState => ({ ...state, availableSuppliers })
    )
  ),
});
