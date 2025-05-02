import { Observable, map } from 'rxjs';
import { BulkActionSection } from '../components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { ODataOrganizationUser } from '../models/organization/organization-user/organization-user.model';
import { mapUserRightsToBulkOptions } from './user-role.helpers';

export function getUserRoleSelectionDialogSections(user$: Observable<ODataOrganizationUser>): BulkActionSection[] {
  return [
    {
      options$: user$.pipe(map((user) => mapUserRightsToBulkOptions(user.OrganizationUnitRights))),
      entityType: 'organization-unit',
      title: $localize`Organisationsenhedroller`,
      primaryColumnTitle: $localize`Organisationsenhed`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: user$.pipe(map((user) => mapUserRightsToBulkOptions(user.ItContractRights))),
      entityType: 'it-contract',
      title: $localize`Kontraktroller`,
      primaryColumnTitle: $localize`Kontrakt`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: user$.pipe(map((user) => mapUserRightsToBulkOptions(user.ItSystemRights))),
      entityType: 'it-system',
      title: $localize`Systemroller`,
      primaryColumnTitle: $localize`System`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: user$.pipe(map((user) => mapUserRightsToBulkOptions(user.DataProcessingRegistrationRights))),
      entityType: 'data-processing-registration',
      title: $localize`Databehandlingsroller`,
      primaryColumnTitle: $localize`Databehandling`,
      secondaryColumnTitle: $localize`Rolle`,
    },
  ] as BulkActionSection[];
}
