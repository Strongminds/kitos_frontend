import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Organization } from 'src/app/shared/models/organization/organization.model';
import { DeleteOrganizationComponentStore } from './delete-organization.component-store';
import { RemovalConflict, RemovalConflictType } from './removal-conflict-table/removal-conflict-table.component';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './delete-organization-dialog.component.html',
  styleUrl: './delete-organization-dialog.component.scss',
  providers: [DeleteOrganizationComponentStore],
})
export class DeleteOrganizationDialogComponent implements OnInit {
  @Input() public organization!: Organization;

  public hasAcceptedConsequences: boolean = false;

  public readonly removalConflicts$ = this.componentStore.select((state) => state.consequences);
  public readonly simpleConflictTypeOptions: RemovalConflictType[] = [
    'contracts',
    'dprDataprocessor',
    'dprSubDataprocessor',
  ];
  public readonly otherConflictTypeOptions: RemovalConflictType[] = [
    'systemsRightsHolder',
    'systemsExposingInterfaces',
    'systemsParentSystem',
    'systemsUsages',
    'systemsArchiveSupplier',
    'interfaces',
  ];

  public readonly deletingOrganization$ = new BehaviorSubject<boolean>(false);

  constructor(
    private dialogRef: MatDialogRef<DeleteOrganizationDialogComponent>,
    private componentStore: DeleteOrganizationComponentStore
  ) {}

  public ngOnInit(): void {
    this.componentStore.getConsequences(of(this.organization.Uuid));
  }

  public onDelete(): void {}

  public onCancel(): void {
    this.dialogRef.close();
  }

  public hasAnyRemovalConflict(): Observable<boolean | undefined> {
    return this.componentStore
      .select((state) => state.consequences)
      .pipe(
        switchMap((consequences) => {
          if (consequences === undefined) {
            return of(undefined);
          }

          const conflictChecks$ = this.simpleConflictTypeOptions
            .concat(this.otherConflictTypeOptions)
            .map((type) => this.typeHasConflicts(type));

          return combineLatest(conflictChecks$).pipe(
            map((conflictResults) => conflictResults.some((hasConflict) => hasConflict))
          );
        })
      );
  }

  public getTitle(): string {
    return $localize`Slet` + ` "${this.organization.Name}"`;
  }

  public copyConflictsToClipboard(): void {}

  public canSubmit(): Observable<boolean> {
    return this.hasAnyRemovalConflict().pipe(
      map((hasConflicts) => {
        return hasConflicts === false || this.hasAcceptedConsequences;
      })
    );
  }

  public typeHasConflicts(conflicType: RemovalConflictType): Observable<boolean> {
    return this.getSpecificConflicts(conflicType).pipe(map((conflicts) => conflicts.length > 0));
  }

  public getSpecificConflicts(type: RemovalConflictType): Observable<RemovalConflict[]> {
    return this.removalConflicts$.pipe(
      map((conflicts) => {
        switch (type) {
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
            throw new Error(`Unknown removal conflict type: ${type}`);
        }
      }),
      map((conflicts) => conflicts ?? [])
    );
  }
}
