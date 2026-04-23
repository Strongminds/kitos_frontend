import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, of, withLatestFrom } from 'rxjs';
import { APIOrganizationResponseDTO, OrganizationV2Service } from 'src/app/api/v2';
import { selectOrganization, selectUserUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  //subscribe to user uuid to only trigger when user changes, and prevent unnecessary API calls if a single user property is updated
  public verifiedUserOrganization$ = this.store.select(selectUserUuid).pipe(
    filterNullish(),
    withLatestFrom(this.store.select(selectOrganization)),
    // Check if users persisted organization exists
    mergeMap(([_, persistedOrganization]) => {
      if (!persistedOrganization) return of(undefined);

      return this.apiOrganizationService
        .getSingleOrganizationV2GetOrganizations({ onlyWhereUserHasMembership: true, uuid: persistedOrganization.uuid })
        .pipe(map((organizations) => organizations[0]));
    }),
    // Find out if user is part of zero, one or multiple organizations
    mergeMap((organization?: APIOrganizationResponseDTO) =>
      this.apiOrganizationService
        .getSingleOrganizationV2GetOrganizations({ onlyWhereUserHasMembership: true, pageSize: 2 })
        .pipe(map((organizations) => ({ organization, organizations }))),
    ),
  );

  constructor(
    private store: Store,
    @Inject(OrganizationV2Service) private apiOrganizationService: OrganizationV2Service,
  ) {}

  /**
   * Wraps OrganizationV2Service.getSingleOrganizationV2GetOrganizations
   * Returns API response with adapted organization names (disabled orgs get "(udgået)" suffix)
   */
  getV2Organizations(params?: any): Observable<APIOrganizationResponseDTO[]> {
    return this.apiOrganizationService
      .getSingleOrganizationV2GetOrganizations(params)
      .pipe(
        map((organizations: APIOrganizationResponseDTO[]) =>
          organizations.map((org: APIOrganizationResponseDTO) => this.adaptOrganizationName(org)),
        ),
      );
  }

  /**
   * Adapts organization by appending "(udgået)" to name if disabled
   */
  adaptOrganizationName(organization: APIOrganizationResponseDTO): APIOrganizationResponseDTO {
    if (!organization) return organization;

    return {
      ...organization,
      name: organization.disabled ? `${organization.name} ` + $localize`(udgået)` : organization.name,
    };
  }
}
