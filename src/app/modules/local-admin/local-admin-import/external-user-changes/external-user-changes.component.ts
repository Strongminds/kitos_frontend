import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { AccordionComponent } from 'src/app/shared/components/accordion/accordion.component';
import { Store } from '@ngrx/store';
import { process } from '@progress/kendo-data-query';
import { BehaviorSubject, EMPTY, Observable, Subject, combineLatest, from, of } from 'rxjs';
import {
  catchError,
  expand,
  filter,
  map,
  mergeMap,
  reduce,
  startWith,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs/operators';
import { ExternalUserChangesInternalV2Service } from 'src/app/api/v2/api/externalUserChangesInternalV2.service';
import type { APIExternalUserChangeResponse } from 'src/app/api/v2/model/externalUserChangeResponse';
import { APIExternalUserChangeStatus } from 'src/app/api/v2/model/externalUserChangeStatus';
import { APIExternalUserChangeType } from 'src/app/api/v2/model/externalUserChangeType';
import { UserDeletionReviewService } from 'src/app/modules/organization/organization-users/delete-user-dialog/user-deletion-review.service';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { HideShowButtonComponent } from 'src/app/shared/components/grid/hide-show-button/hide-show-button.component';
import { LocalGridComponent } from 'src/app/shared/components/local-grid/local-grid.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { EXTERNAL_USER_CHANGES_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { PopupMessageType } from 'src/app/shared/enums/popup-message-type';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { BooleanChange } from 'src/app/shared/models/grid/grid-events.model';
import {
  type ExternalUserChangeRow,
  type ExternalUserChangesListResult,
  type ExternalUserChangesPage,
  ExternalUserChangesView,
} from 'src/app/shared/models/local-admin/external-user-changes.types';
import { UserDeletionReviewDecision } from 'src/app/shared/models/organization/organization-user/user-deletion-review.types';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { DeletionBatchReviewDialogComponent } from './deletion-batch-review-dialog.component';

interface ChangeActionResult {
  changeUuid: string;
  userName: string;
  success: boolean;
  message: string;
}

const MAX_SELECTION = 100;
const PAGE_SIZE = 200;
const CHANGE_STATUSES = Object.values(APIExternalUserChangeStatus);
const PENDING_ONLY_FIELDS = ['selected'];
const RESOLVED_ONLY_FIELDS = ['resolvedAt', 'resolvedByUserUuid'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isExternalUserChange(value: unknown): value is APIExternalUserChangeResponse {
  return (
    isRecord(value) &&
    typeof value['uuid'] === 'string' &&
    typeof value['externalUserUuid'] === 'string' &&
    typeof value['receivedAt'] === 'string' &&
    CHANGE_STATUSES.some((status) => status === value['status'])
  );
}

// Newtonsoft TypeNameHandling may wrap collections as { $type, $values }
function unwrapArray(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  if (isRecord(value) && Array.isArray(value['$values'])) return value['$values'];
  return undefined;
}

function parseExternalChangesPage(value: unknown, skip: number): ExternalUserChangesPage {
  const items = isRecord(value) ? unwrapArray(value['items']) : undefined;
  if (!isRecord(value) || typeof value['total'] !== 'number' || !items || !items.every(isExternalUserChange)) {
    throw new Error('Invalid external user changes response');
  }

  return {
    skip,
    total: value['total'],
    pendingCount: typeof value['pendingCount'] === 'number' ? value['pendingCount'] : 0,
    items,
  };
}

function toDate(value?: string | null): Date | null {
  return value ? new Date(value) : null;
}

@Component({
  selector: 'app-external-user-changes',
  templateUrl: './external-user-changes.component.html',
  styleUrl: './external-user-changes.component.scss',
  imports: [
    LocalGridComponent,
    DropdownComponent,
    ButtonComponent,
    HideShowButtonComponent,
    CheckboxComponent,
    AccordionComponent,
    ParagraphComponent,
  ],
})
export class ExternalUserChangesComponent extends BaseComponent implements OnInit {
  @ViewChild(LocalGridComponent) private grid?: LocalGridComponent<ExternalUserChangeRow>;
  @Output() public readonly pendingCountChange = new EventEmitter<number>();

  public readonly viewOptions: DropdownOption<ExternalUserChangesView>[] = [
    { name: $localize`Afventer`, value: ExternalUserChangesView.Pending },
    { name: $localize`Behandlede`, value: ExternalUserChangesView.Resolved },
  ];
  public selectedView = this.viewOptions[0];

  private readonly statusOptions = CHANGE_STATUSES.map((value) => ({
    name: this.statusLabel(value),
    value,
  }));

  public readonly defaultColumns: GridColumn[] = [
    {
      field: 'selected',
      title: $localize`Vælg`,
      style: 'checkbox',
      permissionsField: 'notSelectable',
      noFilter: true,
      sortable: false,
      required: true,
      hidden: false,
      width: 90,
    },
    { field: 'userName', title: $localize`Bruger`, style: 'primary', hidden: false },
    { field: 'email', title: $localize`Email`, hidden: false },
    {
      field: 'statusLabel',
      title: $localize`Status`,
      extraFilter: 'enum',
      extraData: this.statusOptions,
      hidden: false,
      width: 180,
    },
    { field: 'receivedAt', title: $localize`Modtaget`, style: 'date', filter: 'date', hidden: false },
    { field: 'resolvedAt', title: $localize`Behandlet`, style: 'date', filter: 'date', hidden: false },
    { field: 'occurredAt', title: $localize`Hændelse indtruffet`, style: 'date', filter: 'date', hidden: true },
    { field: 'changeTypeLabel', title: $localize`Ændringstype`, hidden: true },
    { field: 'externalUserUuid', title: $localize`Ekstern bruger-id`, hidden: true },
    { field: 'userUuid', title: $localize`Lokalt bruger-id`, hidden: true },
    { field: 'externalMessageId', title: $localize`Ekstern besked-id`, hidden: true },
    { field: 'resolvedByUserUuid', title: $localize`Behandlet af bruger-id`, hidden: true },
  ];

  public columns: GridColumn[] = this.defaultColumns;
  public viewColumns: GridColumn[] = [];
  public rows: ExternalUserChangeRow[] = [];
  public pendingCount = 0;
  public isLoading = false;
  public isResolving = false;
  public hasLoadError = false;
  public selectedChangeUuids = new Set<string>();
  private isReviewing = false;

  private readonly view$ = new BehaviorSubject(this.selectedView.value);
  private readonly refresh$ = new Subject<void>();
  private readonly currentOrganizationUuid = this.store.selectSignal(selectOrganizationUuid);
  private readonly organizationUuid = this.currentOrganizationUuid();
  private readonly organizationChanged$ = this.store
    .select(selectOrganizationUuid)
    .pipe(filter((uuid) => uuid !== this.organizationUuid));

  constructor(
    private readonly store: Store,
    private readonly api: ExternalUserChangesInternalV2Service,
    private readonly confirmActionService: ConfirmActionService,
    private readonly dialog: MatDialog,
    private readonly dialogOpener: DialogOpenerService,
    private readonly deletionReview: UserDeletionReviewService,
    private readonly notificationService: NotificationService,
    private readonly gridColumnStorageService: GridColumnStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    const organizationUuid = this.organizationUuid;
    if (!organizationUuid) return;

    this.columns =
      this.gridColumnStorageService.getColumns(EXTERNAL_USER_CHANGES_COLUMNS_ID, this.defaultColumns) ??
      this.defaultColumns;
    this.updateViewColumns();

    this.subscriptions.add(
      combineLatest([this.view$, this.refresh$.pipe(startWith(undefined))])
        .pipe(
          tap(() => {
            this.isLoading = true;
            this.hasLoadError = false;
            this.clearSelection();
          }),
          switchMap(([view]) =>
            this.loadAll(organizationUuid, view).pipe(
              catchError((error: unknown) => {
                this.isLoading = false;
                this.hasLoadError = true;
                this.rows = [];
                this.notificationService.showError(
                  this.getErrorMessage(error, $localize`Kunne ikke hente eksterne brugerændringer`),
                );
                return EMPTY;
              }),
            ),
          ),
          takeUntil(this.organizationChanged$),
        )
        .subscribe(({ items, pendingCount }) => {
          this.clearSelection();
          this.rows = items.map((item) => this.toRow(item));
          this.clampGridPage();
          this.pendingCount = pendingCount;
          this.pendingCountChange.emit(pendingCount);
          this.isLoading = false;
        }),
    );
  }

  public setView(option: DropdownOption<ExternalUserChangesView> | null | undefined): void {
    if (!option || this.selectedView.value === option.value) return;
    this.selectedView = option;
    this.updateViewColumns();
    this.view$.next(option.value);
  }

  public refresh(): void {
    this.refresh$.next();
  }

  public onColumnsChange(updatedColumns: GridColumn[]): void {
    this.columns = this.columns.map(
      (column) => updatedColumns.find((updated) => updated.field === column.field) ?? column,
    );
    this.gridColumnStorageService.setColumns(EXTERNAL_USER_CHANGES_COLUMNS_ID, this.columns);
    this.updateViewColumns();
  }

  public onCheckboxChange({ value, item }: BooleanChange<ExternalUserChangeRow>): void {
    if (this.selectionDisabled || !this.isPendingChange(item)) return;
    const nextSelection = new Set(this.selectedChangeUuids);
    if (value) {
      nextSelection.add(item.uuid);
    } else {
      nextSelection.delete(item.uuid);
    }
    this.applySelection(nextSelection);
  }

  public get allSelectableChangesSelected(): boolean {
    const selectableCount = this.pendingRows.length;
    return selectableCount > 0 && this.selectedChangeUuids.size === Math.min(selectableCount, MAX_SELECTION);
  }

  public selectAll(): void {
    if (this.selectionDisabled) return;
    const pendingRows = this.pendingRows;
    this.applySelection(new Set(pendingRows.slice(0, MAX_SELECTION).map((row) => row.uuid)));
    if (pendingRows.length > MAX_SELECTION) {
      this.notificationService.showError($localize`Du kan højst vælge ${MAX_SELECTION} ændringer ad gangen`);
    }
  }

  private get pendingRows(): ExternalUserChangeRow[] {
    return this.rows.filter((row) => this.isPendingChange(row));
  }

  private isPendingChange(row: ExternalUserChangeRow): boolean {
    return row.status === APIExternalUserChangeStatus.Pending;
  }

  public clearSelection(): void {
    this.applySelection(new Set<string>());
  }

  public resolveSelected(apply: boolean): void {
    const changeUuids = [...this.selectedChangeUuids];
    if (!changeUuids.length || this.selectionDisabled || this.isReviewing) return;
    if (apply) {
      this.reviewDeletions(changeUuids);
      return;
    }
    this.resolveBatch(changeUuids, false);
  }

  private reviewDeletions(changeUuids: string[]): void {
    const organizationUuid = this.currentOrganizationUuid();
    if (!organizationUuid || organizationUuid !== this.organizationUuid) return;
    const selectedRows = this.rows.filter((row) => this.selectedChangeUuids.has(row.uuid) && this.isPendingChange(row));
    if (selectedRows.length !== changeUuids.length) return;

    const users = selectedRows.map(({ userUuid, userName, email, uuid }) => ({
      userUuid,
      userName: userName || email || uuid,
    }));
    const reviews = this.deletionReview.createReviews(organizationUuid, users);
    const reviewDialog = reviews.length === 1
      ? this.dialogOpener.openUserDeletionReview(reviews[0])
      : this.dialog.open<DeletionBatchReviewDialogComponent, typeof reviews, boolean>(DeletionBatchReviewDialogComponent, {
          width: '980px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          data: reviews,
          ariaLabel: $localize`Gennemgå sletninger`,
        });

    this.watchReviewDialog<boolean | UserDeletionReviewDecision>(reviewDialog, (decision) => {
      if (this.isReviewApproved(decision) && this.isReviewedSelectionCurrent(organizationUuid, selectedRows)) {
        this.confirmDeletions(organizationUuid, selectedRows, changeUuids);
      }
    });
  }

  private isReviewApproved(decision: boolean | UserDeletionReviewDecision | undefined): boolean {
    return (
      decision === true ||
      decision === UserDeletionReviewDecision.Continue ||
      decision === UserDeletionReviewDecision.ContinueWithoutRemainingRoles
    );
  }

  private confirmDeletions(organizationUuid: string, selectedRows: ExternalUserChangeRow[], changeUuids: string[]): void {
    const confirmation = this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      title: $localize`Fjern brugernes adgang`,
      message: changeUuids.length === 1
        ? $localize`Den valgte bruger mister sin adgang til organisationen. Vil du fortsætte?`
        : $localize`De ${changeUuids.length} valgte brugere mister deres adgang til organisationen. Vil du fortsætte?`,
      onConfirm: () => {
        if (this.isReviewedSelectionCurrent(organizationUuid, selectedRows)) this.resolveBatch(changeUuids, true);
      },
    });
    this.watchReviewDialog(confirmation);
  }

  private isReviewedSelectionCurrent(organizationUuid: string, selection: ExternalUserChangeRow[]): boolean {
    return !this.subscriptions.closed && this.currentOrganizationUuid() === organizationUuid &&
      this.isPendingView && !this.selectionDisabled &&
      selection.length === this.selectedChangeUuids.size &&
      selection.every((row) => this.selectedChangeUuids.has(row.uuid) && this.rows.includes(row) && this.isPendingChange(row));
  }

  private watchReviewDialog<Result>(
    dialogRef: Pick<MatDialogRef<unknown, Result>, 'afterClosed' | 'close' | 'getState'>,
    onClosed?: (result: Result | undefined) => void,
  ): void {
    this.isReviewing = true;
    const subscription = dialogRef.afterClosed().pipe(takeUntil(this.organizationChanged$)).subscribe((result) => {
      this.isReviewing = false;
      onClosed?.(result);
    });
    subscription.add(() => {
      if (dialogRef.getState() !== MatDialogState.OPEN) return;
      this.isReviewing = false;
      dialogRef.close();
    });
    this.subscriptions.add(subscription);
  }

  public statusLabel(status?: APIExternalUserChangeStatus): string {
    switch (status) {
      case APIExternalUserChangeStatus.Pending:
        return $localize`Afventer`;
      case APIExternalUserChangeStatus.Applied:
        return $localize`Adgang fjernet`;
      case APIExternalUserChangeStatus.Dismissed:
        return $localize`Afvist`;
      default:
        return $localize`Ukendt`;
    }
  }

  private loadAll(
    organizationUuid: string,
    view: ExternalUserChangesView,
  ): Observable<ExternalUserChangesListResult> {
    const initialResult: ExternalUserChangesListResult = { items: [], pendingCount: 0 };
    const fetchPage = (skip: number) =>
      this.api
        .getSingleExternalUserChangesInternalV2List({
          organizationUuid,
          status: view === ExternalUserChangesView.Pending ? APIExternalUserChangeStatus.Pending : undefined,
          resolvedOnly: view === ExternalUserChangesView.Resolved,
          skip,
          take: PAGE_SIZE,
          sort: 'receivedAt',
          descending: true,
        })
        .pipe(map((response: unknown) => parseExternalChangesPage(response, skip)));

    return fetchPage(0).pipe(
      expand((page) => {
        const nextSkip = page.skip + page.items.length;
        return page.items.length > 0 && nextSkip < page.total ? fetchPage(nextSkip) : EMPTY;
      }),
      reduce(
        (acc, page) => ({ items: [...acc.items, ...page.items], pendingCount: page.pendingCount }),
        initialResult,
      ),
    );
  }

  private toRow(change: APIExternalUserChangeResponse): ExternalUserChangeRow {
    const status = change.status ?? APIExternalUserChangeStatus.Pending;
    return {
      uuid: change.uuid ?? '',
      userName: change.userName ?? '',
      email: change.email ?? '',
      externalUserUuid: change.externalUserUuid ?? '',
      userUuid: change.userUuid ?? '',
      externalMessageId: change.externalMessageId ?? '',
      changeTypeLabel: change.changeType === APIExternalUserChangeType.Deleted ? $localize`Sletning` : (change.changeType ?? ''),
      status,
      statusLabel: this.statusLabel(status),
      receivedAt: toDate(change.receivedAt),
      occurredAt: toDate(change.occurredAt),
      resolvedAt: toDate(change.resolvedAt),
      resolvedByUserUuid: change.resolvedByUserUuid ?? '',
      selected: false,
      notSelectable: status !== APIExternalUserChangeStatus.Pending,
    };
  }

  private applySelection(selection: Set<string>): void {
    this.selectedChangeUuids = selection;
    const limitReached = selection.size >= MAX_SELECTION;
    this.rows.forEach((row) => {
      row.selected = selection.has(row.uuid);
      row.notSelectable =
        this.selectionDisabled || !this.isPendingChange(row) || (limitReached && !row.selected);
    });
  }

  private updateViewColumns(): void {
    const excluded = this.isPendingView ? RESOLVED_ONLY_FIELDS : PENDING_ONLY_FIELDS;
    this.viewColumns = this.columns.filter((column) => !excluded.includes(column.field));
  }

  public get isPendingView(): boolean {
    return this.selectedView.value === ExternalUserChangesView.Pending;
  }

  public get selectionDisabled(): boolean {
    return this.isLoading || this.hasLoadError || this.isResolving;
  }

  private clampGridPage(): void {
    if (!this.grid) return;
    const state = this.grid.state;
    const total = process(this.rows, { filter: state.filter }).total;
    const take = state.all ? total : state.take;
    const lastPageSkip = take ? Math.max(0, Math.ceil(total / take) - 1) * take : 0;
    this.grid.onStateChange({ ...state, take, skip: Math.min(state.skip ?? 0, lastPageSkip) });
  }

  private resolveBatch(changeUuids: string[], apply: boolean): void {
    const organizationUuid = this.organizationUuid;
    if (
      !organizationUuid ||
      this.subscriptions.closed ||
      this.currentOrganizationUuid() !== organizationUuid ||
      this.selectionDisabled ||
      !changeUuids.every((uuid) => this.selectedChangeUuids.has(uuid))
    ) {
      return;
    }

    this.isResolving = true;
    this.applySelection(this.selectedChangeUuids);
    this.subscriptions.add(
      this.api
        .postSingleExternalUserChangesInternalV2ResolveBatch({
          organizationUuid,
          aPIBulkResolutionRequest: { changeUuids, apply },
        })
        .pipe(
          switchMap(() => this.verifyBatchResults(organizationUuid, changeUuids, apply)),
          catchError((error: unknown) => {
            this.notificationService.showError(
              this.getErrorMessage(error, $localize`De valgte brugerændringer kunne ikke behandles`),
            );
            return of(
              changeUuids.map((changeUuid) => ({
                changeUuid,
                userName: this.rowName(changeUuid),
                success: false,
                message: $localize`Resultatet kunne ikke bekræftes`,
              })),
            );
          }),
          takeUntil(this.organizationChanged$),
        )
        .subscribe((results) => {
          this.showBatchResults(results, apply);
          this.isResolving = false;
          this.clearSelection();
          this.refresh();
        }),
    );
  }

  private showBatchResults(results: ChangeActionResult[], apply: boolean): void {
    const failures = results.filter((result) => !result.success);
    if (failures.length > 0) {
      const summary = $localize`${results.length - failures.length} af ${results.length} ændringer blev behandlet.`;
      const details = failures.map((result) => `${result.userName}: ${result.message}`).join('; ');
      this.notificationService.showError(`${summary} ${details}`);
      return;
    }
    this.notificationService.show(
      apply ? $localize`Alle valgte brugerændringer blev anvendt` : $localize`Alle valgte ændringer blev afvist`,
      PopupMessageType.default,
    );
  }

  private verifyBatchResults(
    organizationUuid: string,
    changeUuids: string[],
    apply: boolean,
  ): Observable<ChangeActionResult[]> {
    const expectedStatus = apply ? APIExternalUserChangeStatus.Applied : APIExternalUserChangeStatus.Dismissed;
    return from(changeUuids).pipe(
      mergeMap(
        (changeUuid) =>
          this.api.getSingleExternalUserChangesInternalV2Detail({ organizationUuid, changeUuid }).pipe(
            map((response: unknown): ChangeActionResult => {
              if (!isExternalUserChange(response)) throw new Error('Invalid change detail response');
              const success = response.status === expectedStatus;
              return {
                changeUuid,
                userName: response.userName || this.rowName(changeUuid),
                success,
                message: success
                  ? apply
                    ? $localize`Adgang fjernet`
                    : $localize`Ændringen blev afvist`
                  : response.status === APIExternalUserChangeStatus.Pending
                    ? $localize`Ændringen afventer stadig behandling`
                    : $localize`Ændringen har status "${this.statusLabel(response.status)}"`,
              };
            }),
            catchError((error: unknown) =>
              of({
                changeUuid,
                userName: this.rowName(changeUuid),
                success: false,
                message: this.getErrorMessage(error, $localize`Resultatet kunne ikke bekræftes`),
              }),
            ),
          ),
        8,
      ),
      toArray(),
    );
  }

  private rowName(changeUuid: string): string {
    const row = this.rows.find((change) => change.uuid === changeUuid);
    return row?.userName || row?.email || changeUuid;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
      return $localize`Du har ikke tilladelse til at udføre denne handling.`;
    }
    return fallback;
  }
}
