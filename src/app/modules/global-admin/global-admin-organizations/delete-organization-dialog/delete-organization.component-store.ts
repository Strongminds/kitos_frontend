import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { map, mergeMap, Observable } from 'rxjs';
import { APIOrganizationRemovalConflictsResponseDTO, APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';

interface State {
  consequences: OrganizationRemovalConflicts | undefined;
}

@Injectable()
export class DeleteOrganizationComponentStore extends ComponentStore<State> {
  constructor(private apiService: APIV2OrganizationsInternalINTERNALService) {
    super({ consequences: undefined });
  }

  private updateConsequences = this.updater(
    (state, consequences: OrganizationRemovalConflicts): State => ({
      ...state,
      consequences,
    })
  );

  public getConsequences = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      mergeMap((organizationUuid) =>
        this.apiService.getSingleOrganizationsInternalV2GetConflicts({ organizationUuid }).pipe(
          map((conflictsDto) => mapDtoToRemovalConflicts(conflictsDto)),
          tapResponse(
            (conflicts) => this.updateConsequences(conflicts),
            (e) => console.error(e)
          )
        )
      )
    )
  );
}

function mapDtoToRemovalConflicts(dto: APIOrganizationRemovalConflictsResponseDTO): OrganizationRemovalConflicts {
  return dto;
}

interface OrganizationRemovalConflicts {}
