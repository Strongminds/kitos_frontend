import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { LocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';
import { LocalAdminUserActions } from './actions';
import { LocalAdminUsersState } from './state';

export const localAdminUsersAdapter = createEntityAdapter<LocalAdminUser>({
  selectId: (user) => `${user.user.uuid}-${user.organization.uuid}`, //Distinguish between someone who is local admin in different organizations
  sortComparer: (a, b) => a.user.name.localeCompare(b.user.name),
});

const LocalAdminUsersInitialState = localAdminUsersAdapter.getInitialState({ loading: false });

export const localAdminUsersFeature = createFeature({
  name: 'LocalAdminUsers',
  reducer: createReducer(
    LocalAdminUsersInitialState,

    on(
      LocalAdminUserActions.getLocalAdminsSuccess,
      (state, { admins }): LocalAdminUsersState => localAdminUsersAdapter.setAll(admins, state)
    )
  ),
});
