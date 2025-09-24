import { createActionGroup, emptyProps } from "@ngrx/store";
import { ShallowOrganization } from "src/app/shared/models/organization/shallow-organization.model";

export const OrganizationSuppliersActions = createActionGroup({
  source: 'Organization Suppliers',
  events: {
    'Get Organization Suppliers': emptyProps(),
    'Get Organization Suppliers Success': (suppliers: ShallowOrganization[]) => ({ suppliers }),
    'Get Organization Suppliers Error': emptyProps(),

    'Get Available Organization Suppliers': emptyProps(),
    'Get Available Organization Suppliers Success': (availableSuppliers: ShallowOrganization[]) => ({ availableSuppliers }),
    'Get Available Organization Suppliers Error': emptyProps(),
  }
});
