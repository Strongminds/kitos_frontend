import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, Observable, tap } from 'rxjs';
import {
  APIUserIsPartOfCurrentOrgResponseDTO,
  APIUserResponseDTO,
  APIV2UsersInternalINTERNALService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  isLoading: boolean;
  existsInOrganization: boolean;
  user?: APIUserResponseDTO;
}

@Injectable()
export class ProfileComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly alreadyExists$ = this.select((state) => state.existsInOrganization);

  constructor(
    @Inject(APIV2UsersInternalINTERNALService) private userService: APIV2UsersInternalINTERNALService,
    private store: Store
  ) {
    super({ isLoading: false, existsInOrganization: false });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setUser = this.updater(
    (state, user: APIUserIsPartOfCurrentOrgResponseDTO | undefined): State => ({
      ...state,
      existsInOrganization: user?.isPartOfCurrentOrganization ?? false,
    })
  );

  public getUserWithEmail = this.effect((email$: Observable<string>) =>
    email$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([email, organizationUuid]) => {
        return this.userService
          .getSingleUsersInternalV2GetUsersByEmailInOtherOrganizations({
            organizationUuid: organizationUuid,
            email: email,
          })
          .pipe(
            tapResponse(
              (user) => this.setUser(user),
              (e) => console.error(e),
              () => this.setLoading(false)
            )
          );
      })
    )
  );

  public getUser = this.effect((_: Observable<void>) =>
    this.store.select().pipe(
      filterNullish(),
      tap(() => this.setLoading(true)),
      mergeMap((organizationUuid) => {
        return this.userService.getSingleUsersInternalV2GetUserByOrganizationUuid({ organizationUuid }).pipe(
          tapResponse(
            (user) => this.setUser(user),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        );
      })
    )
  );
}
