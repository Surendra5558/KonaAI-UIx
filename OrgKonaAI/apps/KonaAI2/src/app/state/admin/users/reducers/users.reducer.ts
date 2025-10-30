import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Users } from '../models/users.model';
import { UsersActions } from '../actions/users.actions';

// Feature key
export const usersFeatureKey = 'users';

// Define the state interface extending EntityState
export interface UsersState extends EntityState<Users> {
  loading: boolean;
  error: string | null;
}

// Adapter
export const adapter: EntityAdapter<Users> = createEntityAdapter<Users>();

// Initial state
export const initialState: UsersState = adapter.getInitialState({
  loading: false,
  error: null,
});

// Reducer
export const reducer = createReducer(
  initialState,

  // Load users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    adapter.setAll(users, { ...state, loading: false })
  ),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add single user
  on(UsersActions.addUser, (state, { user }) =>
    adapter.addOne(user, state)
  ),

  // Update user
  on(UsersActions.updateUser, (state, { update }) =>
    adapter.updateOne(update, state)
  ),


  // Delete one
  on(UsersActions.deleteUser, (state, { id }) =>
    adapter.removeOne(id, state)
  ),


  // Clear all
  on(UsersActions.clearUsers, (state) =>
    adapter.removeAll(state)
  )
);

// Feature
export const UsersFeature = createFeature({
  name: usersFeatureKey,
  reducer,
  extraSelectors: ({ selectUsersState }) => ({
    ...adapter.getSelectors(selectUsersState),
  }),
});

// Selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = UsersFeature;
