// menu-item.model.ts
export interface MenuItem {
  id: number;
  name?: string;
  label: string;
  path?: string;
  icon?: string;
  requiredRoles?: string[];
  subMenu?: MenuItem[];
}

export interface Navigation {
    userId: string;
    userName: string;
    role: string;
    navTtitle?: string;
    menus: MenuItem[];
    fullName?: string;
}
