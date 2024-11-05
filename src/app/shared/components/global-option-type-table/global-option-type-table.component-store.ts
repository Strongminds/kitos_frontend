import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import { APIGlobalRegularOptionResponseDTO } from 'src/app/api/v2';
import { LocalAdminOptionType, LocalAdminOptionTypeItem } from '../../models/options/local-admin-option-type.model';
import { GlobalAdminOptionTypeService } from '../../services/global-admin-option-type.service';

interface State {
  isLoading: boolean;
  optionTypeItems: LocalAdminOptionTypeItem[];
  type: LocalAdminOptionType;
}

@Injectable()
export class GlobalOptionTypeTableComponentStore extends ComponentStore<State> {
  public readonly optionTypeItems$ = this.select((state) => state.optionTypeItems);
  public readonly optionType$ = this.select((state) => state.type);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(private readonly store: Store, private globalOptionTypeService: GlobalAdminOptionTypeService) {
    super();
  }

  public getRegularOptionTypeItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateIsLoading(true)),
      switchMap(() =>
        this.getRegularOptionItems$().pipe(
          map((items) => items.map(this.mapDtoToRegularOptionType)),
          tapResponse(
            (mappedItems) => {
              this.updateItems(mappedItems);
              this.updateIsLoading(false);
            },
            (error) => {
              console.error(error);
              this.updateIsLoading(false);
            }
          )
        )
      )
    )
  );

  private mapDtoToRegularOptionType(dto: APIGlobalRegularOptionResponseDTO): LocalAdminOptionTypeItem {
    const item: LocalAdminOptionTypeItem = {
      active: dto.isEnabled ?? false,
      name: dto.name,
      writeAccess: false,
      description: dto.description,
      uuid: dto.uuid,
      obligatory: dto.isObligatory ?? false,
    };
    return item;
  }

  private getRegularOptionItems$(): Observable<APIGlobalRegularOptionResponseDTO[]> {
    return this.optionType$.pipe(switchMap((type) => this.globalOptionTypeService.getGlobalOptions(type)));
  }

  private updateItems = this.updater(
    (state: State, optionTypeItems: LocalAdminOptionTypeItem[]): State => ({
      ...state,
      optionTypeItems: optionTypeItems,
    })
  );

  private updateIsLoading = this.updater(
    (state: State, loading: boolean): State => ({
      ...state,
      isLoading: loading,
    })
  );
}
