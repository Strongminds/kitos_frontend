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

  public hasConflicts(): Observable<boolean | undefined> {
    return of(true);
  }

  public getTitle(): string {
    return $localize`Slet` + ' "' + this.organization.Name + '"';
  }

  public canSubmit(): Observable<boolean> {
    return this.hasConflicts().pipe(
      map((hasConflicts) => {
        return hasConflicts === false || this.hasAcceptedConsequences;
      })
    );
  }
}
