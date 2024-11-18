import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Observable, switchMap, tap } from 'rxjs';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RegularOptionTypeService } from 'src/app/shared/services/regular-option-type.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  optionTypes: APIRegularOptionResponseDTO[] | undefined;
}

@Injectable()
export class OptionTypeDropdownComponentStore extends ComponentStore<State> {
  public readonly optionTypes$ = this.select((state) => state.optionTypes);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private optionTypeService: RegularOptionTypeService, private store: Store) {
    super({ optionTypes: undefined, loading: false });
  }

  private readonly setOptionTypes = this.updater(
    (state, optionTypes: APIRegularOptionResponseDTO[]): State => ({ ...state, optionTypes })
  );

  private readonly setLoading = this.updater((state, loading: boolean): State => ({ ...state, loading }));

  public getOptionTypes = this.effect((optionType$: Observable<RegularOptionType>) => {
    return optionType$.pipe(
      tap(() => this.setLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([optionType, organizationUuid]) => {
        return this.optionTypeService.getAvailableOptions(organizationUuid, optionType).pipe(
          tapResponse(
            (optionTypes) => this.setOptionTypes(optionTypes),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        );
      })
    );
  });
}
