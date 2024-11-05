import { Injectable } from "@angular/core";
import { AdminOptionType, AdminOptionTypeItem } from "../../models/options/admin-option-type.model";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { map, Observable, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { GlobalAdminOptionTypeService } from "../../services/global-admin-option-type.service";
import { APIGlobalRegularOptionResponseDTO } from "src/app/api/v2";

interface State {
  isLoading: boolean;
  optionTypeItems: AdminOptionTypeItem[];
  type: AdminOptionType;
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

  private mapDtoToRegularOptionType(dto: APIGlobalRegularOptionResponseDTO): AdminOptionTypeItem {
    const item: AdminOptionTypeItem = {
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
    return this.optionType$.pipe(
            switchMap((type) => this.globalOptionTypeService.getGlobalRegularOptions(type))
    );
  }

  private updateItems = this.updater(
    (state: State, optionTypeItems: AdminOptionTypeItem[]): State => ({
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
