import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIGlobalRoleOptionResponseDTO,
  APIGlobalRoleOptionUpdateRequestDTO,
  APIV2ItSystemGlobalBusinessTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalAdminOptionTypeService {
  constructor(
    @Inject(APIV2ItSystemGlobalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemGlobalBusinessTypesInternalINTERNALService
  ) {}

  public getGlobalOptions(optionType: GlobalAdminOptionType): Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    return this.resolveGetGlobalOptionsEndpoint(optionType)();
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
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }

  private resolvePatchGlobalOptionEndpoint(optionType: GlobalAdminOptionType) {
    switch (optionType) {
      case 'it-system_business-type':
        return (optionUuid: string, request: APIGlobalRoleOptionUpdateRequestDTO) =>
          this.businessTypeService.patchSingleItSystemGlobalBusinessTypesInternalV2PatchGlobalBusinessType({
            optionUuid,
            dto: request,
          });
      default:
        throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }
}
