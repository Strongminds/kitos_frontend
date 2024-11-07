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
        return $localize`Interface konflikter`;
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

  public getEntityTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakt`;
      case 'dprDataprocessor':
      case 'dprSubDataprocessor':
        return $localize`Databehandling`;
      case 'interfaces':
        return $localize`Interface`;
      case 'systemsExposingInterfaces':
        return $localize`System`;
      case 'systemsRightsHolder':
        return $localize`System`;
      case 'systemsParentSystem':
        return $localize`Overordnet system for (IT-System)`;
      case 'systemsArchiveSupplier':
        return $localize`System`;
      case 'systemsUsages':
        return $localize`System`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getMainEntityTitle(): string | undefined {
    switch (this.type) {
      case 'dprDataprocessor':
      case 'contracts':
      case 'dprSubDataprocessor':
        return undefined;
      case 'interfaces':
        return $localize`Interface`;
      case 'systemsExposingInterfaces':
        return $localize`System`;
      case 'systemsRightsHolder':
        return $localize`System`;
      case 'systemsParentSystem':
        return $localize`IT-System (i kataloget)`;
      case 'systemsArchiveSupplier':
        return $localize`System`;
      case 'systemsUsages':
        return $localize`System`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
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
        return $localize`Interfaces hvor organisationen "${this.organizationName}" har systemer, og hvor feltet dermed nulstilles:`;
      case 'systemsExposingInterfaces':
        return $localize`Systemer hvor organisationen "${this.organizationName}" har interfaces, og hvor feltet dermed nulstilles:`;
      case 'systemsRightsHolder':
        return $localize`Systemer hvor organisationen "${this.organizationName}" er rettighedshaver, og hvor feltet dermed nulstilles:`;
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

export interface RemovalConflictHeader {
  mainEntityTitle: string | undefined;
  entityTitle: string;
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
  'contracts',
  'dprDataprocessor',
  'dprSubDataprocessor',
  'interfaces',
  'systemsExposingInterfaces',
  'systemsRightsHolder',
  'systemsParentSystem',
  'systemsArchiveSupplier',
  'systemsUsages',
];
