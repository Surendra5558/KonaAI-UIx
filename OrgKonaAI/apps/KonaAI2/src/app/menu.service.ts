// menu.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './menu.model';
import { AuthService } from './auth/auth.service';
import { ApiService } from '@org-kona-ai/shared';
import { APITypes, EndPoints } from './models/common-models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSubject = new BehaviorSubject<MenuItem[]>([]);
  public menu$ = this.menuSubject.asObservable();


  constructor(
    protected auth: AuthService,
    protected apiService: ApiService
  ) {}

  /** Call this after login to fetch the menu from backend */
  loadMenu(): Observable<MenuItem[]> {
    return this.apiService.get(EndPoints.GetMenu, APITypes.odata);
  }

  /**
   * Optionally filter menu items client-side by roles.
   * Use this if backend gives full menu but you want to hide items.
   */
  filterMenuByRoles(menu: MenuItem[], roles: string[]): MenuItem[] {
    return menu
      .filter(item => {
        if (!item.requiredRoles || item.requiredRoles.length === 0) {
          return true;
        }
        return item.requiredRoles.some(r => roles.includes(r));
      })
      .map(item => {
        const copy: MenuItem = { ...item };
        if (copy.subMenu) {
          copy.subMenu = this.filterMenuByRoles(copy.subMenu, roles);
        }
        return copy;
      });
  }
}
