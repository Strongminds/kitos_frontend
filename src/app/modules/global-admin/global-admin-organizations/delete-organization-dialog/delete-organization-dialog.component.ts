import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { Organization } from 'src/app/shared/models/organization/organization.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { DeleteOrganizationComponentStore } from './delete-organization.component-store';
import { RemovalConflict, RemovalConflictType } from './removal-conflict-table/removal-conflict-table.component';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './delete-organization-dialog.component.html',
  styleUrl: './delete-organization-dialog.component.scss',
  providers: [DeleteOrganizationComponentStore],
})
export class DeleteOrganizationDialogComponent extends BaseComponent implements OnInit {
  @Input() public organization!: Organization;

  public hasAcceptedConsequences: boolean = false;
  public isCopying: boolean = false;

  public readonly removalConflicts$ = this.componentStore.removalConflicts$;
  public readonly isLoading$ = this.componentStore.isLoading$;
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
  ) {
    super();
  }

  public ngOnInit(): void {
    this.componentStore.getConsequences(of(this.organization.Uuid));

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationActions.deleteOrganizationSuccess)).subscribe(() => {
        this.deletingOrganization$.next(false);
        this.onCancel();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationActions.deleteOrganizationError)).subscribe(() => {
        this.deletingOrganization$.next(false);
      })
    );
  }

  public onDelete(): void {
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
      .select((state) => state.removalConflicts)
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

  public getTitle(): string {
    return $localize`Slet "${this.organization.Name}"`;
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
    return this.componentStore.getSpecificConflicts(conflicType).pipe(map((conflicts) => conflicts.length > 0));
  }

  public getSpecificConflicts(type: RemovalConflictType): Observable<RemovalConflict[]> {
    return this.componentStore.getSpecificConflicts(type);
  }

  private copyPageContentToClipBoard(contentRootId: string) {
    const currentWindow = window.getSelection();
    if (!currentWindow) return;
    window.getSelection()?.selectAllChildren(document.getElementById(contentRootId) as Node);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }
}
