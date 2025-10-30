import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '@org-kona-ai/shared';
import { APITypes, EndPoints } from '../models/common-models';


export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginCredential {
  id: number;
  userName: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface User {
  id: number;
  userName: string;
  role: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}
export interface LoginUser {
  userName: string;
  token: string;
  refreshToken: string; 
  role: string;
  roleId: number;


}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
 // private tokens$ = new BehaviorSubject<AuthTokens | null>(null);
  tokens = new BehaviorSubject<AuthTokens | null>(null);
  tokens$ = this.tokens.asObservable();
  private currentUserSubject: BehaviorSubject<LoginUser | null>;
  public currentUser: Observable<LoginUser | null>;
  public isShowDashboard  = new BehaviorSubject<string>('');
    isShowDashboardValue$ = this.isShowDashboard.asObservable();
  private sharedValueSource = new BehaviorSubject<string>(''); // default value
  sharedValue$ = this.sharedValueSource.asObservable();
  private isBrowser: boolean;
  backDataTab = new BehaviorSubject<boolean>(false); // default value
  backDataTab$ = this.backDataTab.asObservable();
  private isCollapsedSidebar = new BehaviorSubject<boolean>(false);
  sidebarValue$ = this.isCollapsedSidebar.asObservable();
  private isShowOrganization = new BehaviorSubject<string>('');
  isShowOrganization$ = this.isShowOrganization.asObservable();

  constructor(
    //private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    let storedUser = null;
    if (this.isBrowser) {
      const storedUserString = sessionStorage.getItem('currentUser');
      storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    }

    this.currentUserSubject = new BehaviorSubject<LoginUser | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  setShowDashboards(value: string){
    this.isShowDashboard.next(value);
  }

  setShowOrganisationValue(value: string) {
    this.isShowOrganization.next(value);
  }
  setSharedValue(value: string) {
    this.sharedValueSource.next(value);
  }
  setSideBarValue(value: boolean) {
    this.isCollapsedSidebar.next(value);
  }
  public get currentUserValue(): LoginUser | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    // return this.http.get<LoginCredential[]>('assets/repository/login_details_folder/login_credentials.json')
    //   .pipe(
    //     map(credentials => {
    //       const userCredential = credentials.find(cred =>
    //         cred.userName === email && cred.password === password
    //       );

    //       if (userCredential) {
    //         const user: User = {
    //           id: userCredential.id,
    //           userName: userCredential.userName,
    //           role: userCredential.role,
    //           firstName: userCredential.firstName,
    //           lastName: userCredential.lastName,
    //           mobileNumber: userCredential.mobileNumber
    //         };

    //         if (this.isBrowser) {
    //           sessionStorage.setItem('currentUser', JSON.stringify(user));
    //         }
    //         this.currentUserSubject.next(user);

    //         return user;
    //       } else {
    //         throw new Error('Invalid credentials');
    //       }
    //     })
    //   );
    const payload = {
      userName: email,
      password: password,
      GrantType :'password'
    }
    //const url = 'https://localhost:44355/v1/Login'
    //let userCrendential: LoginUser
    return this.apiService.post(EndPoints.loginUrl, payload, APITypes.odata).pipe(
    //return this.http.post(url, payload).pipe(
      map((response: any) => {
        if (response?.token) {
          let userCrentials: LoginUser = {
            userName: response?.name,
            token: response?.token,
            refreshToken: response?.refreshToken,
            role: response?.roleName,
            roleId: response?.roleId
          }
           this.tokens.next({
              accessToken: userCrentials.token,
              refreshToken: userCrentials.refreshToken
            })
            if (this.isBrowser) {
              sessionStorage.setItem('currentUser', JSON.stringify(userCrentials));
            }
            this.currentUserSubject.next(userCrentials);
            return userCrentials;
        } else {
          throw new Error('Invalid Credentials');
        }
      }


      ))
  }

  logout(): void {
    if (this.isBrowser) {                          // Remove user from local storage only in browser
      sessionStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.tokens.next(null);
    this.router.navigate(['/login']);
    
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }
  refreshTokenRequest(): Observable<AuthTokens> {
      const tokens = this.tokens.value;
      return this.http.post<AuthTokens>('/api/auth/refresh', {
        refreshToken: tokens?.refreshToken
      }).pipe(tap(tokens => this.tokens.next(tokens)));
    }
    isAuthenticated(): boolean {
    return !!this.tokens.value?.accessToken;
  }
}