import { Route } from '@angular/router';
import { ProjectsList } from './projects-list/projects-list';

export const routes: Route[] = [
  {
    path: '',
    component: ProjectsList
  }
];
