import { Observable, combineLatest, map } from 'rxjs';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { BulkActionSection } from '../components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { ODataOrganizationUser, Right } from '../models/organization/organization-user/organization-user.model';
import { mapUserRightsToBulkOptions } from './user-role.helpers';

export function getUserRoleSelectionDialogSections(
  user$: Observable<ODataOrganizationUser>,
  unitRoles$: Observable<Array<APIRoleOptionResponseDTO> | null>,
  contractRoles$: Observable<Array<APIRoleOptionResponseDTO> | null>,
  systemRoles$: Observable<Array<APIRoleOptionResponseDTO> | null>,
  dprRoles$: Observable<Array<APIRoleOptionResponseDTO> | null>
): BulkActionSection[] {
  return [
    {
      options$: userRightsOptions$(user$, unitRoles$, (user) => user.OrganizationUnitRights),
      entityType: 'organization-unit',
      title: $localize`Organisationsenhedroller`,
      primaryColumnTitle: $localize`Organisationsenhed`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: userRightsOptions$(user$, contractRoles$, (user) => user.ItContractRights),
      entityType: 'it-contract',
      title: $localize`Kontraktroller`,
      primaryColumnTitle: $localize`Kontrakt`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: userRightsOptions$(user$, systemRoles$, (user) => user.ItSystemRights),
      entityType: 'it-system',
      title: $localize`Systemroller`,
      primaryColumnTitle: $localize`System`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: userRightsOptions$(user$, dprRoles$, (user) => user.DataProcessingRegistrationRights),
      entityType: 'data-processing-registration',
      title: $localize`Databehandlingsroller`,
      primaryColumnTitle: $localize`Databehandling`,
      secondaryColumnTitle: $localize`Rolle`,
    },
  ] as BulkActionSection[];
}

export function filterNotAvailableUserRights(
  userRights: Right[] | undefined,
  roles: APIRoleOptionResponseDTO[] | null | undefined
) {
  if (!userRights || !roles) return [];
  const allowedRoleUuids = new Set(roles.map((r) => r.uuid));
  return userRights.filter((ur) => allowedRoleUuids.has(ur.role.uuid));
}

function userRightsOptions$(
  user$: Observable<ODataOrganizationUser>,
  roles$: Observable<Array<APIRoleOptionResponseDTO> | null>,
  getRights: (user: ODataOrganizationUser) => Right[]
): Observable<ReturnType<typeof mapUserRightsToBulkOptions>> {
  return combineLatest([user$, roles$]).pipe(
    map(([user, roles]) => mapUserRightsToBulkOptions(filterNotAvailableUserRights(getRights(user), roles)))
  );
}
