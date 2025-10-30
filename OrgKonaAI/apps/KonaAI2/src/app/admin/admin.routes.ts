import { Route } from '@angular/router';

export const routes: Route[] = [
{
    path: 'users',
    loadChildren: () => import('./user-management/user-management.routes').then(m => m.routes),
  },
];
