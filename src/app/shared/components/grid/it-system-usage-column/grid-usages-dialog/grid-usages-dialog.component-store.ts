import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import {
  APIItSystemUsageMigrationV2ResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageMigrationINTERNALService,
} from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import {
  adaptItSystemUsageMigrationPermissions,
  ItSystemUsageMigrationPermissions,
} from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration-permissions.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { selectSystemGridState } from 'src/app/store/it-system/selectors';
import { IdentityNamePair, mapIdentityNamePair } from '../../../../models/identity-name-pair.model';
import { filterNullish } from '../../../../pipes/filter-nullish';

interface State {
  loading: boolean;
  unusedItSystemsInOrganization: IdentityNamePair[] | undefined;
  migration: APIItSystemUsageMigrationV2ResponseDTO | undefined;
  migrationPermissions: ItSystemUsageMigrationPermissions | undefined;
}

@Injectable()
export class GridUsagesDialogComponentStore extends ComponentStore<State> {
  public readonly unusedItSystemsInOrganization$ = this.select((state) => state.unusedItSystemsInOrganization).pipe(
    filterNullish()
  );
  public readonly migration$ = this.select((state) => state.migration);
  public readonly loading$ = this.select((state) => state.loading);
  public readonly canExecuteMigration$ = this.allowExecuteMigration$();

  //28/11/24 The API endpoint expects a number from 1 to 25.
  private readonly numberOfItSystemsPerQuery = 25;
  private readonly executeMigrationCommandId = 'system-usage-migration_execute';

  constructor(
    @Inject(APIV2ItSystemUsageMigrationINTERNALService)
    private readonly itSystemUsageMigrationService: APIV2ItSystemUsageMigrationINTERNALService,
    @Inject(APIV2ItSystemUsageInternalINTERNALService)
    private readonly itSystemUsageInternalService: APIV2ItSystemUsageInternalINTERNALService,
    private notificationService: NotificationService,
    private store: Store
  ) {
    super({
      loading: false,
      unusedItSystemsInOrganization: undefined,
      migration: undefined,
      migrationPermissions: undefined,
    });
  }

  private allowExecuteMigration$() {
    return this.select(
      (state) =>
        state.migrationPermissions?.commands?.find((c) => c.id === this.executeMigrationCommandId)?.canExecute === true
    );
  }

  private updateLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  private updateUnusedItSystemsInOrganization = this.updater(
    (state, unusedItSystemsInOrganization: IdentityNamePair[]): State => ({
      ...state,
      unusedItSystemsInOrganization,
    })
  );

  private updateMigration = this.updater(
    (state, migration: APIItSystemUsageMigrationV2ResponseDTO): State => ({
      ...state,
      migration,
    })
  );

  private updateMigrationPermissions = this.updater(
    (state, migrationPermissions: ItSystemUsageMigrationPermissions): State => ({
      ...state,
      migrationPermissions,
    })
  );

  public getMigrationPermissions = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        this.updateLoading(true);
        return this.itSystemUsageMigrationService.getSingleItSystemUsageMigrationV2GetPermissions().pipe(
          tapResponse(
            (permissionsDto) => {
              this.updateMigrationPermissions(adaptItSystemUsageMigrationPermissions(permissionsDto));
            },
            (error) => {
              console.error(error);
            },
            () => this.updateLoading(false)
          )
        );
      })
    )
  );

  public getMigration = (targetItSystemUuid: string) => (sourceItSystemUuid: string) =>
    this.effect((usingOrganizationUuid$: Observable<string>) =>
      this.getUsageUuid(usingOrganizationUuid$, sourceItSystemUuid).pipe(
        mergeMap((usageUuid) =>
          this.itSystemUsageMigrationService.getSingleItSystemUsageMigrationV2Get({
            toSystemUuid: targetItSystemUuid,
            usageUuid,
          })
        ),
        tapResponse(
          (migration: APIItSystemUsageMigrationV2ResponseDTO) => {
            this.updateMigration(migration);
          },
          (error) => {
            console.error(error);
          },
          () => this.updateLoading(false)
        )
      )
    );

  public executeMigration = (
    targetItSystemUuid: string,
    sourceItSystemUuid: string,
    usingOrganizationUuid$: Observable<string>
  ) =>
    this.getUsageUuid(usingOrganizationUuid$, sourceItSystemUuid).pipe(
      mergeMap((usageUuid) =>
        this.itSystemUsageMigrationService.postSingleItSystemUsageMigrationV2ExecuteMigration(
          {
            toSystemUuid: targetItSystemUuid,
            usageUuid,
          },
          'response'
        )
      ),
      tapResponse(
        (_) => {
          this.notificationService.showDefault($localize`Systemanvendelsen blev flyttet`);
          this.store.select(selectSystemGridState).subscribe((state) => {
            const systemGridStateAsODataString = toODataString(state);
            this.store.dispatch(ITSystemActions.getITSystems(systemGridStateAsODataString));
          });
        },
        (error) => {
          this.notificationService.showError($localize`Systemanvendelsen kunne ikke flyttes`);
          console.error(error);
        },
        () => this.updateLoading(false)
      )
    );

  private getUsageUuid(usingOrganizationUuid$: Observable<string>, sourceItSystemUuid: string): Observable<string> {
    return usingOrganizationUuid$.pipe(
      mergeMap((usingOrganizationUuid) =>
        this.itSystemUsageInternalService
          .getManyItSystemUsageInternalV2GetItSystemUsages({
            organizationUuid: usingOrganizationUuid,
          })
          .pipe(
            map((usages) => {
              const usage = usages.find((u) => u.systemContext.uuid === sourceItSystemUuid);
              if (!usage) {
                throw new Error('Usage not found');
              }
              return usage.uuid;
            })
          )
      )
    );
  }

  public getUnusedItSystemsInOrganization = (nameContent: string) =>
    this.effect((organizationUuid$: Observable<string>) =>
      organizationUuid$.pipe(
        withLatestFrom(of(nameContent)),
        mergeMap(([organizationUuid, nameContent]) => {
          this.updateLoading(true);
          return this.itSystemUsageMigrationService
            .getManyItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganization({
              organizationUuid,
              nameContent,
              numberOfItSystems: this.numberOfItSystemsPerQuery,
            })
            .pipe(
              tapResponse(
                (dtos) =>
                  this.updateUnusedItSystemsInOrganization(
                    dtos.map(mapIdentityNamePair).filter((x) => x !== undefined)
                  ),
                (error) => console.error(error),
                () => this.updateLoading(false)
              )
            );
        })
      )
    );
}
