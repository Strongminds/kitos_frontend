import { createSelector } from "@ngrx/store";
import { globalAdminFeature, globalAdminsAdapter } from "./reducers";

const { selectGlobalAdminState } = globalAdminFeature;

export const selectAllGlobalAdmins = createSelector(selectGlobalAdminState, globalAdminsAdapter.getSelectors().selectAll);
