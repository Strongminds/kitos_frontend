import { OrganizationRight } from '../models/organization-right.model';

export function isUserLocalAdminIn(
  organizationRights: OrganizationRight[] | undefined,
  organizationUuid: string | undefined
): boolean {
  if (!organizationUuid || !organizationUuid) {
    return false;
  }
  const localAdminEnumValue = 1;
  return (
    organizationRights
      ?.filter((right) => right.organizationUuid === organizationUuid)
      .map((right) => right.role)
      .includes(localAdminEnumValue) ?? false
  );
}
