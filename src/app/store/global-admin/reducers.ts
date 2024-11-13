import { createFeature, createReducer } from "@ngrx/store";
import { GlobalAdminState } from "./state";

const GlobalAdminsInitialState: GlobalAdminState = {
  globalAdmins: []
};

export const globalAdminFeature = createFeature({
  name: 'GlobalAdmin',
  reducer: createReducer(
    GlobalAdminsInitialState,
  )
});
