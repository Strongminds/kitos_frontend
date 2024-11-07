import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Organization } from 'src/app/shared/models/organization/organization.model';
import { DeleteOrganizationComponentStore } from './delete-organization.component-store';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './delete-organization-dialog.component.html',
  styleUrl: './delete-organization-dialog.component.scss',
  providers: [DeleteOrganizationComponentStore],
})
export class DeleteOrganizationDialogComponent implements OnInit {
  @Input() public organization!: Organization;

  public hasAcceptedConsequences: boolean = false;

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

  public hasRemovalConflicts(): Observable<boolean | undefined> {
    return this.componentStore
      .select((state) => state.consequences)
      .pipe(
        map((consequences) => {
          if (consequences === undefined) {
            return undefined;
          }

          /* return (
            this.hasConflicts(consequences.contractsInOtherOrganizationsWhereOrgIsSupplier) ||
            this.hasConflicts(consequences.dprInOtherOrganizationsWhereOrgIsDataProcessor) ||
            this.hasConflicts(consequences.dprInOtherOrganizationsWhereOrgIsSubDataProcessor) ||
            this.hasConflicts(consequences.interfacesExposedOnSystemsOutsideTheOrganization) ||
            this.hasConflicts(consequences.systemsExposingInterfacesDefinedInOtherOrganizations) ||
            this.hasConflicts(consequences.systemsInOtherOrganizationsWhereOrgIsRightsHolder) ||
            this.hasConflicts(consequences.systemsSetAsParentSystemToSystemsInOtherOrganizations) ||
            this.hasConflicts(consequences.systemsWhereOrgIsArchiveSupplier) ||
            this.hasConflicts(consequences.systemsWithUsagesOutsideTheOrganization)
          ); */
          return false;
        })
      );
  }

  public getTitle(): string {
    return $localize`Slet` + ' "' + this.organization.Name + '"';
  }

  public canSubmit(): Observable<boolean> {
    return this.hasRemovalConflicts().pipe(
      map((hasConflicts) => {
        return hasConflicts === false || this.hasAcceptedConsequences;
      })
    );
  }

  private hasConflicts<T>(conflicts: T[] | undefined): boolean {
    return conflicts !== undefined && conflicts.length > 0;
  }
}
