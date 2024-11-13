import { createFeature, createReducer } from '@ngrx/store';
import { GlobalAdminState, GlobalAdminUser } from './state';
import { createEntityAdapter } from '@ngrx/entity';

export const globalAdminsAdapter = createEntityAdapter<GlobalAdminUser>();

const GlobalAdminsInitialState: GlobalAdminState = globalAdminsAdapter.getInitialState({});

export const globalAdminFeature = createFeature({
  name: 'GlobalAdmin',
  reducer: createReducer(GlobalAdminsInitialState),
});
