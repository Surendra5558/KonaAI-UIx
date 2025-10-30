// nav-item.model.ts
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiredRoles?: string[];  // if undefined, everyone can see
  children?: NavItem[];
}
