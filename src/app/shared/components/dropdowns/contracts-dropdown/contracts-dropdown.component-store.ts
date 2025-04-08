import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable, tap } from 'rxjs';
import { APIItContractResponseDTO, APIV2ItContractService } from 'src/app/api/v2';

interface State {
  contracts: APIItContractResponseDTO[];
  loading: boolean;
}

@Injectable()
export class ContractDropdownComponentStore extends ComponentStore<State> {
  public readonly contracts$ = this.select((state) => state.contracts);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private readonly itContractService: APIV2ItContractService) {
    super({ contracts: [], loading: false });
  }

  private setContracts = this.updater(
    (state, contracts: APIItContractResponseDTO[]): State => ({
      ...state,
      contracts,
    })
  );

  private setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public searchContracts = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((search) => {
        return this.itContractService.getManyItContractV2GetItContracts({ nameContent: search }).pipe(
          tapResponse(
            (contracts) => this.setContracts(contracts),
            (error) => console.error(error),
            () => this.setLoading(false)
          )
        );
      })
    )
  );
}
