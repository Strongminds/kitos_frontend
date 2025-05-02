import { APIMutateRightRequestDTO, APIMutateUserRightsRequestDTO } from 'src/app/api/v2';
import {
  BulkActionOption,
  BulkActionResult,
} from '../components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { ODataOrganizationUser, Right } from '../models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

export function getRights(user: ODataOrganizationUser, entityType: RegistrationEntityTypes): Right[] {
  switch (entityType) {
    case 'organization-unit':
      return user.OrganizationUnitRights;
    case 'it-system':
      return user.ItSystemRights;
    case 'it-contract':
      return user.ItContractRights;
    case 'data-processing-registration':
      return user.DataProcessingRegistrationRights;
    default:
      throw new Error(`This component does not support entity type: ${entityType}`);
  }
}

export function getRoleTypeNameByEntityType(entityType: RegistrationEntityTypes): string {
  switch (entityType) {
    case 'organization-unit':
      return $localize`Organisationsenhed`;
    case 'it-system':
      return $localize`It System`;
    case 'it-contract':
      return $localize`It Kontrakt`;
    case 'data-processing-registration':
      return $localize`Databehandling`;
    default:
      throw new Error(`This component does not support entity type: ${entityType}`);
  }
}

export function getTypeTitleNameByType(entityType: RegistrationEntityTypes): string {
  switch (entityType) {
    case 'organization-unit':
      return $localize`Organisationsenhedroller`;
    case 'it-system':
      return $localize`Systemroller`;
    case 'it-contract':
      return $localize`Kontraktroller`;
    case 'data-processing-registration':
      return $localize`Databehandlingsroller`;
    default:
      throw new Error(`This component does not support entity type: ${entityType}`);
  }
}

export function userHasAnyRights(user: ODataOrganizationUser): boolean {
  return (
    user.OrganizationUnitRights.length > 0 ||
    user.ItSystemRights.length > 0 ||
    user.ItContractRights.length > 0 ||
    user.DataProcessingRegistrationRights.length > 0
  );
}

export function roleToCopyRoleRequestDTO(user: ODataOrganizationUser, role: Right): APIMutateRightRequestDTO {
  return { userUuid: user.Uuid, roleId: role.role.id, entityUuid: role.entity.uuid };
}

export function mapUserRightsToBulkOptions(rights: Right[]): BulkActionOption[] {
  return rights.map((right) => ({
    id: right.role.id,
    name: right.entity.name,
    secondaryName: right.role.name,
  }));
}

export function getRoleActionRequest(
  result: BulkActionResult,
  user: ODataOrganizationUser
): APIMutateUserRightsRequestDTO {
  return {
    unitRights: mapBulkActionResultsToMutateRightRequestDTOs(result, 'organization-unit', user),
    systemRights: mapBulkActionResultsToMutateRightRequestDTOs(result, 'it-system', user),
    contractRights: mapBulkActionResultsToMutateRightRequestDTOs(result, 'it-contract', user),
    dataProcessingRights: mapBulkActionResultsToMutateRightRequestDTOs(result, 'data-processing-registration', user),
  };
}

function mapBulkActionResultsToMutateRightRequestDTOs(
  result: BulkActionResult,
  type: RegistrationEntityTypes,
  user: ODataOrganizationUser
): APIMutateRightRequestDTO[] {
  if (!result.selectedEntityId) {
    throw new Error('Selected entity ID is undefined');
  }
  return result.selectedOptions[type].map((option) =>
    mapToToMutateRightRequestDTO(user.Uuid, option.id as number, result.selectedEntityId!)
  );
}
function mapToToMutateRightRequestDTO(userUuid: string, roleId: number, entityUuid: string): APIMutateRightRequestDTO {
  return { userUuid: userUuid, roleId: roleId, entityUuid: entityUuid };
}
