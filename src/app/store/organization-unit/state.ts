import { EntityState } from '@ngrx/entity';
import {
  APINamedEntityV2DTO,
  APINamedEntityWithEnabledStatusV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
} from 'src/app/api/v2';
import {
  PaymentRegistrationModel,
  RegistrationModel,
} from 'src/app/shared/models/organization-unit/organization-unit-registration.model';

export interface OrganizationUnitState extends EntityState<APIOrganizationUnitResponseDTO> {
  cacheTime: number | undefined;
  expandedNodeUuids: string[];

  registrations: APIOrganizationRegistrationUnitResponseDTO | undefined;
  isLoadingRegistrations: boolean;

  organizationUnitRights: Array<RegistrationModel<APINamedEntityWithUserFullNameV2DTO>>;
  itContractRegistrations: Array<RegistrationModel<APINamedEntityV2DTO>>;
  internalPayments: Array<PaymentRegistrationModel>;
  externalPayments: Array<PaymentRegistrationModel>;
  responsibleSystems: Array<RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>>;
  relevantSystems: Array<RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>>;
}
