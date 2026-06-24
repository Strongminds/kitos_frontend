import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { first, mergeMap } from 'rxjs';
import { ItSystemUsageV2Service } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageHasDeletePermission } from 'src/app/store/it-system-usage/selectors';
import { selectItSystemUuid } from 'src/app/store/it-system/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  systemUsageUuid: string | undefined;
}

@Injectable()
export class ITSystemCatalogDetailsComponentStore extends ComponentStore<State> {
  public readonly usageModifyPermission$ = this.store
    .select(selectITSystemUsageHasDeletePermission)
    .pipe(filterNullish());
  public readonly systemUsageUuid$ = this.select((state) => state.systemUsageUuid);

  constructor(
    @Inject(ItSystemUsageV2Service) private apiItSystemUsageService: ItSystemUsageV2Service,
    private store: Store,
  ) {
    super({ systemUsageUuid: undefined });
  }

  private setSystemUsageUuid = this.updater(
    (state, systemUsageUuid: string | undefined): State => ({
      ...state,
      systemUsageUuid,
    }),
  );

  public getSystemUsageByItSystemAndOrganization = this.effect(() =>
    this.store.select(selectItSystemUuid).pipe(
      filterNullish(),
      first(),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([itSystemUuid, organizationUuid]) =>
        this.apiItSystemUsageService
          .getSingleItSystemUsageV2GetItSystemUsages({
            systemUuid: itSystemUuid,
            organizationUuid,
          })
          .pipe(
            tapResponse({
              next: (usages) => {
                const usage = usages[0];
                if (!usage?.uuid) return;
                this.setSystemUsageUuid(usage.uuid);
              },
              error: (e) => console.error(e),
            }),
          ),
      ),
    ),
  );

  public getUsageDeletePermissionsForItSystem = this.effect(() =>
    this.store.select(selectItSystemUuid).pipe(
      filterNullish(),
      first(),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([itSystemUuid, organizationUuid]) =>
        this.apiItSystemUsageService
          .getSingleItSystemUsageV2GetItSystemUsages({ systemUuid: itSystemUuid, organizationUuid })
          .pipe(
            tapResponse({
              next: (usages) => {
                const usage = usages[0];
                if (!usage) return;
                const usageUuid = usage.uuid;
                this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissions(usageUuid));
              },
              error: (e) => console.error(e),
            }),
          ),
      ),
    ),
  );
}
