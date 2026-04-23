import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable, tap } from 'rxjs';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { OrganizationService } from 'src/app/shared/services/organization.service';

interface State {
  organizations: APIOrganizationResponseDTO[];
  loading: boolean;
}

@Injectable()
export class OrganizationDropdownComponentStore extends ComponentStore<State> {
  public readonly organizations$ = this.select((state) => state.organizations);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(@Inject(OrganizationService) private organizationService: OrganizationService) {
    super({ organizations: [], loading: false });
  }

  private setOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): State => ({
      ...state,
      organizations: organizations,
    }),
  );

  private setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    }),
  );

  public searchOrganizations = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((search) => {
        return this.organizationService
          .getV2Organizations({
            nameOrCvrContent: search,
          })
          .pipe(
            tapResponse({
              next: (filteredOrganizations) => this.setOrganizations(filteredOrganizations),
              error: (error) => console.error(error),
              complete: () => this.setLoading(false),
            }),
          );
      }),
    ),
  );
}
