import { Observable, map } from 'rxjs';
import { BulkActionSection } from '../components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { Right } from '../models/organization/organization-user/organization-user.model';
import { mapUserRightsToBulkOptions } from './user-role.helpers';

export function getUserRoleSelectionDialogSections(
  unitRights: Observable<Right[]>,
  contractRights: Observable<Right[]>,
  systemRights: Observable<Right[]>,
  dataProcessingRights: Observable<Right[]>
): BulkActionSection[] {
  return [
    {
      options$: unitRights.pipe(map(mapUserRightsToBulkOptions)),
      entityType: 'organization-unit',
      title: $localize`Organisationsenhedroller`,
      primaryColumnTitle: $localize`Organisationsenhed`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: contractRights.pipe(map(mapUserRightsToBulkOptions)),
      entityType: 'it-contract',
      title: $localize`Kontraktroller`,
      primaryColumnTitle: $localize`Kontrakt`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: systemRights.pipe(map(mapUserRightsToBulkOptions)),
      entityType: 'it-system',
      title: $localize`Systemroller`,
      primaryColumnTitle: $localize`System`,
      secondaryColumnTitle: $localize`Rolle`,
    },
    {
      options$: dataProcessingRights.pipe(map(mapUserRightsToBulkOptions)),
      entityType: 'data-processing-registration',
      title: $localize`Databehandlingsroller`,
      primaryColumnTitle: $localize`Databehandling`,
      secondaryColumnTitle: $localize`Rolle`,
    },
  ] as BulkActionSection[];
}
