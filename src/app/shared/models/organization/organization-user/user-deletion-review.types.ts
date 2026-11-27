import type { BehaviorSubject, Observable } from 'rxjs';
import type { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import type { ODataOrganizationUser } from './organization-user.model';

export interface TransferRoleOptions {
  units: APIRoleOptionResponseDTO[];
  systems: APIRoleOptionResponseDTO[];
  contracts: APIRoleOptionResponseDTO[];
  dataProcessing: APIRoleOptionResponseDTO[];
}

export const UserDeletionReviewStatus = {
  Loading: 'loading',
  Blocked: 'blocked',
  Ready: 'ready',
} as const;

export type UserDeletionReviewState =
  | { status: typeof UserDeletionReviewStatus.Loading | typeof UserDeletionReviewStatus.Blocked }
  | {
      status: typeof UserDeletionReviewStatus.Ready;
      user: ODataOrganizationUser;
      options: TransferRoleOptions;
      hasRoles: boolean;
    };

export interface UserDeletionReview {
  organizationUuid: string;
  userName: string;
  state$: BehaviorSubject<UserDeletionReviewState>;
  reload: () => Observable<UserDeletionReviewState>;
}

export const UserDeletionReviewDecision = {
  Continue: 'continue',
  ContinueWithoutRemainingRoles: 'continue-without-remaining-roles',
} as const;

export type UserDeletionReviewDecision = (typeof UserDeletionReviewDecision)[keyof typeof UserDeletionReviewDecision];
