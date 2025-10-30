import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsersActions } from '../actions/users.actions';
import { HttpClient } from '@angular/common/http';
import { Users } from '../models/users.model';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadUsersEffect$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(UsersActions.loadUsers),

      switchMap(() =>
        this.http.get<Users[]>('https://jsonplaceholder.typicode.com/users').pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    );
  });

}
