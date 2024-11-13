import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, groupBy, map, mergeMap, of, switchMap } from 'rxjs';
import { GlobalAdminOptionTypeService } from 'src/app/shared/services/global-admin-option-type.service';
import { GlobalAdminActions, GlobalOptionTypeActions } from './actions';
import { APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';

@Injectable()
export class GlobalAdminOptionTypeEffects {
  constructor(
    private actions$: Actions,
    private globalOptionTypeService: GlobalAdminOptionTypeService,
    private globalUserService: APIV2GlobalUserInternalINTERNALService
  ) {}

  patchGlobalOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalOptionTypeActions.updateOptionType),
      groupBy((action) => action.optionUuid),
      mergeMap((group$) =>
        group$.pipe(
          concatMap((action) => {
            return this.globalOptionTypeService
              .patchGlobalOption(action.optionType, action.optionUuid, action.request)
              .pipe(
                map(() => GlobalOptionTypeActions.updateOptionTypeSuccess(action.optionType)),
                catchError(() => of(GlobalOptionTypeActions.updateOptionTypeError()))
              );
          })
        )
      )
    );
  });

  createGlobalOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalOptionTypeActions.createOptionType),
      switchMap((action) => {
        return this.globalOptionTypeService.createGlobalOption(action.optionType, action.request).pipe(
          map(() => GlobalOptionTypeActions.createOptionTypeSuccess(action.optionType)),
          catchError(() => of(GlobalOptionTypeActions.createOptionTypeError()))
        );
      })
    );
  });

  getGlobalAdmins$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.getGlobalAdmins),
      switchMap(() => {
        return this.globalUserService.getManyGlobalUserInternalV2GetGlobalAdmins().pipe(
          map((admins) => GlobalAdminActions.getGlobalAdminsSuccess(admins)),
          catchError(() => of(GlobalAdminActions.getGlobalAdminsError()))
        );
      })
    );
  });

  addGlobalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.addGlobalAdmin),
      switchMap(({ userUuid }) => {
        return this.globalUserService.postSingleGlobalUserInternalV2AddGlobalAdmin({ userUuid }).pipe(
          map((user) => GlobalAdminActions.addGlobalAdminSuccess(user)),
          catchError(() => of(GlobalAdminActions.addGlobalAdminError()))
        );
      })
    );
  });

  removeGlobalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.removeGlobalAdmin),
      switchMap(({ userUuid }) => {
        return this.globalUserService.deleteSingleGlobalUserInternalV2RemoveGlobalAdmin({ userUuid }).pipe(
          map(() => GlobalAdminActions.removeGlobalAdminSuccess(userUuid)),
          catchError(() => of(GlobalAdminActions.removeGlobalAdminError()))
        );
      })
    );
  });
}
