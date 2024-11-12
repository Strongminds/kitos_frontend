import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { map, mergeMap, Observable, tap } from 'rxjs';
import {
  APIInterfacesExposedOutsideTheOrganizationResponseDTO,
  APIMultipleConflictsResponseDTO,
  APIOrganizationRemovalConflictsResponseDTO,
  APISimpleConflictResponseDTO,
  APISystemWithUsageOutsideOrganizationConflictResponseDTO,
  APIV2OrganizationsInternalINTERNALService,
} from 'src/app/api/v2';
import { RemovalConflict } from './removal-conflict-table/removal-conflict-table.component';

interface State {
  consequences?: OrganizationRemovalConflicts;
  isLoading: boolean;
}

@Injectable()
export class DeleteOrganizationComponentStore extends ComponentStore<State> {
  constructor(private apiService: APIV2OrganizationsInternalINTERNALService) {
    super({ consequences: undefined, isLoading: false });
  }

  private updateConsequences = this.updater(
    (state, consequences: OrganizationRemovalConflicts): State => ({
      ...state,
      consequences,
    })
  );

  private setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));

  public getConsequences = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((organizationUuid) =>
        this.apiService.getSingleOrganizationsInternalV2GetConflicts({ organizationUuid }).pipe(
          map((conflictsDto) => mapConflictsDtoToOrganizationRemovalConflicts(conflictsDto)),
          tapResponse(
            (conflicts) => this.updateConsequences(conflicts),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        )
      )
    )
  );
}

export interface OrganizationRemovalConflicts {
  contractsInOtherOrganizationsWhereOrgIsSupplier: RemovalConflict[];
  dprInOtherOrganizationsWhereOrgIsDataProcessor: RemovalConflict[];
  dprInOtherOrganizationsWhereOrgIsSubDataProcessor: RemovalConflict[];
  systemsExposingInterfacesDefinedInOtherOrganizations: RemovalConflict[];
  systemsSetAsParentSystemToSystemsInOtherOrganizations: RemovalConflict[];
  systemsInOtherOrganizationsWhereOrgIsRightsHolder: RemovalConflict[];
  systemsWhereOrgIsArchiveSupplier: RemovalConflict[];
  interfacesExposedOnSystemsOutsideTheOrganization: RemovalConflict[];
  systemsWithUsagesOutsideTheOrganization: RemovalConflict[];
}

function mapConflictsDtoToOrganizationRemovalConflicts(
  conflictsDto: APIOrganizationRemovalConflictsResponseDTO
): OrganizationRemovalConflicts {
  const conflicts: OrganizationRemovalConflicts = {
    contractsInOtherOrganizationsWhereOrgIsSupplier:
      conflictsDto.contractsInOtherOrganizationsWhereOrgIsSupplier?.map(mapSimpleConflictToTableItem) ?? [],
    dprInOtherOrganizationsWhereOrgIsDataProcessor:
      conflictsDto.dprInOtherOrganizationsWhereOrgIsDataProcessor?.map(mapSimpleConflictToTableItem) ?? [],
    dprInOtherOrganizationsWhereOrgIsSubDataProcessor:
      conflictsDto.dprInOtherOrganizationsWhereOrgIsSubDataProcessor?.map(mapSimpleConflictToTableItem) ?? [],
    interfacesExposedOnSystemsOutsideTheOrganization:
      conflictsDto.interfacesExposedOnSystemsOutsideTheOrganization?.map(
        mapInterfacesExposedOutsideTheOrganizationToTableItem
      ) ?? [],
    systemsExposingInterfacesDefinedInOtherOrganizations:
      conflictsDto.systemsExposingInterfacesDefinedInOtherOrganizations?.flatMap(mapMultipleConflictsToTableItem) ?? [],
    systemsInOtherOrganizationsWhereOrgIsRightsHolder:
      conflictsDto.systemsInOtherOrganizationsWhereOrgIsRightsHolder?.map(mapSimpleConflictToTableItem) ?? [],
    systemsSetAsParentSystemToSystemsInOtherOrganizations:
      conflictsDto.systemsSetAsParentSystemToSystemsInOtherOrganizations?.flatMap(mapMultipleConflictsToTableItem) ??
      [],
    systemsWhereOrgIsArchiveSupplier:
      conflictsDto.systemsWhereOrgIsArchiveSupplier?.map(mapSimpleConflictToTableItem) ?? [],
    systemsWithUsagesOutsideTheOrganization:
      conflictsDto.systemsWithUsagesOutsideTheOrganization?.flatMap(
        mapSystemUsageOutsideOrganizationConflictToTableItem
      ) ?? [],
  };
  return conflicts;
}

function mapSimpleConflictToTableItem(conflict: APISimpleConflictResponseDTO): RemovalConflict {
  return {
    mainEntityName: undefined,
    entityName: conflict.entityName ?? '',
    organizationName: conflict.organizationName ?? '',
  };
}

function mapMultipleConflictsToTableItem(multiConflict: APIMultipleConflictsResponseDTO): RemovalConflict[] {
  return (multiConflict.conflicts ?? [])
    .map(mapSimpleConflictToTableItem)
    .map((conflict) => ({ ...conflict, mainEntityName: multiConflict.mainEntityName }));
}

function mapSystemUsageOutsideOrganizationConflictToTableItem(
  conflict: APISystemWithUsageOutsideOrganizationConflictResponseDTO
): RemovalConflict[] {
  return (conflict.organizationNames ?? []).map((organizationName) => ({
    mainEntityName: undefined,
    entityName: conflict.systemName ?? '',
    organizationName: organizationName ?? '',
  }));
}

function mapInterfacesExposedOutsideTheOrganizationToTableItem(
  conflict: APIInterfacesExposedOutsideTheOrganizationResponseDTO
): RemovalConflict {
  return {
    mainEntityName: conflict.exposedInterfaceName,
    entityName: conflict.exposingSystemName ?? '',
    organizationName: conflict.organizationName ?? '',
  };
}
