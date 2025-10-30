import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
//import { AuthService } from "@org-kona-ai/shared";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // constructor(private auth: AuthService, private router: Router) {
   
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree {
    // return this.auth.isAuthenticated()
    //   ? true
    //   : this.router.parseUrl('/login');
    return true;
  }
  
}
