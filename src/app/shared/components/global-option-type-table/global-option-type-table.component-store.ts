import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, tap } from 'rxjs';
import { APIGlobalRoleOptionResponseDTO } from 'src/app/api/v2';
import { GlobalAdminOptionType, GlobalAdminOptionTypeItem } from '../../models/options/global-admin-option-type.model';
import { GlobalAdminOptionTypeService } from '../../services/global-admin-option-type.service';

interface State {
  isLoading: boolean;
  optionTypeItems: GlobalAdminOptionTypeItem[];
  type: GlobalAdminOptionType;
}

@Injectable()
export class GlobalOptionTypeTableComponentStore extends ComponentStore<State> {
  public readonly optionTypeItems$ = this.select((state) => state.optionTypeItems);
  public readonly optionType$ = this.select((state) => state.type);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(private readonly store: Store, private globalOptionTypeService: GlobalAdminOptionTypeService) {
    super();
  }

  public getOptionTypeItems = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateIsLoading(true)),
      switchMap(() =>
        this.getOptionItems$().pipe(
          map((items) => items.map(this.mapDtoToRegularOptionType)),
          tapResponse(
            (mappedItems) => {
              this.sortByPriority(mappedItems);
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

  private sortByPriority(items: GlobalAdminOptionTypeItem[]){
    items.sort((a, b) => a.priority - b.priority);
  }

  private mapDtoToRegularOptionType(dto: APIGlobalRoleOptionResponseDTO): GlobalAdminOptionTypeItem {
    const item: GlobalAdminOptionTypeItem = {
      enabled: dto.isEnabled ?? false,
      name: dto.name,
      writeAccess: dto.writeAccess,
      description: dto.description,
      uuid: dto.uuid,
      obligatory: dto.isObligatory ?? false,
      priority: dto.priority ?? 0,
    };
    return item;
  }

  private getOptionItems$(): Observable<APIGlobalRoleOptionResponseDTO[]> {
    return this.optionType$.pipe(switchMap((type) => this.globalOptionTypeService.getGlobalOptions(type)));
  }

  private updateItems = this.updater(
    (state: State, optionTypeItems: GlobalAdminOptionTypeItem[]): State => ({
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
