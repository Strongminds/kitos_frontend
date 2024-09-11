import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIChangeOrganizationUnitRegistrationV2RequestDTO,
  APICreateOrganizationUnitRequestDTO,
  APINamedEntityV2DTO,
  APINamedEntityWithEnabledStatusV2DTO,
  APINamedEntityWithUserFullNameV2DTO,
  APIOrganizationRegistrationUnitResponseDTO,
  APIOrganizationUnitResponseDTO,
  APITransferOrganizationUnitRegistrationV2RequestDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';
import { OrganizationUnitRegistrationTypes } from 'src/app/shared/models/organization-unit/organization-unit-registration-type';
import { RegistrationModel } from 'src/app/shared/models/organization-unit/organization-unit-registration.model';

export const OrganizationUnitActions = createActionGroup({
  source: 'OrganizationUnit',
  events: {
    'Get organization units': (pageSize?: number, currentPage?: number, units?: APIOrganizationUnitResponseDTO[]) => ({
      units,
      currentPage,
      pageSize,
    }),
    'Get organization units Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units Error': emptyProps(),

    'Get hierarchy': (organizationUuid: string) => ({ organizationUuid }),
    'Get hierarchy Success': (hierarchy: APIOrganizationUnitResponseDTO[]) => ({ hierarchy }),
    'Get hierarchy Error': emptyProps(),

    'Create organization subunit': (subunitToCreate: APICreateOrganizationUnitRequestDTO) => ({ subunitToCreate }),
    'Create organization subunit Success': (unit: APIOrganizationUnitResponseDTO) => ({ unit }),
    'Create organization subunit Error': emptyProps(),

    'Patch organization unit': (unitUuid: string, request: APIUpdateOrganizationUnitRequestDTO) => ({
      unitUuid,
      request,
    }),
    'Patch organization unit Success': (unit: APIOrganizationUnitResponseDTO) => ({ unit }),
    'Patch organization unit Error': emptyProps(),

    'Update hierarchy': (unit: APIOrganizationUnitResponseDTO, units: APIOrganizationUnitResponseDTO[]) => ({
      unit,
      units,
    }),
    'Add expanded node': (uuid: string) => ({ uuid }),
    'Remove expanded node': (uuid: string) => ({ uuid }),

    'Get registrations': (unitUuid: string) => ({ unitUuid }),
    'Get registrations Success': (registrations: APIOrganizationRegistrationUnitResponseDTO) => ({ registrations }),
    'Get registrations Error': emptyProps(),

    'Remove registrations': (unitUuid: string, request: APIChangeOrganizationUnitRegistrationV2RequestDTO) => ({
      unitUuid,
      request,
    }),
    'Remove registrations Success': (removedRegistrations: APIChangeOrganizationUnitRegistrationV2RequestDTO) => ({
      removedRegistrations,
    }),
    'Remove registrations Error': emptyProps(),

    'Transfer registrations': (unitUuid: string, request: APITransferOrganizationUnitRegistrationV2RequestDTO) => ({
      unitUuid,
      request,
    }),
    'Transfer registrations Success': (
      transferedRegistrations: APITransferOrganizationUnitRegistrationV2RequestDTO
    ) => ({ transferedRegistrations }),
    'Transfer registrations Error': emptyProps(),

    'Change organization unit registration select': (
      registration: RegistrationModel<APINamedEntityWithUserFullNameV2DTO>
    ) => ({ registration }),
    'Change it contract registration select': (registration: RegistrationModel<APINamedEntityV2DTO>) => ({
      registration,
    }),
    'Change internal payment select': (registration: RegistrationModel<APINamedEntityV2DTO>, contractId: number) => ({
      registration,
      contractId,
    }),
    'Change external payment select': (registration: RegistrationModel<APINamedEntityV2DTO>, contractId: number) => ({
      registration,
      contractId,
    }),
    'Change responsible system select': (registration: RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>) => ({
      registration,
    }),
    'Change relevant system select': (registration: RegistrationModel<APINamedEntityWithEnabledStatusV2DTO>) => ({
      registration,
    }),

    'Change collection select': (value: boolean, registrationType: OrganizationUnitRegistrationTypes) => ({
      value,
      registrationType,
    }),
    'Change all select': (value: boolean) => ({ value }),
  },
});
