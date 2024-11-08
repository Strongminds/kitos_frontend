import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrganizationRemovalConflicts } from '../delete-organization.component-store';

@Component({
  selector: 'app-removal-conflict-table',
  templateUrl: './removal-conflict-table.component.html',
  styleUrl: './removal-conflict-table.component.scss',
})
export class RemovalConflictTableComponent {
  @Input() public removalConflicts$!: Observable<OrganizationRemovalConflicts | undefined>;
  @Input() public organizationName!: string;
  @Input() public type!: RemovalConflictType;

  public getAccordionTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakt konflikter`;
      case 'dprDataprocessor':
        return $localize`Databehandler konflikter`;
      case 'dprSubDataprocessor':
        return $localize`Underdatabehandler konflikter`;
      case 'interfaces':
        return $localize`Snitflade konflikter`;
      case 'systemsExposingInterfaces':
        return $localize`System konflikter`;
      case 'systemsRightsHolder':
        return $localize`System konflikter`;
      case 'systemsParentSystem':
        return $localize`System konflikter`;
      case 'systemsArchiveSupplier':
        return $localize`System konflikter`;
      case 'systemsUsages':
        return $localize`System konflikter`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getSpecificConflicts(): Observable<RemovalConflict[]> {
    return this.removalConflicts$.pipe(
      map((conflicts) => {
        switch (this.type) {
          case 'contracts':
            return conflicts?.contractsInOtherOrganizationsWhereOrgIsSupplier;
          case 'dprDataprocessor':
            return conflicts?.dprInOtherOrganizationsWhereOrgIsDataProcessor;
          case 'dprSubDataprocessor':
            return conflicts?.dprInOtherOrganizationsWhereOrgIsSubDataProcessor;
          case 'interfaces':
            return conflicts?.interfacesExposedOnSystemsOutsideTheOrganization;
          case 'systemsExposingInterfaces':
            return conflicts?.systemsExposingInterfacesDefinedInOtherOrganizations;
          case 'systemsRightsHolder':
            return conflicts?.systemsInOtherOrganizationsWhereOrgIsRightsHolder;
          case 'systemsParentSystem':
            return conflicts?.systemsSetAsParentSystemToSystemsInOtherOrganizations;
          case 'systemsArchiveSupplier':
            return conflicts?.systemsWhereOrgIsArchiveSupplier;
          case 'systemsUsages':
            return conflicts?.systemsWithUsagesOutsideTheOrganization;
          default:
            throw new Error(`Unknown removal conflict type: ${this.type}`);
        }
      }),
      map((conflicts) => conflicts ?? [])
    );
  }

  public getMainEntityTitle(): string | undefined {
    switch (this.type) {
      case 'dprDataprocessor':
      case 'contracts':
      case 'dprSubDataprocessor':
      case 'systemsRightsHolder':
      case 'systemsArchiveSupplier':
        return undefined;
      case 'interfaces':
        return $localize`Snitflade`;
      case 'systemsExposingInterfaces':
      case 'systemsParentSystem':
        return $localize`IT-System (i kataloget)`;
      case 'systemsUsages':
        return $localize`System`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getEntityTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakt`;
      case 'dprDataprocessor':
      case 'dprSubDataprocessor':
        return $localize`Databehandling`;
      case 'interfaces':
        return $localize`Udstillet på i (IT-System)`;
      case 'systemsExposingInterfaces':
        return $localize`Udstillet snitflade`;
      case 'systemsRightsHolder':
        return $localize`IT-System (i kataloget)`;
      case 'systemsParentSystem':
        return $localize`Overordnet system for (IT-System)`;
      case 'systemsArchiveSupplier':
        return $localize`IT-System (i anvendelse)`;
      case 'systemsUsages':
        return $localize`System`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getOrganizationTitle(): string {
    switch (this.type) {
      case 'systemsArchiveSupplier':
        return $localize`Anvendt i (organisation)`;
      default:
        return $localize`Oprettet i (organisation)`;
    }
  }

  public getTooltipText(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakter hvor organisationen "${this.organizationName}" er sat som "Leverandør", og hvor feltet dermed nulstilles:`;
      case 'dprDataprocessor':
        return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${this.organizationName}" fjernes som databehandler`;
      case 'dprSubDataprocessor':
        return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${this.organizationName}" fjernes som underdatabehandler`;
      case 'interfaces':
        return $localize`Snitflader som flyttes til "Fælles Kommune", da de er udstillet på IT-Systemer oprettet i andre organisationer`;
      case 'systemsExposingInterfaces':
        return $localize`IT-Systemer som flyttes til "Fælles kommune", da de udstiller Snitflader oprettet i andre organisationer:`;
      case 'systemsRightsHolder':
        return $localize`IT-Systemer i kataloget, hvor "${this.organizationName}" er sat som "Rettighedshaver", og hvor feltet dermed nulstilles`;
      case 'systemsParentSystem':
        return $localize`IT-Systemer som flyttes til "${this.organizationName}", da de er sat som "Overordnet IT-System" på systemer oprettet i andre organisationer:`;
      case 'systemsArchiveSupplier':
        return $localize`Systemer hvor organisationen "${this.organizationName}" er arkivleverandør, og hvor feltet dermed nulstilles:`;
      case 'systemsUsages':
        return $localize`Systemer hvor organisationen "${this.organizationName}" har brug, og hvor feltet dermed nulstilles:`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }
}

export interface RemovalConflict {
  mainEntityName: string | undefined;
  entityName: string;
  organizationName: string;
}

export type RemovalConflictType =
  | 'contracts'
  | 'dprDataprocessor'
  | 'dprSubDataprocessor'
  | 'interfaces'
  | 'systemsExposingInterfaces'
  | 'systemsRightsHolder'
  | 'systemsParentSystem'
  | 'systemsArchiveSupplier'
  | 'systemsUsages';

export const conflictTypeOptions: RemovalConflictType[] = [
  'systemsExposingInterfaces',
  'systemsParentSystem',
  'interfaces',
  'systemsRightsHolder',
  'systemsArchiveSupplier',
  'systemsUsages',
];

export const simpleConflictTypeOptions: RemovalConflictType[] = [
  'contracts',
  'dprDataprocessor',
  'dprSubDataprocessor',
];

export const otherConflictTypeOptions: RemovalConflictType[] = [
  'systemsRightsHolder',
  'systemsExposingInterfaces',
  'systemsParentSystem',
  'systemsArchiveSupplier',
  'interfaces',
  'systemsUsages',
];
