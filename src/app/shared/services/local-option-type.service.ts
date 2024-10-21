import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  APILocalRegularOptionResponseDTO,
  APILocalRegularOptionUpdateRequestDTO,
  APILocalRoleOptionResponseDTO,
  APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService,
  APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService,
  APIV2ItSystemLocalArchiveTypesInternalINTERNALService,
  APIV2ItSystemLocalBusinessTypesInternalINTERNALService,
  APIV2ItSystemLocalDataTypesInternalINTERNALService,
  APIV2ItSystemLocalFrequencyTypesInternalINTERNALService,
  APIV2ItSystemLocalInterfaceTypesInternalINTERNALService,
  APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService,
  APIV2ItSystemLocalRegisterTypesInternalINTERNALService,
  APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService,
  APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService,
  APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { LocalOptionType } from '../models/options/local-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class LocalOptionTypeService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(
    private store: Store,
    @Inject(APIV2ItSystemLocalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemLocalBusinessTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalArchiveTypesInternalINTERNALService)
    private archiveTypeService: APIV2ItSystemLocalArchiveTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService)
    private archiveLocationService: APIV2ItSystemLocalArchiveLocationTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService)
    private archiveTestLocationService: APIV2ItSystemLocalArchiveTestLocationTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalDataTypesInternalINTERNALService)
    private dataTypeService: APIV2ItSystemLocalDataTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalFrequencyTypesInternalINTERNALService)
    private frequencyTypeService: APIV2ItSystemLocalFrequencyTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalInterfaceTypesInternalINTERNALService)
    private interfaceTypeService: APIV2ItSystemLocalInterfaceTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService)
    private sensitivePersonalDataTypeService: APIV2ItSystemLocalSensitivePersonalDataTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService)
    private itSystemCategoryService: APIV2ItSystemLocalItSystemCategoriesTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalRegisterTypesInternalINTERNALService)
    private registerTypeService: APIV2ItSystemLocalRegisterTypesInternalINTERNALService,
    @Inject(APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService)
    private organiztionUnitRoleService: APIV2OrganizationUnitLocalRoleOptionTypesInternalINTERNALService,
    @Inject(APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService)
    private itSystemRoleService: APIV2ItSystemLocalRoleOptionTypesInternalINTERNALService
  ) {}

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getLocalOptions(
    organizationUuid: string,
    optionType: LocalOptionType
  ): Observable<Array<APILocalRegularOptionResponseDTO>> {
    return this.resolveGetLocalOptionsEndpoint(optionType)(organizationUuid);
  }

  public patchLocalOption(
    optionType: LocalOptionType,
    organizationUuid: string,
    optionUuid: string,
    request: APILocalRegularOptionUpdateRequestDTO
  ) {
    return this.resolvePatchLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid, request);
  }

  public patchIsActive(optionType: LocalOptionType, organizationUuid: string, optionUuid: string, isActive: boolean) {
    if (isActive) {
      return this.resolveCreateLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
    } else {
      return this.resolveDeleteLocalOptionsEndpoint(optionType)(organizationUuid, optionUuid);
    }
  }

  private resolveGetLocalOptionsEndpoint(
    optionType: LocalOptionType
  ): (organizationUuid: string) => Observable<Array<APILocalRoleOptionResponseDTO>> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid) =>
          this.businessTypeService.getManyItSystemLocalBusinessTypesInternalV2GetLocalBusinessTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid) =>
          this.archiveTypeService.getManyItSystemLocalArchiveTypesInternalV2GetLocalArchiveTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid) =>
          this.archiveLocationService.getManyItSystemLocalArchiveLocationTypesInternalV2GetLocalArchiveLocationTypes({
            organizationUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid) =>
          this.archiveTestLocationService.getManyItSystemLocalArchiveTestLocationTypesInternalV2GetLocalArchiveTestLocationTypes(
            {
              organizationUuid,
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid) =>
          this.dataTypeService.getManyItSystemLocalDataTypesInternalV2GetLocalDataTypes({
            organizationUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid) =>
          this.frequencyTypeService.getManyItSystemLocalFrequencyTypesInternalV2GetLocalRelationFrequencyTypes({
            organizationUuid,
          });
      case 'it-interface_interface-type':
        return (organizationUuid) =>
          this.interfaceTypeService.getManyItSystemLocalInterfaceTypesInternalV2GetLocalInterfaceTypes({
            organizationUuid,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid) =>
          this.sensitivePersonalDataTypeService.getManyItSystemLocalSensitivePersonalDataTypesInternalV2GetLocalSensitivePersonalDataTypes(
            {
              organizationUuid,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid) =>
          this.itSystemCategoryService.getManyItSystemLocalItSystemCategoriesTypesInternalV2GetLocalItSystemCategoryTypes(
            {
              organizationUuid,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid) =>
          this.registerTypeService.getManyItSystemLocalRegisterTypesInternalV2GetLocalRegisterTypes({
            organizationUuid,
          });

      //Role option types
      case 'organization-unit':
        return (organizationUuid) =>
          this.organiztionUnitRoleService.getManyOrganizationUnitLocalRoleOptionTypesInternalV2GetLocalOrganizationUnitRoles(
            {
              organizationUuid,
            }
          );
      case 'it-system-usage':
        return (organizationUuid) =>
          this.itSystemRoleService.getManyItSystemLocalRoleOptionTypesInternalV2GetLocalItSystemRoles({
            organizationUuid,
          });
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchLocalOptionsEndpoint(optionType: LocalOptionType) {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.businessTypeService.patchSingleItSystemLocalBusinessTypesInternalV2PatchLocalBusinessType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveTypeService.patchSingleItSystemLocalArchiveTypesInternalV2PatchLocalArchiveType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveLocationService.patchSingleItSystemLocalArchiveLocationTypesInternalV2PatchArchiveLocationType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.archiveTestLocationService.patchSingleItSystemLocalArchiveTestLocationTypesInternalV2PatchLocalArchiveTestLocationType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.dataTypeService.patchSingleItSystemLocalDataTypesInternalV2PatchLocalDataType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.frequencyTypeService.patchSingleItSystemLocalFrequencyTypesInternalV2PatchLocalRelationFrequencyType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it-interface_interface-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.interfaceTypeService.patchSingleItSystemLocalInterfaceTypesInternalV2PatchLocalInterfaceType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.sensitivePersonalDataTypeService.patchSingleItSystemLocalSensitivePersonalDataTypesInternalV2PatchLocalSensitivePersonalDataType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemCategoryService.patchSingleItSystemLocalItSystemCategoriesTypesInternalV2PatchLocalItSystemCategoryType(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.registerTypeService.patchSingleItSystemLocalRegisterTypesInternalV2PatchLocalRegisterType({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      //Role option types
      case 'organization-unit':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.organiztionUnitRoleService.patchSingleOrganizationUnitLocalRoleOptionTypesInternalV2PatchLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
              dto: request,
            }
          );
      case 'it-system-usage':
        return (organizationUuid: string, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemLocalRoleOptionTypesInternalV2PatchLocalItSystemRole({
            organizationUuid,
            optionUuid,
            dto: request,
          });
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  private resolveCreateLocalOptionsEndpoint(
    optionType: LocalOptionType
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.postSingleItSystemLocalBusinessTypesInternalV2CreateLocalBusinessType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTypeService.postSingleItSystemLocalArchiveTypesInternalV2CreateLocalArchiveType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid, optionUuid) =>
          this.archiveLocationService.postSingleItSystemLocalArchiveLocationTypesInternalV2CreateArchiveLocationType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTestLocationService.postSingleItSystemLocalArchiveTestLocationTypesInternalV2CreateLocalArchiveTestLocationType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid, optionUuid) =>
          this.dataTypeService.postSingleItSystemLocalDataTypesInternalV2CreateLocalDataType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid, optionUuid) =>
          this.frequencyTypeService.postSingleItSystemLocalFrequencyTypesInternalV2CreateLocalRelationFrequencyType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it-interface_interface-type':
        return (organizationUuid, optionUuid) =>
          this.interfaceTypeService.postSingleItSystemLocalInterfaceTypesInternalV2CreateLocalInterfaceType({
            organizationUuid,
            dto: { optionUuid },
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid, optionUuid) =>
          this.sensitivePersonalDataTypeService.postSingleItSystemLocalSensitivePersonalDataTypesInternalV2CreateLocalSensitivePersonalDataType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemCategoryService.postSingleItSystemLocalItSystemCategoriesTypesInternalV2CreateLocalItSystemCategoryType(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid, optionUuid) =>
          this.registerTypeService.postSingleItSystemLocalRegisterTypesInternalV2CreateLocalRegisterType({
            organizationUuid,
            dto: { optionUuid },
          });
      //Role option types
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitRoleService.postSingleOrganizationUnitLocalRoleOptionTypesInternalV2CreateLocalOrganizationUnitRole(
            {
              organizationUuid,
              dto: { optionUuid },
            }
          );
      case 'it-system-usage':
        return (organizationUuid, optionUuid) =>
          this.itSystemRoleService.postSingleItSystemLocalRoleOptionTypesInternalV2CreateLocalItSystemRole({
            organizationUuid,
            dto: { optionUuid },
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }

  private resolveDeleteLocalOptionsEndpoint(
    optionType: LocalOptionType
  ): (organizationUuid: string, optionUuid: string) => Observable<APILocalRoleOptionResponseDTO> {
    switch (optionType) {
      //It system regular option types
      case 'it-system_business-type':
        return (organizationUuid, optionUuid) =>
          this.businessTypeService.deleteSingleItSystemLocalBusinessTypesInternalV2DeleteLocalBusinessType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-archive-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTypeService.deleteSingleItSystemLocalArchiveTypesInternalV2DeleteLocalArchiveType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-archive-location-type':
        return (organizationUuid, optionUuid) =>
          this.archiveLocationService.deleteSingleItSystemLocalArchiveLocationTypesInternalV2DeleteArchiveLocationType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-archive-location-test-type':
        return (organizationUuid, optionUuid) =>
          this.archiveTestLocationService.deleteSingleItSystemLocalArchiveTestLocationTypesInternalV2DeleteLocalArchiveTestLocationType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-interface_data-type':
        return (organizationUuid, optionUuid) =>
          this.dataTypeService.deleteSingleItSystemLocalDataTypesInternalV2DeleteLocalDataType({
            organizationUuid,
            optionUuid,
          });
      case 'it-system_usage-relation-frequency-type':
        return (organizationUuid, optionUuid) =>
          this.frequencyTypeService.deleteSingleItSystemLocalFrequencyTypesInternalV2DeleteLocalRelationFrequencyType({
            organizationUuid,
            optionUuid,
          });
      case 'it-interface_interface-type':
        return (organizationUuid, optionUuid) =>
          this.interfaceTypeService.deleteSingleItSystemLocalInterfaceTypesInternalV2DeleteLocalInterfaceType({
            organizationUuid,
            optionUuid,
          });
      case 'it_system_usage-gdpr-sensitive-data-type':
        return (organizationUuid, optionUuid) =>
          this.sensitivePersonalDataTypeService.deleteSingleItSystemLocalSensitivePersonalDataTypesInternalV2DeleteLocalSensitivePersonalDataType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-system_usage-data-classification-type':
        return (organizationUuid, optionUuid) =>
          this.itSystemCategoryService.deleteSingleItSystemLocalItSystemCategoriesTypesInternalV2DeleteLocalItSystemCategoryType(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it_system_usage-gdpr-registered-data-category-type':
        return (organizationUuid, optionUuid) =>
          this.registerTypeService.deleteSingleItSystemLocalRegisterTypesInternalV2DeleteLocalRegisterType({
            organizationUuid,
            optionUuid,
          });

      //Role option types
      case 'organization-unit':
        return (organizationUuid, optionUuid) =>
          this.organiztionUnitRoleService.deleteSingleOrganizationUnitLocalRoleOptionTypesInternalV2DeleteLocalOrganizationUnitRole(
            {
              organizationUuid,
              optionUuid,
            }
          );
      case 'it-system-usage':
        return (organizationUuid, optionUuid) =>
          this.itSystemRoleService.deleteSingleItSystemLocalRoleOptionTypesInternalV2DeleteLocalItSystemRole({
            organizationUuid,
            optionUuid,
          });
      default:
        throw new Error(`Delete operation is not supported for ${optionType}`);
    }
  }
}
