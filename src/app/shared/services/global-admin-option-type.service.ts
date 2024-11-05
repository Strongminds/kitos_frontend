import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  APIGlobalRoleOptionResponseDTO,
  APIV2ItSystemGlobalBusinessTypesInternalINTERNALService,
} from 'src/app/api/v2';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';

@Injectable()
export class GlobalAdminOptionTypeService {
  constructor(
    @Inject(APIV2ItSystemGlobalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemGlobalBusinessTypesInternalINTERNALService
  ) {}

  public getGlobalOptions(optionType: GlobalAdminOptionType): Observable<Array<APIGlobalRoleOptionResponseDTO>> {
    return this.resolveGetGlobalOptionsEndpoint(optionType)();
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
}
