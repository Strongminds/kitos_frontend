import { EntityState } from '@ngrx/entity';
import {
  APINamedEntityV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
  APIUnitAccessRightsResponseDTO,
  APIUnitAccessRightsWithUnitDataResponseDTO,
} from 'src/app/api/v2';
import { Cached } from 'src/app/shared/models/cache-item.model';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';

export interface OrganizationUnitState extends EntityState<APIOrganizationUnitResponseDTO> {
  cacheTime: number | undefined;
  expandedNodeUuids: string[];
  currentUnitUuid: string;

  pagedUnitsCacheTime: number | undefined;
  pagedUnits: APIOrganizationUnitResponseDTO[] | undefined;

  registrations: APIOrganizationRegistrationUnitResponseDTO | undefined;
  isLoadingRegistrations: boolean;

  permissions: Cached<APIUnitAccessRightsResponseDTO> | undefined;
  collectionPermissions: Cached<APIUnitAccessRightsWithUnitDataResponseDTO> | undefined;

  organizationUnitRights: Array<RegistrationModel<APINamedEntityWithUserFullNameV2DTO>>;
  itContractRegistrations: Array<RegistrationModel<APINamedEntityV2DTO>>;
  internalPayments: Array<PaymentRegistrationModel>;
  externalPayments: Array<PaymentRegistrationModel>;
  responsibleSystems: Array<RegistrationModel<APINamedEntityV2DTO>>;
  relevantSystems: Array<RegistrationModel<APINamedEntityV2DTO>>;
}
