import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { first, mergeMap, Observable, switchMap, tap } from 'rxjs';
import {
  APIUserReferenceResponseDTO,
  APIV2GlobalUserInternalINTERNALService,
  APIV2OrganizationService,
} from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';

interface State {
  users: APIUserReferenceResponseDTO[];
  searchGlobal: boolean;
  loading: boolean;
}

@Injectable()
export class UserDropdownComponentStore extends ComponentStore<State> {
  public readonly users$ = this.select((state) => state.users);
  public readonly loading$ = this.select((state) => state.loading);
  public readonly searchGlobal$ = this.select((state) => state.searchGlobal);

  constructor(
    private readonly globalUserService: APIV2GlobalUserInternalINTERNALService,
    private readonly organizationApiService: APIV2OrganizationService,
    private readonly store: Store
  ) {
    super({ users: [], searchGlobal: false, loading: false });
  }

  private setUsers = this.updater(
    (state, users: APIUserReferenceResponseDTO[]): State => ({
      ...state,
      users,
    })
  );

  private setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public setGlobalSearch = this.updater(
    (state, searchGlobal: boolean): State => ({
      ...state,
      searchGlobal,
    })
  );

  public searchUsers = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((search) => {
        return this.searchUsersInternal(search).pipe(
          tapResponse(
            (filteredUsers) => this.setUsers(filteredUsers),
            (error) => console.error(error),
            () => this.setLoading(false)
          ),
        );
      })
    )
  );

  private searchUsersInternal(search: string | undefined): Observable<APIUserReferenceResponseDTO[]> {
    return this.searchGlobal$.pipe(
      first(),
      switchMap((searchGlobal) => {
        return searchGlobal ? this.searchGlobally(search) : this.searchByOrganization(search);
      })
    );
  }

  private searchGlobally(search: string | undefined): Observable<APIUserReferenceResponseDTO[]> {
    return this.globalUserService.getManyGlobalUserInternalV2GetUsers({
      nameOrEmailQuery: search,
    });
  }

  private searchByOrganization(search: string | undefined): Observable<APIUserReferenceResponseDTO[]> {
    return this.store.select(selectOrganizationUuid).pipe(
      filterNullish(),
      first(),
      switchMap((organizationUuid) => {
        return this.organizationApiService.getManyOrganizationV2GetOrganizationUsers({
          organizationUuid,
          nameOrEmailQuery: search,
        });
      })
    );
  }
}
