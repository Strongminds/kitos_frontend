
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, first } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { ExternalUserChangesInternalV2Service } from 'src/app/api/v2/api/externalUserChangesInternalV2.service';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { Actions, ofType } from '@ngrx/effects';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import { selectAccessError, selectIsConnected } from 'src/app/store/local-admin/fk-org/selectors';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../shared/components/card-header/card-header.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ParagraphComponent } from '../../../shared/components/paragraph/paragraph.component';
import { ExternalUserChangesComponent } from './external-user-changes/external-user-changes.component';
import { LocalAdminImportOrganizationComponent } from './local-admin-import-organization/local-admin-import-organization.component';
import { LocalAdminBaseExcelImportComponent } from './local-admin-import/local-admin-base-excel-import/local-admin-base-excel-import.component';

type UserImportTab = 'excel' | 'externalChanges';

@Component({
  selector: 'app-local-admin-import',
  templateUrl: './local-admin-import.component.html',
  styleUrl: './local-admin-import.component.scss',
  imports: [
    SegmentComponent,
    AsyncPipe,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    LoadingComponent,
    ParagraphComponent,
    LocalAdminImportOrganizationComponent,
    LocalAdminBaseExcelImportComponent,
    ExternalUserChangesComponent,
  ],
})
export class LocalAdminImportComponent extends BaseComponent implements OnInit {
  public readonly contractsType = LocalAdminImportEntityType.contracts;
  public readonly usersType = LocalAdminImportEntityType.users;
  public readonly ImportSelectOption = LocalAdminImportEntityType;
  public readonly baseHelpTextKey = 'local-config.import';

  @Input() public selected = LocalAdminImportEntityType.organization;
  public selectedUserTab: UserImportTab = 'excel';
  public userTabs: SegmentButtonOption<UserImportTab>[] = this.createUserTabs();
  public isCheckingFkOrgConnection = true;
  public isFkOrgConnected = false;
  public fkOrgConnectionError?: string;
  public readonly accessError$ = this.store.select(selectAccessError);

  public showingOptions: SegmentButtonOption<LocalAdminImportEntityType>[] = [
    { text: $localize`Organisation`, value: LocalAdminImportEntityType.organization, dataCy: 'import-organization-tab' },
    { text: $localize`Brugere`, value: LocalAdminImportEntityType.users, dataCy: 'import-users-tab' },
    { text: $localize`IT Kontrakter`, value: LocalAdminImportEntityType.contracts, dataCy: 'import-contracts-tab' },
  ];

  private pendingExternalChangeCount = 0;
  private hasCheckedFkOrgConnection = false;

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly externalUserChangesApi: ExternalUserChangesInternalV2Service,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(FkOrgActions.getSynchronizationStatusSuccess))
        .subscribe(() => {
          this.isCheckingFkOrgConnection = false;
          this.hasCheckedFkOrgConnection = true;
          this.fkOrgConnectionError = undefined;
          this.subscriptions.add(
            this.store
              .select(selectIsConnected)
              .pipe(first())
              .subscribe((isConnected) => {
                this.isFkOrgConnected = isConnected === true;
                if (this.isFkOrgConnected) this.loadPendingCount();
              }),
          );
        }),
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(FkOrgActions.getSynchronizationStatusError))
        .subscribe(() => {
          this.isCheckingFkOrgConnection = false;
          this.hasCheckedFkOrgConnection = true;
          this.fkOrgConnectionError =
            $localize`Der skete en fejl ifm. tjek for forbindelsen til FK Organisation. Genindlæs venligst siden for at prøve igen.`;
          this.notificationService.showError(this.fkOrgConnectionError);
        }),
    );
  }

  public onUserTabChange(tab: UserImportTab): void {
    this.selectedUserTab = tab;
    if (tab === 'externalChanges' && !this.hasCheckedFkOrgConnection) {
      this.checkFkOrgConnection();
    }
  }

  public retryFkOrgConnectionCheck(): void {
    this.isCheckingFkOrgConnection = true;
    this.isFkOrgConnected = false;
    this.fkOrgConnectionError = undefined;
    this.hasCheckedFkOrgConnection = false;
    this.checkFkOrgConnection();
  }

  private checkFkOrgConnection(): void {
    this.isCheckingFkOrgConnection = true;
    this.store.dispatch(FkOrgActions.getSynchronizationStatus());
  }

  private loadPendingCount(): void {
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(
          filter((organizationUuid): organizationUuid is string => !!organizationUuid),
          switchMap((organizationUuid) =>
            this.externalUserChangesApi
              .getSingleExternalUserChangesInternalV2PendingCount({ organizationUuid })
              .pipe(
                map((response) => {
                  if (typeof response?.pendingCount !== 'number') {
                    throw new Error('Invalid pending external user changes response');
                  }
                  return response.pendingCount as number;
                }),
                catchError(() => {
                  this.notificationService.showError($localize`Kunne ikke hente antallet af eksterne brugerændringer`);
                  return EMPTY;
                }),
              ),
          ),
        )
        .subscribe((count) => {
          this.pendingExternalChangeCount = count;
          this.userTabs = this.createUserTabs();
        }),
    );
  }

  private createUserTabs(): SegmentButtonOption<UserImportTab>[] {
    const externalChangesText =
      this.pendingExternalChangeCount > 0
        ? $localize`Eksterne sletninger (${this.pendingExternalChangeCount})`
        : $localize`Eksterne sletninger`;
    return [
      { text: $localize`Excel-import`, value: 'excel', dataCy: 'user-excel-import-tab' },
      { text: externalChangesText, value: 'externalChanges', dataCy: 'external-user-changes-tab' },
    ];
  }
}
