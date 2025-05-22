import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { RoleOptionTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class RoleOptionTypeEffects {
  constructor(private actions$: Actions, private store: Store, private roleService: RoleOptionTypeService) {}

  getOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleOptionTypeActions.getOptions),
      concatLatestFrom(({ optionType }) => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectHasValidCache(optionType)),
      ]),
      mergeMap(([{ optionType }, organizationUuid, validCache]) => {
        if (!organizationUuid) return of(); // skip if no org
        if (validCache) {
          // Dispatch a "cache hit" or similar action if you want
          return of(RoleOptionTypeActions.updateLoadingOnValidCache(optionType));
        }
        // Otherwise, fetch from API
        return this.roleService.getAvailableOptions(organizationUuid, optionType).pipe(
          map((response) => RoleOptionTypeActions.getOptionsSuccess(optionType, response)),
          catchError(() => of(RoleOptionTypeActions.getOptionsError(optionType)))
        );
      })
    );
  });
}
