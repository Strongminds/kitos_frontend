import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { APIOrganizationUserResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from '../../pipes/filter-nullish';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, Observable, of } from 'rxjs';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { tapResponse } from '@ngrx/operators';
import { NotificationService } from '../../services/notification.service';

interface State {
  users?: APIOrganizationUserResponseDTO[];
  usersIsLoading: boolean;
}

@Injectable()
export class OrganizationUserDropdownComponentStore extends ComponentStore<State> {
  public readonly users$ = this.select((state) => state.users).pipe(filterNullish());
  public readonly usersIsLoading$ = this.select((state) => state.usersIsLoading);

  constructor(
    private readonly organizationApiService: APIV2OrganizationService,
    private readonly store: Store,
    private notificationService: NotificationService
  ) {
    super({ usersIsLoading: false });
    this.searchUsersInOrganization(of(undefined));
  }

  private updateUsers = this.updater(
    (state, users: APIOrganizationUserResponseDTO[]): State => ({
      ...state,
      users,
    })
  );

  private updateUsersIsLoading = this.updater(
    (state, isLoading: boolean): State => ({ ...state, usersIsLoading: isLoading })
  );

  public searchUsersInOrganization = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        this.updateUsersIsLoading(true);
        return this.organizationApiService
          .getManyOrganizationV2GetOrganizationUsers({
            organizationUuid,
            nameOrEmailQuery: search,
          })
          .pipe(
            tapResponse(
              (users) => this.updateUsers(users),
              (e) => {
                console.error(e);
                this.notificationService.showError($localize`Kunne ikke hente organisations brugere`);
              },
              () => this.updateUsersIsLoading(false)
            )
          );
      })
    )
  );
}
