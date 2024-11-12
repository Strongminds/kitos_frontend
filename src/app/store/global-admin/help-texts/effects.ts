import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { APIV2HelpTextsInternalINTERNALService } from "src/app/api/v2/api/v2HelpTextsInternalINTERNAL.service";
import { HelpTextActions } from "./actions";

@Injectable()
export class GlobalAdminHelpTextsEffects {
  constructor(private actions$: Actions, @Inject(APIV2HelpTextsInternalINTERNALService) private helpTextsInternalService: APIV2HelpTextsInternalINTERNALService) {}

  getHelpTexts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.getHelpTexts),
      switchMap(() => {
        return this.helpTextsInternalService.getManyHelpTextsInternalV2Get().pipe(
          map((helpTexts) => HelpTextActions.getHelpTextsSuccess(helpTexts)),
          catchError(() => of(HelpTextActions.getHelpTextsError()))
        );
      })
    );
  });

  createHelpText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.createHelpText),
      switchMap(({ request }) => {
        return this.helpTextsInternalService.postSingleHelpTextsInternalV2Post({ dto: request }).pipe(
          map((helpText) => HelpTextActions.createHelpTextSuccess(helpText)),
          catchError(() => of(HelpTextActions.createHelpTextError()))
        );
      })
    );
  });

  patchHelpText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.updateHelpText),
      switchMap(({ key, request }) => {
        return this.helpTextsInternalService.patchSingleHelpTextsInternalV2PatchByKey({ key, dto: request }).pipe(
          map((helpText) => HelpTextActions.updateHelpTextSuccess(helpText)),
          catchError(() => of(HelpTextActions.updateHelpTextError()))
        );
      })
    );
  });

  deleteHelpText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.deleteHelpText),
      switchMap(({ key }) => {
        return this.helpTextsInternalService.deleteSingleHelpTextsInternalV2DeleteByKey({ key }).pipe(
          map(() => HelpTextActions.deleteHelpTextSuccess()),
          catchError(() => of(HelpTextActions.deleteHelpTextError()))
        );
      })
    );
  });
}
