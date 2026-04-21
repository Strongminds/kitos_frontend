import { APIStsOrganizationChangeLogOriginOption, APIStsOrganizationChangeLogResponseDTO } from 'src/app/api/v2';
import { FkOrgChangeLogModel } from 'src/app/shared/models/local-admin/fk-org-change-log.dictionary';

export function getResponsibleEntityTextBasedOnOrigin(
  changelog: APIStsOrganizationChangeLogResponseDTO | FkOrgChangeLogModel,
): string {
  return changelog.origin === APIStsOrganizationChangeLogOriginOption.NUMBER_1
    ? $localize`Fk Organisation`
    : `${changelog.user?.name} (${changelog.user?.email})`;
}
