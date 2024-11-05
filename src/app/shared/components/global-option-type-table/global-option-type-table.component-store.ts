import { Injectable } from "@angular/core";
import { AdminOptionType, AdminOptionTypeItem } from "../../models/options/admin-option-type.model";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { map, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";

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
