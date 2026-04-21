import { APIOwnerResourceType } from 'src/app/api/v2';
import { RelatedEntityType } from 'src/app/store/alerts/state';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

export function mapEntityTypeToOwnerResourceType(entityType: RegistrationEntityTypes): APIOwnerResourceType {
  switch (entityType) {
    case 'it-system-usage':
      return APIOwnerResourceType.NUMBER_1;
    case 'it-contract':
      return APIOwnerResourceType.NUMBER_0;
    case 'data-processing-registration':
      return APIOwnerResourceType.NUMBER_2;
    default:
      throw new Error(`Owner resource type for entity type: ${entityType} does not exist`);
  }
}

export function mapEntityTypeToRelatedEntityType(entityType: RegistrationEntityTypes): RelatedEntityType {
  switch (entityType) {
    case 'it-system-usage':
      return RelatedEntityType.ItSystemUsage;
    case 'it-contract':
      return RelatedEntityType.ItContract;
    case 'data-processing-registration':
      return RelatedEntityType.DataProcessingRegistration;
    default:
      throw new Error(`Related entity type for entity type: ${entityType} does not exist`);
  }
}

export function mapRelatedEntityTypeToDTO(
  entityType: RelatedEntityType,
): 'itContract' | 'itSystemUsage' | 'dataProcessingRegistration' {
  switch (entityType) {
    case RelatedEntityType.ItSystemUsage:
      return 'itSystemUsage';
    case RelatedEntityType.ItContract:
      return 'itContract';
    case RelatedEntityType.DataProcessingRegistration:
      return 'dataProcessingRegistration';
    default:
      throw new Error(`Related entity type for entity type: ${entityType} does not exist`);
  }
}
