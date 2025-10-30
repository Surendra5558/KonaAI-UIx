// role-navigation.base.ts
import { OnInit, OnDestroy, Directive } from '@angular/core';
//import { AuthService } from './auth.service';
import { NavItem } from './role-model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MenuItem } from '../menu.model';
import { MenuService } from '../menu.service';
import { SHARED_PROVIDERS } from '../shared/shared-imports';

@Directive({ standalone: true , providers: [...SHARED_PROVIDERS]})
export abstract class RoleNavigationBase implements OnInit, OnDestroy {
  allMenu: MenuItem[] = [];
  visibleMenu: MenuItem[] = [];

  private menuSub?: Subscription;
  private rolesSub?: Subscription;

  constructor(
    protected menuService: MenuService,
    protected auth: AuthService
  ) {}

  ngOnInit(): void {
    // load menu initially
    this.menuService.loadMenu().subscribe({
      next: menu => {
        this.allMenu = menu;
        this.applyFiltering();
      },
      error: err => {
        console.error('Menu load error', err);
      }
    });

    // subscribe to menu changes
    this.menuSub = this.menuService.menu$.subscribe(menu => {

      this.allMenu = menu;
      this.applyFiltering();
    });

    // subscribe to roles (if roles change dynamically)
   /* this.rolesSub = this.auth.roles$.subscribe(_ => {
      this.applyFiltering();
    });*/
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();
    this.rolesSub?.unsubscribe();
  }

  protected applyFiltering(): void {
    //const roles = this.auth.getRoles();
    const roles: string[] = []
    //this.visibleMenu = this.menuService.filterMenuByRoles(this.allMenu, roles);
  }

}
