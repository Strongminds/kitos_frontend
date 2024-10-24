import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LocalOptionTypeActions } from './actions';
import { selectOrganizationUuid } from '../user-store/selectors';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { catchError, concatMap, first, groupBy, map, mergeMap, of, switchMap } from 'rxjs';
import { LocalOptionTypeService } from 'src/app/shared/services/local-option-type.service';

@Injectable()
export class LocalOptionTypeEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private localOptionTypeService: LocalOptionTypeService
  ) {}

  patchOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalOptionTypeActions.uppdateOptionType, LocalOptionTypeActions.updateOptionTypeActiveStatus),
      groupBy((action) => action.optionUuid),
      mergeMap((group$) =>
        group$.pipe(
          concatMap((action) => {
            return this.store.select(selectOrganizationUuid).pipe(
              filterNullish(),
              first(),
              switchMap((organizationUuid) => {
                if (action.type === LocalOptionTypeActions.uppdateOptionType.type) {
                  return this.localOptionTypeService.patchLocalOption(
                    action.optionType,
                    organizationUuid,
                    action.optionUuid,
                    action.request
                  );
                } else {
                  return this.localOptionTypeService.patchIsActive(
                    action.optionType,
                    organizationUuid,
                    action.optionUuid,
                    action.isActive
                  );
                }
              }),
              map(() => LocalOptionTypeActions.updateOptionTypeSuccess(action.optionType)),
              catchError(() => of(LocalOptionTypeActions.updateOptionTypeError()))
            );
          })
        )
      )
    );
  });
}
