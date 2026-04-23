import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { Observable, mergeMap } from 'rxjs';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationService } from 'src/app/shared/services/organization.service';

interface State {
  organizationsIsLoading: boolean;
  organizations?: Array<APIOrganizationResponseDTO>;
}

@Injectable()
export class ItSystemUsageDetailsArchivingComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly supplierOrganizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly supplierOrganizationsIsLoading$ = this.select((state) => state.organizationsIsLoading).pipe(
    filterNullish(),
  );

  constructor(@Inject(OrganizationService) private organizationService: OrganizationService) {
    super({ organizationsIsLoading: false });
  }

  private updateOrganizations = this.updater(
    (state, organizations: Array<APIOrganizationResponseDTO>): State => ({
      ...state,
      organizations: organizations,
    }),
  );

  private updateOrganizationsIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      organizationsIsLoading: loading,
    }),
  );

  public getOrganizations = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      mergeMap((search) => {
        this.updateOrganizationsIsLoading(true);
        return this.organizationService.getV2Organizations({ nameOrCvrContent: search, orderByProperty: 'Name' }).pipe(
          tapResponse({
            next: (organizations) => this.updateOrganizations(organizations),
            error: (e) => console.error(e),
            complete: () => this.updateOrganizationsIsLoading(false),
          }),
        );
      }),
    ),
  );
}
