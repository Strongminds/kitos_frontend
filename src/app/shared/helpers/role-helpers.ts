import { RoleAssignment } from '../models/helpers/read-model-role-assignments';
import {
  APINamedEntityWithUserFullNameV2DTO,
  APIRoleAssignmentRequestDTO,
  APIRoleAssignmentResponseDTO,
} from 'src/app/api/v2';
import { OrganizationRight } from '../models/organization-right.model';
import { RegistrationModel } from '../models/organization/organization-unit/organization-unit-registration.model';

export function compareByRoleName(a: RoleAssignment, b: RoleAssignment): number {
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

function roleAssignmentToRequest(roleAssignment: APIRoleAssignmentResponseDTO): APIRoleAssignmentRequestDTO {
  return {
    roleUuid: roleAssignment.role.uuid,
    userUuid: roleAssignment.user.uuid,
  };
}

export function mapToRoleAssignmentsRequests(roles?: APIRoleAssignmentResponseDTO[]): APIRoleAssignmentRequestDTO[] {
  return roles?.map(roleAssignmentToRequest) ?? [];
}
