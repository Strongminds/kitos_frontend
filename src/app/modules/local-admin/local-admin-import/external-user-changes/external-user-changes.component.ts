import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, EMPTY, Observable, Subject, combineLatest, from, of } from 'rxjs';
import { catchError, expand, filter, map, mergeMap, reduce, startWith, switchMap, tap, toArray } from 'rxjs/operators';
import { ExternalUserChangesInternalV2Service } from 'src/app/api/v2/api/externalUserChangesInternalV2.service';
import { APIExternalUserChangeResponse } from 'src/app/api/v2/model/externalUserChangeResponse';
import { APIExternalUserChangeStatus } from 'src/app/api/v2/model/externalUserChangeStatus';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { HideShowButtonComponent } from 'src/app/shared/components/grid/hide-show-button/hide-show-button.component';
import { LocalGridComponent } from 'src/app/shared/components/local-grid/local-grid.component';
import { SegmentButtonOption, SegmentComponent } from 'src/app/shared/components/segment/segment.component';
import { EXTERNAL_USER_CHANGES_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { PopupMessageType } from 'src/app/shared/enums/popup-message-type';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { BooleanChange } from 'src/app/shared/models/grid/grid-events.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

type ViewState = 'pending' | 'resolved';

export interface ExternalUserChangeRow {
  uuid: string;
  userName: string;
  email: string;
  externalUserUuid: string;
  userUuid: string;
  externalMessageId: string;
  changeTypeLabel: string;
  status: APIExternalUserChangeStatus;
  statusLabel: string;
  receivedAt: Date | null;
  occurredAt: Date | null;
  resolvedAt: Date | null;
  resolvedByUserUuid: string;
  selected: boolean;
  notSelectable: boolean;
}

interface ExternalChangesPage {
  skip: number;
  total: number;
  pendingCount: number;
  items: APIExternalUserChangeResponse[];
}

interface ChangeActionResult {
  changeUuid: string;
  userName: string;
  success: boolean;
  message: string;
}

const MAX_SELECTION = 100;
const PAGE_SIZE = 200;
const CHANGE_STATUSES: APIExternalUserChangeStatus[] = ['Pending', 'Applied', 'Dismissed'];
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
    CHANGE_STATUSES.includes(value['status'] as APIExternalUserChangeStatus)
  );
}

// Newtonsoft TypeNameHandling may wrap collections as { $type, $values }
function unwrapArray(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  if (isRecord(value) && Array.isArray(value['$values'])) return value['$values'];
  return undefined;
}

function parseExternalChangesPage(value: unknown, skip: number): ExternalChangesPage {
  const items = isRecord(value) ? unwrapArray(value['items']) : undefined;
  if (!isRecord(value) || typeof value['total'] !== 'number' || !items || !items.every(isExternalUserChange)) {
    throw new Error('Invalid external user changes response');
  }

  return {
    skip,
    total: value['total'] as number,
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
  imports: [LocalGridComponent, SegmentComponent, ButtonComponent, HideShowButtonComponent],
})
export class ExternalUserChangesComponent extends BaseComponent implements OnInit {
  @Output() public readonly pendingCountChange = new EventEmitter<number>();

  public readonly viewOptions: SegmentButtonOption<ViewState>[] = [
    { text: $localize`Afventer`, value: 'pending', dataCy: 'pending-tab' },
    { text: $localize`Behandlede`, value: 'resolved', dataCy: 'resolved-tab' },
  ];

  private readonly statusOptions = [
    { name: this.statusLabel('Pending'), value: 'Pending' },
    { name: this.statusLabel('Applied'), value: 'Applied' },
    { name: this.statusLabel('Dismissed'), value: 'Dismissed' },
  ];

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

  public activeView: ViewState = 'pending';
  public columns: GridColumn[] = this.defaultColumns;
  public viewColumns: GridColumn[] = [];
  public rows: ExternalUserChangeRow[] = [];
  public pendingCount = 0;
  public isLoading = false;
  public isResolving = false;
  public hasLoadError = false;
  public selectedChangeUuids = new Set<string>();
  public actionResults: ChangeActionResult[] = [];

  private readonly view$ = new BehaviorSubject<ViewState>('pending');
  private readonly refresh$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly api: ExternalUserChangesInternalV2Service,
    private readonly confirmActionService: ConfirmActionService,
    private readonly notificationService: NotificationService,
    private readonly gridColumnStorageService: GridColumnStorageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.columns =
      this.gridColumnStorageService.getColumns(EXTERNAL_USER_CHANGES_COLUMNS_ID, this.defaultColumns) ??
      this.defaultColumns;
    this.updateViewColumns();

    this.subscriptions.add(
      combineLatest([
        this.store.select(selectOrganizationUuid).pipe(filter((uuid): uuid is string => !!uuid)),
        this.view$,
        this.refresh$.pipe(startWith(undefined)),
      ])
        .pipe(
          tap(() => {
            this.isLoading = true;
            this.hasLoadError = false;
          }),
          switchMap(([organizationUuid, view]) =>
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
        )
        .subscribe(({ items, pendingCount }) => {
          this.clearSelection();
          this.rows = items.map((item) => this.toRow(item));
          this.pendingCount = pendingCount;
          this.pendingCountChange.emit(pendingCount);
          this.isLoading = false;
        }),
    );
  }

  public setView(view: ViewState): void {
    if (this.activeView === view) return;
    this.activeView = view;
    this.actionResults = [];
    this.updateViewColumns();
    this.view$.next(view);
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
    if (this.isResolving || item.status !== 'Pending') return;
    const nextSelection = new Set(this.selectedChangeUuids);
    if (value) {
      nextSelection.add(item.uuid);
    } else {
      nextSelection.delete(item.uuid);
    }
    this.applySelection(nextSelection);
  }

  public selectAll(): void {
    const selectable = this.rows.filter((row) => row.status === 'Pending').slice(0, MAX_SELECTION);
    this.applySelection(new Set(selectable.map((row) => row.uuid)));
    if (this.rows.filter((row) => row.status === 'Pending').length > MAX_SELECTION) {
      this.notificationService.showError($localize`Du kan højst vælge 100 ændringer ad gangen`);
    }
  }

  public clearSelection(): void {
    this.applySelection(new Set<string>());
  }

  public resolveSelected(apply: boolean): void {
    const changeUuids = [...this.selectedChangeUuids];
    if (!changeUuids.length || this.isResolving) return;
    if (apply) {
      this.confirmActionService.confirmAction({
        category: ConfirmActionCategory.Warning,
        title: $localize`Fjern brugernes adgang`,
        message: $localize`Hvis du anvender disse sletninger, mister ${changeUuids.length} valgte brugere deres adgang til organisationen. Vil du fortsætte?`,
        onConfirm: () => this.resolveBatch(changeUuids, true),
      });
      return;
    }
    this.resolveBatch(changeUuids, false);
  }

  public statusLabel(status?: APIExternalUserChangeStatus): string {
    switch (status) {
      case 'Pending':
        return $localize`Afventer`;
      case 'Applied':
        return $localize`Adgang fjernet`;
      case 'Dismissed':
        return $localize`Afvist`;
      default:
        return $localize`Ukendt`;
    }
  }

  private loadAll(
    organizationUuid: string,
    view: ViewState,
  ): Observable<{ items: APIExternalUserChangeResponse[]; pendingCount: number }> {
    const fetchPage = (skip: number) =>
      this.api
        .getSingleExternalUserChangesInternalV2List({
          organizationUuid,
          status: view === 'pending' ? 'Pending' : undefined,
          resolvedOnly: view === 'resolved',
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
        { items: [] as APIExternalUserChangeResponse[], pendingCount: 0 },
      ),
    );
  }

  private toRow(change: APIExternalUserChangeResponse): ExternalUserChangeRow {
    const status = change.status ?? 'Pending';
    return {
      uuid: change.uuid ?? '',
      userName: change.userName ?? '',
      email: change.email ?? '',
      externalUserUuid: change.externalUserUuid ?? '',
      userUuid: change.userUuid ?? '',
      externalMessageId: change.externalMessageId ?? '',
      changeTypeLabel: change.changeType === 'Deleted' ? $localize`Sletning` : (change.changeType ?? ''),
      status,
      statusLabel: this.statusLabel(status),
      receivedAt: toDate(change.receivedAt),
      occurredAt: toDate(change.occurredAt),
      resolvedAt: toDate(change.resolvedAt),
      resolvedByUserUuid: change.resolvedByUserUuid ?? '',
      selected: false,
      notSelectable: status !== 'Pending',
    };
  }

  private applySelection(selection: Set<string>): void {
    this.selectedChangeUuids = selection;
    const limitReached = selection.size >= MAX_SELECTION;
    this.rows.forEach((row) => {
      row.selected = selection.has(row.uuid);
      row.notSelectable =
        this.isResolving || row.status !== 'Pending' || (limitReached && !row.selected);
    });
  }

  private updateViewColumns(): void {
    const excluded = this.activeView === 'pending' ? RESOLVED_ONLY_FIELDS : PENDING_ONLY_FIELDS;
    this.viewColumns = this.columns.filter((column) => !excluded.includes(column.field));
  }

  private resolveBatch(changeUuids: string[], apply: boolean): void {
    const organizationUuid = this.currentOrganizationUuid();
    this.isResolving = true;
    this.applySelection(this.selectedChangeUuids);
    this.actionResults = [];
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
        )
        .subscribe((results) => {
          this.actionResults = results;
          const failures = results.filter((result) => !result.success).length;
          if (failures) {
            this.notificationService.showError(
              $localize`${results.length - failures} af ${results.length} ændringer blev behandlet; se resultatet for hver bruger.`,
            );
          } else {
            this.notificationService.show(
              apply ? $localize`Alle valgte brugerændringer blev anvendt` : $localize`Alle valgte ændringer blev afvist`,
              PopupMessageType.default,
            );
          }
          this.isResolving = false;
          this.clearSelection();
          this.refresh();
        }),
    );
  }

  private verifyBatchResults(
    organizationUuid: string,
    changeUuids: string[],
    apply: boolean,
  ): Observable<ChangeActionResult[]> {
    const expectedStatus: APIExternalUserChangeStatus = apply ? 'Applied' : 'Dismissed';
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
                  : response.status === 'Pending'
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

  private currentOrganizationUuid(): string {
    const organizationUuid = this.store.selectSignal(selectOrganizationUuid)();
    if (!organizationUuid) throw new Error('Organization is not selected');
    return organizationUuid;
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
