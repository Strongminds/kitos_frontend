import type { APIExternalUserChangeResponse } from 'src/app/api/v2/model/externalUserChangeResponse';
import type { APIExternalUserChangeStatus } from 'src/app/api/v2/model/externalUserChangeStatus';

export const ExternalUserChangesView = {
  Pending: 'pending',
  Resolved: 'resolved',
} as const;

export type ExternalUserChangesView = (typeof ExternalUserChangesView)[keyof typeof ExternalUserChangesView];

export interface ExternalUserChangeRow {
  uuid: string;
  userName: string;
  email: string;
  externalUserUuid: string;
  userUuid: string;
  externalMessageId: string;
  changeTypeLabel: string;
  status: APIExternalUserChangeStatus;
  statusLabel: string;
  receivedAt: Date | null;
  occurredAt: Date | null;
  resolvedAt: Date | null;
  resolvedByUserUuid: string;
  selected: boolean;
  notSelectable: boolean;
}

export interface ExternalUserChangesListResult {
  items: APIExternalUserChangeResponse[];
  pendingCount: number;
}

export interface ExternalUserChangesPage extends ExternalUserChangesListResult {
  skip: number;
  total: number;
}
