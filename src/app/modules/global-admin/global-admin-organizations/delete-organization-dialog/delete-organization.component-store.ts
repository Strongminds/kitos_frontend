import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable } from 'rxjs';
import { APIOrganizationRemovalConflictsResponseDTO, APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';

interface State {
  consequences: APIOrganizationRemovalConflictsResponseDTO | undefined;
}

@Injectable()
export class DeleteOrganizationComponentStore extends ComponentStore<State> {
  constructor(private apiService: APIV2OrganizationsInternalINTERNALService) {
    super({ consequences: undefined });
  }

  private updateConsequences = this.updater(
    (state, consequences: APIOrganizationRemovalConflictsResponseDTO): State => ({
      ...state,
      consequences,
    })
  );

  public getConsequences = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      mergeMap((organizationUuid) =>
        this.apiService.getSingleOrganizationsInternalV2GetConflicts({ organizationUuid }).pipe(
          tapResponse(
            (conflicts) => this.updateConsequences(conflicts),
            (e) => console.error(e)
          )
        )
      )
    )
  );
}
