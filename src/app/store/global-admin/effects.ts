import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, groupBy, map, mergeMap, of } from 'rxjs';
import { GlobalAdminOptionTypeService } from 'src/app/shared/services/global-admin-option-type.service';
import { GlobalOptionTypeActions } from './actions';

@Injectable()
export class GlobalAdminOptionTypeEffects {
  constructor(private actions$: Actions, private globalOptionTypeService: GlobalAdminOptionTypeService) {}

  patchOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalOptionTypeActions.updateRegularOptionType),
      groupBy((action) => action.optionUuid),
      mergeMap((group$) =>
        group$.pipe(
          concatMap((action) => {
            return this.globalOptionTypeService
              .patchGlobalOption(action.optionType, action.optionUuid, action.request)
              .pipe(
                map(() => GlobalOptionTypeActions.updateRegularOptionTypeSuccess(action.optionType)),
                catchError(() => of(GlobalOptionTypeActions.updateRegularOptionTypeError()))
              );
          })
        )
      )
    );
  });
}
