import { ShallowOrganization } from "src/app/shared/models/organization/shallow-organization.model";

export interface OrganizationSuppliersState {
  suppliers: ShallowOrganization[];
  availableSuppliers: ShallowOrganization[];
  suppliersLoading: boolean;
}
