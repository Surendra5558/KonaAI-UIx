import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(public auth: AuthService) {
   
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('auth interceptor called');
    //const token = this.auth.currentTokens?.accessToken;
    let token = null;
    //console.log(token);
     const storedUserString = sessionStorage.getItem('currentUser');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      if (storedUser?.token) {
       token = storedUser.token;
      }
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
     console.log(token);
    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          return this.handleRefresh(authReq, next);
        }
        return throwError(() => err);
      })
    );
  }

  handleRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);
      
      return this.auth.refreshTokenRequest().pipe(
        switchMap(tokens => {
          this.isRefreshing = false;
          this.refreshSubject.next(tokens.accessToken);

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
          });
          return next.handle(retryReq);
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.auth.logout();
          return throwError(() => err);
        })
      );
    }

    return this.refreshSubject.pipe(
      filter(t => t != null),
      take(1),
      switchMap(accessToken => {
        const retryReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken!}` }
        });
        return next.handle(retryReq);
      })
    );
  }
}
