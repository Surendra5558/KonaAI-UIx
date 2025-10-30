import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticateService {
  private http = inject(HttpClient);
  private tokens$ = new BehaviorSubject<AuthTokens | null>(null);
  constructor(private router: Router) {
    
  }
  login(username: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>('/api/auth/login', { username, password }).pipe(
      tap(tokens => this.tokens$.next(tokens))
    );
  }

  refreshTokenRequest(): Observable<AuthTokens> {
    const tokens = this.tokens$.value;
    return this.http.post<AuthTokens>('/api/auth/refresh', {
      refreshToken: tokens?.refreshToken
    }).pipe(tap(tokens => this.tokens$.next(tokens)));
  }

  get currentTokens(): AuthTokens | null {
    return this.tokens$.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokens$.value?.accessToken;
  }
  logout(): void {
    // Remove user from local storage only in browser
      sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    
  }
}
