import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, first, map, Observable, of, switchMap } from 'rxjs';
import { Organization } from 'src/app/shared/models/organization/organization.model';
import { DeleteOrganizationComponentStore } from './delete-organization.component-store';
import { RemovalConflict, RemovalConflictType } from './removal-conflict-table/removal-conflict-table.component';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { Actions, ofType } from '@ngrx/effects';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { Store } from '@ngrx/store';
import { getConflictDescription } from './org-removal-conflict.helper';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './delete-organization-dialog.component.html',
  styleUrl: './delete-organization-dialog.component.scss',
  providers: [DeleteOrganizationComponentStore],
})
export class DeleteOrganizationDialogComponent implements OnInit {
  @Input() public organization!: Organization;

  public hasAcceptedConsequences: boolean = false;
  public isCopying: boolean = false;

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

  public readonly conflictContentId = 'conflict-content';

  constructor(
    private dialogRef: MatDialogRef<DeleteOrganizationDialogComponent>,
    private componentStore: DeleteOrganizationComponentStore,
    private confirmActionService: ConfirmActionService,
    private actions$: Actions,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.componentStore.getConsequences(of(this.organization.Uuid));

    this.actions$
      .pipe(ofType(OrganizationActions.deleteOrganizationSuccess, OrganizationActions.deleteOrganizationError))
      .subscribe(() => {
        this.deletingOrganization$.next(false);
      });
  }

  public onDelete(): void {
    this.actions$.pipe(ofType(OrganizationActions.deleteOrganizationSuccess), first()).subscribe(() => {
      this.onCancel();
    });
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil slette "${this.organization.Name}"?`,
      onConfirm: () => {
        this.deletingOrganization$.next(true);
        this.store.dispatch(OrganizationActions.deleteOrganization(this.organization.Uuid));
      },
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public hasAnyRemovalConflict(): Observable<boolean | undefined> {
    return this.hasConflicts(this.simpleConflictTypeOptions.concat(this.otherConflictTypeOptions));
  }

  public hasOtherTypeConflicts(): Observable<boolean | undefined> {
    return this.hasConflicts(this.otherConflictTypeOptions);
  }

  public hasConflicts(types: RemovalConflictType[]): Observable<boolean | undefined> {
    return this.componentStore
      .select((state) => state.consequences)
      .pipe(
        switchMap((consequences) => {
          if (consequences === undefined) {
            return of(undefined);
          }

          const conflictChecks$ = types.map((type) => this.typeHasConflicts(type));

          return combineLatest(conflictChecks$).pipe(
            map((conflictResults) => conflictResults.some((hasConflict) => hasConflict))
          );
        })
      );
  }

  public getTableTitle(type: RemovalConflictType): string {
    return getConflictDescription(type, this.organization.Name, 'Fælles Kommune');
  }

  public getTitle(): string {
    return $localize`Slet` + ` "${this.organization.Name}"`;
  }

  public copyConflictsToClipboard(): void {
    this.isCopying = true;
    this.cdr.detectChanges();
    this.copyPageContentToClipBoard(this.conflictContentId);
    this.isCopying = false;
    this.notificationService.showDefault($localize`Konsekvenserne er kopieret til udklipsholderen`);
  }

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

  private copyPageContentToClipBoard(contentRootId: string) {
    const currentWindow = window.getSelection();
    if (!currentWindow) return;
    window.getSelection()?.selectAllChildren(document.getElementById(contentRootId) as Node);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }
}
