import { createFeature, createReducer, on } from '@ngrx/store';
import { GlobalAdminState, GlobalAdminUser } from './state';
import { createEntityAdapter } from '@ngrx/entity';
import { GlobalAdminActions } from './actions';

export const globalAdminsAdapter = createEntityAdapter<GlobalAdminUser>({
  selectId: (user) => user.uuid,
});

const GlobalAdminsInitialState: GlobalAdminState = globalAdminsAdapter.getInitialState();

export const globalAdminFeature = createFeature({
  name: 'GlobalAdmin',
  reducer: createReducer(
    GlobalAdminsInitialState,
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
