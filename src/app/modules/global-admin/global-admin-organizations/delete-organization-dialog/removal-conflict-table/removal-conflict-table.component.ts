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

  public readonly defaultOrganizationName = 'Fælles Kommune';

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
      case 'systemsUsages':
        return undefined;
      case 'interfaces':
        return $localize`Snitflade`;
      case 'systemsExposingInterfaces':
      case 'systemsParentSystem':
        return $localize`IT-System (i kataloget)`;
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
      case 'systemsUsages':
        return $localize`IT-System (i anvendelse)`;
      default:
        throw new Error(`Unknown removal conflict type: ${this.type}`);
    }
  }

  public getOrganizationTitle(): string {
    switch (this.type) {
      case 'systemsArchiveSupplier':
      case 'systemsUsages':
        return $localize`Anvendt i (organisation)`;
      default:
        return $localize`Oprettet i (organisation)`;
    }
  }

  public getAccordionTitle(): string {
    switch (this.type) {
      case 'contracts':
        return $localize`Kontrakter hvor organisationen "${this.organizationName}" er sat som "Leverandør", og hvor feltet dermed nulstilles`;
      case 'dprDataprocessor':
        return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${this.organizationName}" fjernes som databehandler`;
      case 'dprSubDataprocessor':
        return $localize`Registreringer i modulet "Databehandling", hvor organisationen "${this.organizationName}" fjernes som underdatabehandler`;
      case 'interfaces':
        return $localize`Snitflader som flyttes til "${this.defaultOrganizationName}", da de er udstillet på IT-Systemer oprettet i andre organisationer`;
      case 'systemsExposingInterfaces':
        return $localize`IT-Systemer som flyttes til "${this.defaultOrganizationName}", da de udstiller Snitflader oprettet i andre organisationer`;
      case 'systemsRightsHolder':
        return $localize`IT-Systemer i kataloget, hvor "${this.organizationName}" er sat som "Rettighedshaver", og hvor feltet dermed nulstilles`;
      case 'systemsParentSystem':
        return $localize`IT-Systemer som flyttes til "${this.organizationName}", da de er sat som "Overordnet IT-System" på systemer oprettet i andre organisationer`;
      case 'systemsArchiveSupplier':
        return $localize`IT-Systemer hvor organisationen "${this.organizationName}" er sat som "Arkiveringsleverandør", og hvor feltet dermed nulstilles`;
      case 'systemsUsages':
        return $localize`IT-Systemer som flyttes til "${this.defaultOrganizationName}", da de stadig er er i anvendelse i andre organisationer`;
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
  | 'systemsRightsHolder'
  | 'systemsExposingInterfaces'
  | 'systemsParentSystem'
  | 'systemsUsages'
  | 'systemsArchiveSupplier'
  | 'interfaces';
