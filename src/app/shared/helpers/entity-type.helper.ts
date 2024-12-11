import { APINotificationResponseDTO } from 'src/app/api/v2';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

export function mapEntityTypeToOwnerResourceType(
  entityType: RegistrationEntityTypes
): APINotificationResponseDTO.OwnerResourceTypeEnum {
  switch (entityType) {
    case 'it-system-usage':
      return APINotificationResponseDTO.OwnerResourceTypeEnum.ItSystemUsage;
    case 'it-contract':
      return APINotificationResponseDTO.OwnerResourceTypeEnum.ItContract;
    case 'data-processing-registration':
      return APINotificationResponseDTO.OwnerResourceTypeEnum.DataProcessingRegistration;
    default:
      throw new Error(`Owner resource type for entity type: ${entityType} does not exist`);
  }
}
