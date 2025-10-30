import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { UsersEffects } from './users.effects';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsersEffects', () => {
  const actions$: Observable<any> = of();
  let effects: UsersEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        provideMockStore({}) ,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    effects = TestBed.inject(UsersEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
