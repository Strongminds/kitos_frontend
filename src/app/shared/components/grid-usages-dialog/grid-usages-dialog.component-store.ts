import { Inject, Injectable } from '@angular/core';
import { IdentityNamePair, mapIdentityNamePair } from '../../models/identity-name-pair.model';
import { ComponentStore } from '@ngrx/component-store';
import { mergeMap, Observable, of, withLatestFrom } from 'rxjs';
import { APIV2ItSystemUsageMigrationINTERNALService } from 'src/app/api/v2';
import { tapResponse } from '@ngrx/operators';
import { filterNullish } from '../../pipes/filter-nullish';

interface State {
  loading: boolean,
  unusedItSystemsInOrganization: IdentityNamePair[] | undefined,
}

@Injectable()
export class GridUsagesDialogComponentStore extends ComponentStore<State> {
  public readonly unusedItSystemsInOrganization$ = this.select((state) => state.unusedItSystemsInOrganization).pipe(filterNullish());

  constructor(@Inject(APIV2ItSystemUsageMigrationINTERNALService) private readonly itSystemUsageMigrationService: APIV2ItSystemUsageMigrationINTERNALService) {
    super({
      loading: false,
      unusedItSystemsInOrganization: undefined,
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
      loading: false,
      unusedItSystemsInOrganization,
    })
  );

  public getUnusedItSystemsInOrganization = (nameContent: string) => this.effect(
    (organizationUuid$: Observable<string>) =>
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
