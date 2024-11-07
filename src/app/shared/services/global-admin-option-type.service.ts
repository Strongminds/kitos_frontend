import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIGlobalRoleOptionCreateRequestDTO,
  APIGlobalRoleOptionResponseDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
  APIV2ItSystemGlobalBusinessTypesInternalINTERNALService,
  APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalAdminOptionTypeService {
  constructor(
    @Inject(APIV2ItSystemGlobalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemGlobalBusinessTypesInternalINTERNALService,
    @Inject(APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService)
    private itSystemRoleService: APIV2ItSystemGlobalRoleOptionTypesInternalINTERNALService
  ) {}

  public getGlobalOptions(optionType: GlobalAdminOptionType): Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    return this.resolveGetGlobalOptionsEndpoint(optionType)();
  }

  public createGlobalOption(optionType: GlobalAdminOptionType, request: APIGlobalRoleOptionUpdateRequestDTO) {
    return this.resolveCreateGlobalOptionEndpoint(optionType)(request);
  }

  public patchGlobalOption(
    optionType: GlobalAdminOptionType,
    optionUuid: string,
    request: APIGlobalRoleOptionUpdateRequestDTO
  ) {
    return this.resolvePatchGlobalOptionEndpoint(optionType)(optionUuid, request);
  }

  private resolveGetGlobalOptionsEndpoint(
    optionType: GlobalAdminOptionType
  ): () => Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system_business-type':
        return () => this.businessTypeService.getManyItSystemGlobalBusinessTypesInternalV2GetBusinessTypes();
      case 'it-system-usage':
        return () => this.itSystemRoleService.getManyItSystemGlobalRoleOptionTypesInternalV2GetItSystemRoles();
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchGlobalOptionEndpoint(optionType: GlobalAdminOptionType) {
    switch (optionType) {
      case 'it-system_business-type':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.businessTypeService.patchSingleItSystemGlobalBusinessTypesInternalV2PatchGlobalBusinessType({
            optionUuid,
            dto,
          });
      case 'it-system-usage':
        return (optionUuid: string, dto: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.itSystemRoleService.patchSingleItSystemGlobalRoleOptionTypesInternalV2PatchGlobalBItSystemRole({
            optionUuid,
            dto,
          });
      default:
        throw new Error(`Patch operation is not supported for ${optionType}`);
    }
  }

  private resolveCreateGlobalOptionEndpoint(optionType: GlobalAdminOptionType) {
    switch (optionType) {
      case 'it-system_business-type':
        return (request: APIGlobalRoleOptionCreateRequestDTO) =>
          this.businessTypeService.postSingleItSystemGlobalBusinessTypesInternalV2CreateBusinessType({
            dto: request,
          });
      case 'it-system-usage':
        return (dto: APIGlobalRoleOptionCreateRequestDTO) =>
          this.itSystemRoleService.postSingleItSystemGlobalRoleOptionTypesInternalV2CreateItSystemRole({
            dto,
          });
      default:
        throw new Error(`Create operation is not supported for ${optionType}`);
    }
  }
}
