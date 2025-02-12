import { IRoleAssignment } from '../models/helpers/read-model-role-assignments';
import { OrganizationRight } from '../models/organization-right.model';

export function compareByRoleName(a: IRoleAssignment, b: IRoleAssignment): number {
  return a.assignment.role.name.localeCompare(b.assignment.role.name);
}


export function hasRoleInOrganization(
  organizationRights: OrganizationRight[] | undefined,
  organizationUuid: string | undefined,
  roleEnumValue: number
): boolean {
  if (!organizationUuid || !organizationRights) {
    return false;
  }
  return (
    organizationRights
      ?.filter((right) => right.organizationUuid === organizationUuid)
      .map((right) => right.role)
      .includes(roleEnumValue) ?? false
  );
}
