import { createFeature, createReducer, on } from '@ngrx/store';
import { GlobalAdminState, GlobalAdminUser } from './state';
import { createEntityAdapter } from '@ngrx/entity';
import { GlobalAdminActions } from './actions';

export const globalAdminsAdapter = createEntityAdapter<GlobalAdminUser>({
  selectId: (user) => user.uuid,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const GlobalAdminsInitialState: GlobalAdminState = globalAdminsAdapter.getInitialState({ loading: false });

export const globalAdminFeature = createFeature({
  name: 'GlobalAdmin',
  reducer: createReducer(
    GlobalAdminsInitialState,
    on(
      GlobalAdminActions.getGlobalAdmins,
      GlobalAdminActions.removeGlobalAdmin,
      GlobalAdminActions.addGlobalAdmin,
      (state): GlobalAdminState => ({ ...state, loading: true })
    ),
    on(
      GlobalAdminActions.getGlobalAdminsError,
      GlobalAdminActions.removeGlobalAdminError,
      GlobalAdminActions.addGlobalAdminError,
      GlobalAdminActions.getGlobalAdminsSuccess,
      GlobalAdminActions.removeGlobalAdminSuccess,
      GlobalAdminActions.addGlobalAdminSuccess,
      (state): GlobalAdminState => ({ ...state, loading: false })
    ),
    on(
      GlobalAdminActions.getGlobalAdminsSuccess,
      (state, { admins }): GlobalAdminState => globalAdminsAdapter.setAll(admins, state)
    ),

    on(
      GlobalAdminActions.removeGlobalAdminSuccess,
      (state, { userUuid }): GlobalAdminState => globalAdminsAdapter.removeOne(userUuid, state)
    ),

    on(
      GlobalAdminActions.addGlobalAdminSuccess,
      (state, { user }): GlobalAdminState => globalAdminsAdapter.addOne(user, state)
    )
  ),
});
