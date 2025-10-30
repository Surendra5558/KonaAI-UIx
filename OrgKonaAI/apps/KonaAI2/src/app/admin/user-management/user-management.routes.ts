import { Route } from '@angular/router';
import { UserList } from './user-list/user-list';
import { UserCreate } from './user-create/user-create';

export const routes: Route[] = [

  {
    path: '',
    component:UserList
  },
  {
    path: 'create',
    component:UserCreate
  }
];
