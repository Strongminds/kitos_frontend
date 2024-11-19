import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';
import {
  adaptGlobalAdminOptionType,
  GlobalAdminOptionTypeItem,
} from 'src/app/shared/models/options/global-admin-option-type.model';
import { GlobalAdminOptionTypeService } from 'src/app/shared/services/global-admin-option-type.service';

interface State {
  loading: boolean;
  countryCodes: GlobalAdminOptionTypeItem[];
}

@Injectable()
export class CreateOrganizationDialogComponentStore extends ComponentStore<State> {
  public readonly countryCodes$ = this.select((state) => state.countryCodes);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private globalAdminOptionTypesService: GlobalAdminOptionTypeService) {
    super({ loading: false, countryCodes: [] });
  }

  private readonly setCountryCodes = this.updater(
    (state, countryCodes: GlobalAdminOptionTypeItem[]): State => ({ ...state, countryCodes })
  );

  private readonly setLoading = this.updater((state, loading: boolean): State => ({ ...state, loading }));

  public getCountryCodes = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() => {
        return this.globalAdminOptionTypesService.getGlobalOptions('organization_country-code').pipe(
          tapResponse(
            (countryCodeDtos) => this.setCountryCodes(countryCodeDtos.map(adaptGlobalAdminOptionType)),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        );
      })
    )
  );
}
