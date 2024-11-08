import { RemovalConflictType } from './removal-conflict-table/removal-conflict-table.component';

export function getConflictDescription(type: RemovalConflictType, orgName: string, defaultOrgName: string): string {
  switch (type) {
    case 'contracts':
      return $localize`Kontrakter hvor organisationen "${orgName}" er sat som "Leverandør", og hvor feltet dermed nulstilles`;
    case 'dprDataprocessor':
      return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${orgName}" fjernes som databehandler`;
    case 'dprSubDataprocessor':
      return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${orgName}" fjernes som underdatabehandler`;
    case 'interfaces':
      return $localize`Snitflader som flyttes til "${defaultOrgName}", da de er udstillet på IT-Systemer oprettet i andre organisationer`;
    case 'systemsExposingInterfaces':
      return $localize`IT-Systemer som flyttes til "${defaultOrgName}", da de udstiller Snitflader oprettet i andre organisationer`;
    case 'systemsRightsHolder':
      return $localize`IT-Systemer i kataloget, hvor "${orgName}" er sat som "Rettighedshaver", og hvor feltet dermed nulstilles`;
    case 'systemsParentSystem':
      return $localize`IT-Systemer som flyttes til "${orgName}", da de er sat som "Overordnet IT-System" på systemer oprettet i andre organisationer`;
    case 'systemsArchiveSupplier':
      return $localize`IT-Systemer hvor organisationen "${orgName}" er sat som "Arkiveringsleverandør", og hvor feltet dermed nulstilles`;
    case 'systemsUsages':
      return $localize`IT-Systemer som flyttes til "${orgName}", da de stadig er er i anvendelse i andre organisationer`;
    default:
      throw new Error(`Unknown removal conflict type: ${type}`);
  }
}
