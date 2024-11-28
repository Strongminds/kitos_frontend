import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable, of, withLatestFrom } from 'rxjs';
import {
  APIItSystemUsageMigrationV2ResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageMigrationINTERNALService,
} from 'src/app/api/v2';
import { IdentityNamePair, mapIdentityNamePair } from '../../models/identity-name-pair.model';
import { filterNullish } from '../../pipes/filter-nullish';

interface State {
  loading: boolean;
  unusedItSystemsInOrganization: IdentityNamePair[] | undefined;
  migration: APIItSystemUsageMigrationV2ResponseDTO | undefined;
}

@Injectable()
export class GridUsagesDialogComponentStore extends ComponentStore<State> {
  public readonly unusedItSystemsInOrganization$ = this.select((state) => state.unusedItSystemsInOrganization).pipe(
    filterNullish()
  );
  public readonly migration$ = this.select((state) => state.migration);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(
    @Inject(APIV2ItSystemUsageMigrationINTERNALService)
    private readonly itSystemUsageMigrationService: APIV2ItSystemUsageMigrationINTERNALService,
    @Inject(APIV2ItSystemUsageInternalINTERNALService)
    private readonly itSystemUsageInternalService: APIV2ItSystemUsageInternalINTERNALService
  ) {
    super({
      loading: false,
      unusedItSystemsInOrganization: undefined,
      migration: undefined,
    });
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

  public getMigration = (targetItSystemUuid: string) => (sourceItSystemUuid: string) =>
    this.effect((usingOrganizationUuid$: Observable<string>) =>
      usingOrganizationUuid$.pipe(
        withLatestFrom(of(targetItSystemUuid), of(sourceItSystemUuid)),
        mergeMap(([usingOrganizationUuid, targetItSystemUuid, sourceItSystemUuid]) => {
          this.updateLoading(true);
          return this.itSystemUsageInternalService
            .getManyItSystemUsageInternalV2GetItSystemUsages({
              organizationUuid: usingOrganizationUuid,
            })
            .pipe(
              mergeMap((usages) => {
                const usage = usages.find((usage) => usage.systemContext.uuid === sourceItSystemUuid);
                if (!usage) {
                  throw new Error('Usage not found');
                }
                return this.itSystemUsageMigrationService
                  .getSingleItSystemUsageMigrationV2Get({
                    toSystemUuid: targetItSystemUuid,
                    usageUuid: usage.uuid,
                  });
              }),
              tapResponse(
                (migration) => {
                  this.updateMigration(migration);
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
              numberOfItSystems: 25,
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
