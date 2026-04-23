import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { Observable, mergeMap, tap } from 'rxjs';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { OrganizationService } from 'src/app/shared/services/organization.service';

interface State {
  organizations?: APIOrganizationResponseDTO[];
  loading: boolean;
}

@Injectable()
export class ChooseOrganizationComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = 250;

  public readonly organizations$ = this.select((state) => state.organizations);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(@Inject(OrganizationService) private apiOrganizationService: OrganizationService) {
    super({ loading: false });
  }

  private updateOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): State => ({
      ...state,
      organizations,
    }),
  );

  private updateLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    }),
  );

  public getOrganizations = this.effect((organizationName$: Observable<string | undefined>) =>
    organizationName$.pipe(
      tap(() => this.updateLoading(true)),
      mergeMap((organizationName) =>
        this.apiOrganizationService
          .getV2Organizations({
            onlyWhereUserHasMembership: true,
            pageSize: this.PAGE_SIZE,
            nameContent: organizationName,
            orderByProperty: 'Name',
          })
          .pipe(
            tapResponse({
              next: (organizations) => this.updateOrganizations(organizations),
              error: (e) => console.error(e),
              complete: () => this.updateLoading(false),
            }),
          ),
      ),
    ),
  );
}
