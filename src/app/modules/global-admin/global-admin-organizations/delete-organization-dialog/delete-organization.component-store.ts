import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { map, mergeMap, Observable, tap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { mapConflictsDtoToOrganizationRemovalConflicts } from 'src/app/shared/helpers/removal-conflicts.helper';
import { OrganizationRemovalConflicts } from 'src/app/shared/models/global-admin/organization-removal-conflicts.model';

interface State {
  removalConflicts?: OrganizationRemovalConflicts;
  isLoading: boolean;
}

@Injectable()
export class DeleteOrganizationComponentStore extends ComponentStore<State> {
  constructor(private apiService: APIV2OrganizationsInternalINTERNALService) {
    super({ removalConflicts: undefined, isLoading: false });
  }

  public readonly removalConflicts$ = this.select((state) => state.removalConflicts);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  private updateConsequences = this.updater(
    (state, consequences: OrganizationRemovalConflicts): State => ({
      ...state,
      removalConflicts: consequences,
    })
  );

  private setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));

  public getConsequences = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((organizationUuid) =>
        this.apiService.getSingleOrganizationsInternalV2GetConflicts({ organizationUuid }).pipe(
          map((conflictsDto) => mapConflictsDtoToOrganizationRemovalConflicts(conflictsDto)),
          tapResponse(
            (conflicts) => this.updateConsequences(conflicts),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        )
      )
    )
  );
}
