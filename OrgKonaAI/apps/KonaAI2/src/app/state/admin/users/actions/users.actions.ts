import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Users } from '../models/users.model';

export const UsersActions = createActionGroup({
  source: 'Users/API',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: Users[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Add User': props<{ user: Users }>(),
    'Update User': props<{ update: Update<Users> }>(),
    'Delete User': props<{ id: string }>(),

    'Clear Users': emptyProps()
  }
});
