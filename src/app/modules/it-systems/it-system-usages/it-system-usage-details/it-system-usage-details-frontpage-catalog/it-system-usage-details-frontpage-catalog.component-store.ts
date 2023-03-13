import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable } from 'rxjs';
import { APIItSystemResponseDTO, APIV2ItSystemService } from 'src/app/api/v2';

interface State {
  parentSystem?: APIItSystemResponseDTO;
}

@Injectable({ providedIn: 'any' })
export class ITSystemUsageDetailsFrontpageCatalogComponentStore extends ComponentStore<State> {
  public readonly parentSystem$ = this.select((state) => state.parentSystem);

  constructor(private apiItSystemService: APIV2ItSystemService) {
    super({});
  }

  private updateParentSystem = this.updater(
    (state, parentSystem: APIItSystemResponseDTO): State => ({
      ...state,
      parentSystem,
    })
  );

  public getParentSystem = this.effect((systemUuid$: Observable<string>) =>
    systemUuid$.pipe(
      mergeMap((systemUuid) =>
        this.apiItSystemService.gETItSystemV2GetItSystemGuidUuid(systemUuid).pipe(
          tapResponse(
            (parentSystem) => this.updateParentSystem(parentSystem),
            (e) => console.error(e)
          )
        )
      )
    )
  );
}
