import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { GlobalAdminOptionTypeService } from "src/app/shared/services/global-admin-option-type.service";

@Injectable()
export class GlobalAdminOptionTypeEffects {
  constructor( private store: Store,
    private actions$: Actions,
    private globalOptionTypeService: GlobalAdminOptionTypeService) {}

    
}
