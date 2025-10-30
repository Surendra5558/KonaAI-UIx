import { ActionReducerMap } from '@ngrx/store';
import { UsersFeature } from './admin/users/reducers/users.reducer';

export interface AppState {
  users: ReturnType<typeof UsersFeature.reducer>;
}

export const reducers: ActionReducerMap<AppState> = {
  
  users: UsersFeature.reducer
};
