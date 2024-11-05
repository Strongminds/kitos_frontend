import { Inject, Injectable } from "@angular/core";
import { APIGlobalRegularOptionResponseDTO, APIV2ItSystemGlobalBusinessTypesInternalINTERNALService } from "src/app/api/v2";
import { AdminOptionType } from "../models/options/admin-option-type.model";
import { Observable } from "rxjs";

@Injectable()
export class GlobalAdminOptionTypeService {
  constructor(
    @Inject(APIV2ItSystemGlobalBusinessTypesInternalINTERNALService)
    private businessTypeService: APIV2ItSystemGlobalBusinessTypesInternalINTERNALService
  ) {}

  public getGlobalRegularOptions(
    optionType: AdminOptionType
  ): Observable<Array<APIGlobalRegularOptionResponseDTO>> {
    return this.resolveGetGlobalRegularOptionsEndpoint(optionType)();
  }

  private resolveGetGlobalRegularOptionsEndpoint(optionType: AdminOptionType)
  :  () => Observable<Array<APIGlobalRegularOptionResponseDTO>>{
    switch (optionType) {
      case 'it-system_business-type':
        return () =>
          this.businessTypeService.getManyItSystemGlobalBusinessTypesInternalV2GetBusinessTypes();
        default:
          throw new Error(`Get operation is not supported for ${optionType}`);
    }
  }


}
