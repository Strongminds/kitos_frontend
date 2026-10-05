import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, EMPTY, Observable, combineLatest, from, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import {
  ExternalUserChangesInternalV2Service,
  GetSingleExternalUserChangesInternalV2ListRequestParams,
} from 'src/app/api/v2/api/externalUserChangesInternalV2.service';
import { APIExternalUserChangeResponse } from 'src/app/api/v2/model/externalUserChangeResponse';
import { APIExternalUserChangeStatus } from 'src/app/api/v2/model/externalUserChangeStatus';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OverviewHeaderComponent } from 'src/app/shared/components/overview-header/overview-header.component';
import { PopupMessageType } from 'src/app/shared/enums/popup-message-type';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

type ChangeSort = 'receivedAt' | 'userName' | 'status';
type ViewState = 'pending' | 'resolved';

interface ExternalChangesPage {
  total: number;
  pendingCount: number;
  items: APIExternalUserChangeResponse[];
}

interface ExternalChangeQuery {
  view: ViewState;
  skip: number;
  take: number;
  search: string;
  sort: ChangeSort;
  descending: boolean;
}

interface ChangeActionResult {
  changeUuid: string;
  userName: string;
  success: boolean;
  message: string;
}

const CHANGE_STATUSES: APIExternalUserChangeStatus[] = ['Pending', 'Applied', 'Dismissed'];

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

function parseExternalChangesPage(value: unknown): ExternalChangesPage {
  if (
    !isRecord(value) ||
    typeof value['total'] !== 'number' ||
    typeof value['pendingCount'] !== 'number' ||
    !Array.isArray(value['items']) ||
    !value['items'].every(isExternalUserChange)
  ) {
    throw new Error('Invalid external user changes response');
  }

  return {
    total: value['total'] as number,
    pendingCount: value['pendingCount'] as number,
    items: value['items'],
  };
}

@Component({
  selector: 'app-external-user-changes',
  templateUrl: './external-user-changes.component.html',
  styleUrl: './external-user-changes.component.scss',
  imports: [DatePipe, OverviewHeaderComponent, ReactiveFormsModule],
})
export class ExternalUserChangesComponent extends BaseComponent implements OnInit {
  public readonly searchControl = new FormControl('', { nonNullable: true });
  public readonly pageSizes = [25, 50, 100, 200];
  public activeView: ViewState = 'pending';
  public items: APIExternalUserChangeResponse[] = [];
  public total = 0;
  public pendingCount = 0;
  public isLoading = false;
  public isResolving = false;
  public hasLoadError = false;
  public expandedChangeUuid?: string;
  public details = new Map<string, APIExternalUserChangeResponse>();
  public detailLoading = new Set<string>();
  public detailErrors = new Map<string, string>();
  public selectedChangeUuids = new Set<string>();
  public actionResults: ChangeActionResult[] = [];

  private readonly query$ = new BehaviorSubject<ExternalChangeQuery>({
    view: 'pending',
    skip: 0,
    take: 50,
    search: '',
    sort: 'receivedAt',
    descending: true,
  });

  constructor(
    private readonly store: Store,
    private readonly api: ExternalUserChangesInternalV2Service,
    private readonly confirmActionService: ConfirmActionService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((search) => {
        this.updateQuery({ search, skip: 0 });
      }),
    );

    this.subscriptions.add(
      combineLatest([this.store.select(selectOrganizationUuid).pipe(filter((uuid): uuid is string => !!uuid)), this.query$])
        .pipe(
          tap(() => {
            this.isLoading = true;
            this.hasLoadError = false;
          }),
          switchMap(([organizationUuid, query]) =>
            this.api
              .getSingleExternalUserChangesInternalV2List(this.createListRequest(organizationUuid, query))
              .pipe(
                map(parseExternalChangesPage),
                catchError((error: unknown) => {
                  this.isLoading = false;
                  this.hasLoadError = true;
                  this.notificationService.showError(
                    this.getErrorMessage(error, $localize`Kunne ikke hente eksterne brugerændringer`),
                  );
                  return EMPTY;
                }),
              ),
          ),
        )
        .subscribe((page) => {
          this.items = page.items;
          this.total = page.total;
          this.pendingCount = page.pendingCount;
          this.isLoading = false;
          this.clearSelection();
        }),
    );
  }

  public setView(view: ViewState): void {
    if (this.query$.value.view === view) return;
    this.activeView = view;
    this.updateQuery({ view, skip: 0 });
  }

  public sortBy(sort: ChangeSort): void {
    const query = this.query$.value;
    this.updateQuery({
      sort,
      descending: query.sort === sort ? !query.descending : false,
      skip: 0,
    });
  }

  public setPageSize(event: Event): void {
    const take = Number((event.target as HTMLSelectElement).value);
    if (!this.pageSizes.includes(take)) return;
    this.updateQuery({ take, skip: 0 });
  }

  public changePage(direction: -1 | 1): void {
    const nextSkip = this.query$.value.skip + direction * this.query$.value.take;
    if (nextSkip < 0 || nextSkip >= this.total) return;
    this.updateQuery({ skip: nextSkip });
  }

  public toggleSelection(change: APIExternalUserChangeResponse): void {
    if (!change.uuid || change.status !== 'Pending' || this.isResolving) return;
    const nextSelection = new Set(this.selectedChangeUuids);
    if (nextSelection.has(change.uuid)) {
      nextSelection.delete(change.uuid);
    } else if (nextSelection.size < 100) {
      nextSelection.add(change.uuid);
    } else {
      this.notificationService.showError($localize`Du kan højst vælge 100 ændringer ad gangen`);
      return;
    }
    this.selectedChangeUuids = nextSelection;
  }

  public isSelected(change: APIExternalUserChangeResponse): boolean {
    return !!change.uuid && this.selectedChangeUuids.has(change.uuid);
  }

  public isAllVisibleSelected(): boolean {
    const selectable = this.items.filter((change) => change.status === 'Pending' && !!change.uuid);
    return selectable.length > 0 && selectable.every((change) => this.selectedChangeUuids.has(change.uuid!));
  }

  public toggleVisibleSelection(): void {
    const selectable = this.items.filter((change) => change.status === 'Pending' && !!change.uuid);
    const nextSelection = new Set(this.selectedChangeUuids);
    if (selectable.every((change) => nextSelection.has(change.uuid!))) {
      selectable.forEach((change) => nextSelection.delete(change.uuid!));
    } else {
      for (const change of selectable) {
        if (nextSelection.size >= 100) break;
        nextSelection.add(change.uuid!);
      }
    }
    if (nextSelection.size === 100 && selectable.some((change) => !nextSelection.has(change.uuid!))) {
      this.notificationService.showError($localize`Du kan højst vælge 100 ændringer ad gangen`);
    }
    this.selectedChangeUuids = nextSelection;
  }

  public toggleDetails(change: APIExternalUserChangeResponse): void {
    if (!change.uuid) return;
    if (this.expandedChangeUuid === change.uuid) {
      this.expandedChangeUuid = undefined;
      return;
    }
    this.expandedChangeUuid = change.uuid;
    if (this.details.has(change.uuid) || this.detailLoading.has(change.uuid)) return;

    this.setDetailsLoading(change.uuid, true);
    this.detailErrors = new Map(this.detailErrors);
    this.detailErrors.delete(change.uuid);
    this.api
      .getSingleExternalUserChangesInternalV2Detail({
        organizationUuid: this.currentOrganizationUuid(),
        changeUuid: change.uuid,
      })
      .pipe(
        map((response) => {
          if (!isExternalUserChange(response)) throw new Error('Invalid external user change detail response');
          return response;
        }),
        catchError((error: unknown) => {
          const message = this.getErrorMessage(error, $localize`Kunne ikke hente detaljerne for ændringen`);
          this.setDetailError(change.uuid!, message);
          this.notificationService.showError(message);
          return EMPTY;
        }),
      )
      .subscribe((detail) => {
        this.details = new Map(this.details).set(change.uuid!, detail);
        this.setDetailsLoading(change.uuid!, false);
      });
  }

  public resolveOne(change: APIExternalUserChangeResponse, apply: boolean): void {
    if (change.status !== 'Pending' || !change.uuid || this.isResolving) return;
    const name = change.userName || change.email || change.externalUserUuid || $localize`ukendt bruger`;
    if (apply) {
      this.confirmActionService.confirmAction({
        category: ConfirmActionCategory.Warning,
        title: $localize`Fjern brugerens adgang`,
        message: $localize`Hvis du anvender denne sletning, mister ${name} sin adgang til organisationen. Vil du fortsætte?`,
        onConfirm: () => this.resolveSingle(change, true),
      });
      return;
    }
    this.resolveSingle(change, false);
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

  public pageNumber(): number {
    return Math.floor(this.query$.value.skip / this.query$.value.take) + 1;
  }

  public querySort(): ChangeSort {
    return this.query$.value.sort;
  }

  public queryDescending(): boolean {
    return this.query$.value.descending;
  }

  public queryTake(): number {
    return this.query$.value.take;
  }

  public pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.query$.value.take));
  }

  public rangeStart(): number {
    return this.total === 0 ? 0 : this.query$.value.skip + 1;
  }

  public rangeEnd(): number {
    return Math.min(this.query$.value.skip + this.query$.value.take, this.total);
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

  public refresh(): void {
    this.query$.next({ ...this.query$.value });
  }

  private resolveSingle(change: APIExternalUserChangeResponse, apply: boolean): void {
    const changeUuid = change.uuid!;
    const organizationUuid = this.currentOrganizationUuid();
    this.isResolving = true;
    const request = apply
      ? this.api.postSingleExternalUserChangesInternalV2Apply({ organizationUuid, changeUuid })
      : this.api.postSingleExternalUserChangesInternalV2Dismiss({ organizationUuid, changeUuid });
    this.subscriptions.add(
      request.subscribe({
        next: () => {
          this.notificationService.show(
            apply ? $localize`Brugerens adgang blev fjernet` : $localize`Ændringen blev afvist`,
            PopupMessageType.default,
          );
          this.isResolving = false;
          this.refresh();
        },
        error: (error: unknown) => {
          this.isResolving = false;
          this.notificationService.showError(
            this.getErrorMessage(error, $localize`Brugerændringen kunne ikke behandles`),
          );
        },
      }),
    );
  }

  private resolveBatch(changeUuids: string[], apply: boolean): void {
    const organizationUuid = this.currentOrganizationUuid();
    this.isResolving = true;
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
            this.actionResults = changeUuids.map((changeUuid) => ({
              changeUuid,
              userName: this.selectedChangeName(changeUuid),
              success: false,
              message: $localize`Resultatet kunne ikke bekræftes`,
            }));
            return of(this.actionResults);
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
          this.api
            .getSingleExternalUserChangesInternalV2Detail({ organizationUuid, changeUuid })
            .pipe(
              map((response: unknown) => {
                if (!isExternalUserChange(response)) throw new Error('Invalid change detail response');
                const success = response.status === expectedStatus;
                return {
                  changeUuid,
                  userName: response.userName || this.selectedChangeName(changeUuid),
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
                  userName: this.selectedChangeName(changeUuid),
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

  private createListRequest(
    organizationUuid: string,
    query: ExternalChangeQuery,
  ): GetSingleExternalUserChangesInternalV2ListRequestParams {
    return {
      organizationUuid,
      status: query.view === 'pending' ? 'Pending' : undefined,
      skip: query.skip,
      take: query.take,
      search: query.search || undefined,
      sort: query.sort,
      descending: query.descending,
      resolvedOnly: query.view === 'resolved',
    };
  }

  private updateQuery(changes: Partial<ExternalChangeQuery>): void {
    this.clearSelection();
    this.actionResults = [];
    this.query$.next({ ...this.query$.value, ...changes });
  }

  private clearSelection(): void {
    this.selectedChangeUuids = new Set<string>();
  }

  private currentOrganizationUuid(): string {
    const organizationUuid = this.store.selectSignal(selectOrganizationUuid)();
    if (!organizationUuid) throw new Error('Organization is not selected');
    return organizationUuid;
  }

  private selectedChangeName(changeUuid: string): string {
    const selected = this.items.find((change) => change.uuid === changeUuid);
    return selected?.userName || selected?.email || changeUuid;
  }

  private setDetailsLoading(changeUuid: string, isLoading: boolean): void {
    const next = new Set(this.detailLoading);
    if (isLoading) next.add(changeUuid);
    else next.delete(changeUuid);
    this.detailLoading = next;
  }

  private setDetailError(changeUuid: string, message: string): void {
    this.detailErrors = new Map(this.detailErrors).set(changeUuid, message);
    this.setDetailsLoading(changeUuid, false);
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
      return $localize`Du har ikke tilladelse til at udføre denne handling.`;
    }
    return fallback;
  }
}
