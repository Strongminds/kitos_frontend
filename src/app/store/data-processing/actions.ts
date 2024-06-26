import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIDataProcessingRegistrationPermissionsResponseDTO,
  APIDataProcessingRegistrationResponseDTO,
  APIDataProcessorRegistrationSubDataProcessorResponseDTO,
  APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO,
  APIIdentityNamePairResponseDTO,
  APIOversightDateDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIUpdateDataProcessingRegistrationRequestDTO,
} from 'src/app/api/v2';
import { DataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { GridState } from 'src/app/shared/models/grid-state.model';

export const DataProcessingActions = createActionGroup({
  source: 'DataProcessing',
  events: {
    'Get Data Processing': (dataProcessingUuid: string) => ({ dataProcessingUuid }),
    'Get Data Processing Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({ dataProcessing }),
    'Get Data Processing Error': emptyProps(),

    'Get Data Processings': (odataString: string) => ({ odataString }),
    'Get Data Processings Success': (dataProcessings: DataProcessingRegistration[], total: number) => ({
      dataProcessings,
      total,
    }),
    'Get Data Processings Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),

    'Delete Data Processing': emptyProps(),
    'Delete Data Processing Success': emptyProps(),
    'Delete Data Processing Error': emptyProps(),

    'Patch Data Processing': (dataProcessing: APIUpdateDataProcessingRegistrationRequestDTO) => ({ dataProcessing }),
    'Patch Data Processing Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({ dataProcessing }),
    'Patch Data Processing Error': emptyProps(),

    'Create Data Processing': (name: string, openAfterCreate: boolean) => ({ name, openAfterCreate }),
    'Create Data Processing Success': (uuid: string, openAfterCreate: boolean) => ({ uuid, openAfterCreate }),
    'Create Data Processing Error': emptyProps(),

    'Get Data Processing Permissions': (dataProcessingUuid: string) => ({ dataProcessingUuid }),
    'Get Data Processing Permissions Success': (permissions: APIDataProcessingRegistrationPermissionsResponseDTO) => ({
      permissions,
    }),
    'Get Data Processing Permissions Error': emptyProps(),

    'Get Data Processing Collection Permissions': () => emptyProps(),
    'Get Data Processing Collection Permissions Success': (
      collectionPermissions: APIResourceCollectionPermissionsResponseDTO
    ) => ({ collectionPermissions }),
    'Get Data Processing Collection Permissions Error': emptyProps(),

    'Add Data Processing Role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Add Data Processing Role Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Add Data Processing Role Error': emptyProps(),

    'Remove Data Processing Role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Remove Data Processing Role Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Remove Data Processing Role Error': emptyProps(),

    'Add Data Processing Oversight Option': (
      oversight: APIIdentityNamePairResponseDTO,
      existingOversights: APIIdentityNamePairResponseDTO[] | undefined
    ) => ({ oversight, existingOversights }),
    'Remove Data Processing Oversight Option': (
      oversightUuid: string,
      existingOversights: APIIdentityNamePairResponseDTO[] | undefined
    ) => ({ oversightUuid, existingOversights }),

    'Add Data Processing Oversight Date': (
      oversightDate: APIOversightDateDTO,
      existingOversightDates: APIOversightDateDTO[] | undefined
    ) => ({ oversightDate, existingOversightDates }),
    'Remove Data Processing Oversight Date': (
      oversightDateUuid: string,
      existingOversightDates: APIOversightDateDTO[] | undefined
    ) => ({ oversightDateUuid, existingOversightDates }),
    'Patch Data Processing Oversight Date': (
      oversightDate: APIOversightDateDTO,
      existingOversightDates: APIOversightDateDTO[] | undefined
    ) => ({ oversightDate, existingOversightDates }),

    'Add Data Processing Third Country': (
      country: APIIdentityNamePairResponseDTO,
      existingCountries: APIIdentityNamePairResponseDTO[] | undefined
    ) => ({ country, existingCountries }),
    'Delete Data Processing Third Country': (
      countryUuid: string,
      existingCountries: APIIdentityNamePairResponseDTO[] | undefined
    ) => ({ countryUuid, existingCountries }),

    'Add Data Processing Processor': (
      processor: APIIdentityNamePairResponseDTO,
      existingProcessors: APIIdentityNamePairResponseDTO[] | undefined
    ) => ({ processor, existingProcessors }),
    'Delete Data Processing Processor': (
      processorUuid: string,
      existingProcessors: APIIdentityNamePairResponseDTO[] | undefined
    ) => ({ processorUuid, existingProcessors }),

    'Add Data Processing Sub Processor': (
      subprocessor: APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO,
      existingSubProcessors: APIDataProcessorRegistrationSubDataProcessorResponseDTO[] | undefined
    ) => ({ subprocessor, existingSubProcessors }),
    'Delete Data Processing Sub Processor': (
      subProcessorUuid: string,
      existingSubProcessors: APIDataProcessorRegistrationSubDataProcessorResponseDTO[] | undefined
    ) => ({ subProcessorUuid, existingSubProcessors }),
    'Patch Data Processing Sub Processor': (
      subprocessor: APIDataProcessorRegistrationSubDataProcessorWriteRequestDTO,
      existingSubProcessors: APIDataProcessorRegistrationSubDataProcessorResponseDTO[] | undefined
    ) => ({ subprocessor, existingSubProcessors }),

    'Add Data Processing System Usage': (systemUsageUuid: string, existingSystemUsageUuids: string[] | undefined) => ({
      systemUsageUuid,
      existingSystemUsageUuids,
    }),
    'Delete Data Processing System Usage': (
      systemUsageUuid: string,
      existingSystemUsageUuids: string[] | undefined
    ) => ({ systemUsageUuid, existingSystemUsageUuids }),

    'Remove External Reference': (referenceUuid: string) => ({ referenceUuid }),
    'Remove External Reference Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Remove External Reference Error': () => emptyProps(),

    'Add External Reference': (externalReference: ExternalReferenceProperties) => ({ externalReference }),
    'Add External Reference Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Add External Reference Error': () => emptyProps(),

    'Edit External Reference': (referenceUuid: string, externalReference: ExternalReferenceProperties) => ({
      referenceUuid,
      externalReference,
    }),
    'Edit External Reference Success': (dataProcessing: APIDataProcessingRegistrationResponseDTO) => ({
      dataProcessing,
    }),
    'Edit External Reference Error': () => emptyProps(),
  },
});
