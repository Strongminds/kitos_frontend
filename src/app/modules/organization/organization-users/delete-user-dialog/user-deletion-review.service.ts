import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, shareReplay, tap } from 'rxjs';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { userHasAnyAvailableRights } from 'src/app/shared/helpers/user-role.helpers';
import {
  adaptOrganizationUser,
  ODataOrganizationUser,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';

interface TransferRoleOptions {
  units: APIRoleOptionResponseDTO[];
  systems: APIRoleOptionResponseDTO[];
  contracts: APIRoleOptionResponseDTO[];
  dataProcessing: APIRoleOptionResponseDTO[];
}

export type UserDeletionReviewState =
  | { status: 'loading' | 'blocked' }
  | { status: 'ready'; user: ODataOrganizationUser; options: TransferRoleOptions; hasRoles: boolean };

export interface UserDeletionReview {
  organizationUuid: string;
  userName: string;
  state$: BehaviorSubject<UserDeletionReviewState>;
  reload: () => Observable<UserDeletionReviewState>;
}

export type UserDeletionReviewDecision = 'continue' | 'continue-without-remaining-roles';

@Injectable({ providedIn: 'root' })
export class UserDeletionReviewService {
  constructor(
    private readonly http: HttpClient,
    private readonly roleOptions: RoleOptionTypeService,
  ) {}

  public createReviews(organizationUuid: string, users: { userUuid: string; userName: string }[]): UserDeletionReview[] {
    const options$ = this.loadRoleOptions(organizationUuid);
    const reviews = new Map<string, UserDeletionReview>();
    return users.map(({ userUuid, userName }) => {
      const existing = userUuid && reviews.get(userUuid);
      if (existing) return existing;

      const state$ = new BehaviorSubject<UserDeletionReviewState>({ status: 'loading' });
      const review: UserDeletionReview = {
        organizationUuid,
        userName,
        state$,
        reload: () => this.loadReview(organizationUuid, userUuid, options$).pipe(tap((state) => state$.next(state))),
      };
      if (userUuid) reviews.set(userUuid, review);
      return review;
    });
  }

  private loadRoleOptions(organizationUuid: string): Observable<TransferRoleOptions | null> {
    return forkJoin({
      units: this.roleOptions.getAvailableOptions(organizationUuid, 'organization-unit'),
      systems: this.roleOptions.getAvailableOptions(organizationUuid, 'it-system-usage'),
      contracts: this.roleOptions.getAvailableOptions(organizationUuid, 'it-contract'),
      dataProcessing: this.roleOptions.getAvailableOptions(organizationUuid, 'data-processing'),
    }).pipe(
      map((options) => Object.values(options).every(Array.isArray) ? options : null),
      catchError(() => of(null)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  private loadReview(
    organizationUuid: string,
    userUuid: string,
    options$: Observable<TransferRoleOptions | null>,
  ): Observable<UserDeletionReviewState> {
    if (!userUuid) return of({ status: 'blocked' });

    return forkJoin({ user: this.lookupUser(organizationUuid, userUuid), options: options$ }).pipe(
      map(({ user, options }): UserDeletionReviewState => {
        if (!user || !options) return { status: 'blocked' };
        const hasRoles = userHasAnyAvailableRights(user, options.units, options.systems, options.contracts, options.dataProcessing);
        return { status: 'ready', user, options, hasRoles };
      }),
      catchError(() => of<UserDeletionReviewState>({ status: 'blocked' })),
    );
  }

  private lookupUser(organizationUuid: string, userUuid: string): Observable<ODataOrganizationUser | undefined> {
    const orgFilter = `Object/Organization/Uuid eq ${organizationUuid}`;
    const role = 'Role($select=Name,Uuid,HasWriteAccess)';
    const entity = 'Object($select=Name,Uuid)';
    const expand = [
      `OrganizationRights($filter=Organization/Uuid eq ${organizationUuid})`,
      `OrganizationUnitRights($filter=${orgFilter};$expand=${role},${entity})`,
      `ItSystemRights($filter=${orgFilter};$expand=${role},Object($select=ItSystem,Uuid;$expand=ItSystem($select=Name)))`,
      `ItContractRights($filter=${orgFilter};$expand=${role},${entity})`,
      `DataProcessingRegistrationRights($filter=${orgFilter};$expand=${role},${entity})`,
    ].join(',');

    return this.http
      .get<{ value: Record<string, unknown>[] }>(`/odata/GetUsersByUuid(organizationUuid=${organizationUuid})`, {
        params: { $filter: `Uuid eq ${userUuid}`, $expand: expand, $top: 1 },
      })
      .pipe(map(({ value }) => this.adaptReviewUser(value.find((user) => user['Uuid'] === userUuid))));
  }

  private adaptReviewUser(user?: Record<string, unknown>): ODataOrganizationUser | undefined {
    const requiredCollections = [
      'OrganizationRights',
      'OrganizationUnitRights',
      'ItSystemRights',
      'ItContractRights',
      'DataProcessingRegistrationRights',
    ];
    if (!user || !requiredCollections.every((key) => Array.isArray(user[key]))) return undefined;
    return adaptOrganizationUser(user);
  }
}
