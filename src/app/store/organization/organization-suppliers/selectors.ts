import { createSelector } from "@ngrx/store";
import { organizationSuppliersFeature } from "./reducer";

export const { selectOrganizationSuppliersState } = organizationSuppliersFeature;

export const selectOrganizationSuppliers = createSelector(selectOrganizationSuppliersState, (state) => state.suppliers);
export const selectAvailableOrganizationSuppliers = createSelector(selectOrganizationSuppliersState, (state) => state.availableSuppliers);