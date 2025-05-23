import { APIExtendedRoleAssignmentResponseDTO, APIOrganizationUnitRolesResponseDTO } from 'src/app/api/v2';
import { IdentityNamePair } from '../identity-name-pair.model';

export type RoleAssignmentsMap = {
  [key: string]: string;
};

export type RoleAssignmentEmailsMaps = {
  [key: string]: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRoleAssignmentsToUserFullNames(roleAssignments: any): RoleAssignmentsMap {
  const roles: RoleAssignmentsMap = {};
  roleAssignments.forEach((assignment: { RoleId: number; UserFullName: string }) => {
    const roleKey = `Role${assignment.RoleId}`;
    if (!roles[roleKey]) {
      roles[roleKey] = assignment.UserFullName;
    } else {
      roles[roleKey] += `, ${assignment.UserFullName}`;
    }
  });
  return roles;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRoleAssignmentsToEmails(roleAssignments: any): RoleAssignmentEmailsMaps {
  const emailsPerRole: RoleAssignmentEmailsMaps = {};
  roleAssignments.forEach((assignment: { RoleId: number; Email: string }) => {
    const roleKey = `Role${assignment.RoleId}.email`;
    if (!emailsPerRole[roleKey]) {
      emailsPerRole[roleKey] = assignment.Email;
    } else {
      emailsPerRole[roleKey] += `, ${assignment.Email}`;
    }
  });
  return emailsPerRole;
}

export class RegularRoleAssignment implements RoleAssignment {
  public assignment: APIExtendedRoleAssignmentResponseDTO;

  constructor(assignment: APIExtendedRoleAssignmentResponseDTO) {
    this.assignment = assignment;
  }
}

export class OrganizationUnitRoleAssignment implements RoleAssignment {
  public assignment: APIExtendedRoleAssignmentResponseDTO;
  public unitName: string;
  public unitUuid: string;

  constructor(assignment: APIOrganizationUnitRolesResponseDTO) {
    if (!assignment.roleAssignment) throw new Error('Role assignment is missing');
    this.assignment = assignment.roleAssignment;
    this.unitName = assignment.organizationUnitName ?? '';
    this.unitUuid = assignment.organizationUnitUuid ?? '';
  }
}

export interface RoleAssignment {
  assignment: APIExtendedRoleAssignmentResponseDTO;
  unitName?: string;
  unitUuid?: string;
}

export function extractUnitFromRoleAssignment(assignment: RoleAssignment): IdentityNamePair | undefined {
  if (!assignment.unitName || !assignment.unitUuid) return undefined;
  return { name: assignment.unitName, uuid: assignment.unitUuid };
}

export function mapDTOsToRoleAssignment(
  roleAssignment: APIExtendedRoleAssignmentResponseDTO | APIOrganizationUnitRolesResponseDTO,
): RoleAssignment {
  if (isAPIOrganizationUnitRolesResponseDTO(roleAssignment)) {
    return new OrganizationUnitRoleAssignment(roleAssignment);
  } else {
    return new RegularRoleAssignment(roleAssignment);
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAPIOrganizationUnitRolesResponseDTO(obj: any): obj is APIOrganizationUnitRolesResponseDTO {
  return (
    obj && typeof obj === 'object' && 'roleAssignment' in obj && 'organizationUnitUuid' in obj && 'organizationUnitName'
  );
}
