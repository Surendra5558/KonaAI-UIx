/**
 * Role-Based Route Guard
 * 
 * This guard protects routes based on user roles and permissions defined in the role-based rules.
 * It ensures that users can only access screens they have permission to view.
 * 
 * @author KonaAI Development Team
 * @version 1.0.0
 */

import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { 
  UserRole, 
  ScreenModule, 
  hasScreenAccess, 
  getScreenPermission, 
  getDefaultRoute,
  PermissionLevel,
  ROLE_ACCESS_MATRIX
} from './role-based-rules';

/**
 * Role Guard Function
 * 
 * This function is used as a route guard to protect routes based on user roles.
 * It checks if the current user has the necessary permissions to access the requested route.
 * 
 * @param route - The activated route snapshot
 * @param state - The router state snapshot
 * @returns boolean indicating if access is granted
 */
export const RoleGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Get current user
  const currentUser = authService.currentUserValue;
  if (!currentUser || !currentUser.role) {
    router.navigate(['/login']);
    return false;
  }

  // Get user role
  const userRole = currentUser.role as UserRole;
  
  // Get the screen module from the route
  const screenModule = getScreenModuleFromRoute(state.url);
  
  if (!screenModule) {
    // If we can't determine the screen module, allow access (fallback)
    console.warn(`Could not determine screen module for route: ${state.url}`);
    return true;
  }

  // Check if user has access to this screen
  const hasAccess = hasScreenAccess(userRole, screenModule);
  
  if (!hasAccess) {
    // Redirect to user's default route if they don't have access
    const defaultRoute = getDefaultRoute(userRole);
    console.warn(`Access denied for role ${userRole} to screen ${screenModule}. Redirecting to ${defaultRoute}`);
    router.navigate([defaultRoute]);
    return false;
  }

  // Check permission level for additional validation
  const permissionLevel = getScreenPermission(userRole, screenModule);
  if (permissionLevel === PermissionLevel.NONE) {
    const defaultRoute = getDefaultRoute(userRole);
    console.warn(`No permission for role ${userRole} to screen ${screenModule}. Redirecting to ${defaultRoute}`);
    router.navigate([defaultRoute]);
    return false;
  }

  return true;
};

/**
 * Enhanced Role Guard with Permission Level Check
 * 
 * This guard allows for more granular permission checking by specifying
 * the minimum required permission level.
 * 
 * @param requiredPermission - The minimum permission level required
 * @returns Guard function
 */
export const RoleGuardWithPermission = (requiredPermission: PermissionLevel) => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    // Get current user
    const currentUser = authService.currentUserValue;
    if (!currentUser || !currentUser.role) {
      router.navigate(['/login']);
      return false;
    }

    // Get user role
    const userRole = currentUser.role as UserRole;
    
    // Get the screen module from the route
    const screenModule = getScreenModuleFromRoute(state.url);
    
    if (!screenModule) {
      console.warn(`Could not determine screen module for route: ${state.url}`);
      return true;
    }

    // Check permission level
    const userPermission = getScreenPermission(userRole, screenModule);
    
    if (!userPermission || !hasMinimumPermission(userPermission, requiredPermission)) {
      const defaultRoute = getDefaultRoute(userRole);
      console.warn(`Insufficient permission for role ${userRole} to screen ${screenModule}. Required: ${requiredPermission}, User has: ${userPermission}`);
      router.navigate([defaultRoute]);
      return false;
    }

    return true;
  };
};

/**
 * Multiple Role Guard
 * 
 * This guard allows access if the user has any of the specified roles.
 * 
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Guard function
 */
export const MultipleRoleGuard = (allowedRoles: UserRole[]) => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    // Get current user
    const currentUser = authService.currentUserValue;
    if (!currentUser || !currentUser.role) {
      router.navigate(['/login']);
      return false;
    }

    // Get user role
    const userRole = currentUser.role as UserRole;
    
    // Check if user role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      const defaultRoute = getDefaultRoute(userRole);
      console.warn(`Access denied for role ${userRole}. Allowed roles: ${allowedRoles.join(', ')}`);
      router.navigate([defaultRoute]);
      return false;
    }

    return true;
  };
};

/**
 * Admin Only Guard
 * 
 * This guard restricts access to admin roles only.
 * 
 * @returns Guard function
 */
export const AdminOnlyGuard = () => {
  return MultipleRoleGuard([
    UserRole.INSTANCE_ADMIN,
    UserRole.ADMIN_SETTINGS,
    UserRole.CLIENT_ADMIN
  ]);
};

/**
 * Data Manager Guard
 * 
 * This guard restricts access to data management roles.
 * 
 * @returns Guard function
 */
export const DataManagerGuard = () => {
  return MultipleRoleGuard([
    UserRole.DATA_MANAGER,
    UserRole.INSTANCE_ADMIN,
    UserRole.ADMIN_SETTINGS
  ]);
};

/**
 * Investigator Guard
 * 
 * This guard restricts access to investigation roles.
 * 
 * @returns Guard function
 */
export const InvestigatorGuard = () => {
  return MultipleRoleGuard([
    UserRole.INVESTIGATOR,
    UserRole.L1_REVIEWER,
    UserRole.L2_REVIEWER,
    UserRole.L1_USER,
    UserRole.INSTANCE_ADMIN,
    UserRole.ADMIN_SETTINGS
  ]);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract screen module from route URL
 * 
 * @param url - The route URL
 * @returns ScreenModule or null if not found
 */
function getScreenModuleFromRoute(url: string): ScreenModule | null {
  // Remove query parameters and fragments
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Remove leading slash
  const path = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
  
  // Handle parameterized routes
  const pathSegments = path.split('/');
  const basePath = pathSegments[0];
  
  // Map route paths to screen modules
  const routeToScreenMap: Record<string, ScreenModule> = {
    'login': ScreenModule.LOGIN,
    'ad-auth': ScreenModule.AD_AUTH,
    'ProjectCreation': ScreenModule.PROJECT_CREATION,
    'alert': ScreenModule.ALERTS,
    'vm-details': ScreenModule.VM_DETAILS,
    'questionnaire': ScreenModule.QUESTIONNAIRE,
    'questionnaire/list': ScreenModule.QUESTIONNAIRE_LIST,
    'create': ScreenModule.QUESTIONNAIRE_EDITOR,
    'preview': ScreenModule.QUESTIONNAIRE_PREVIEW,
    'projectsDashboard': ScreenModule.PROJECT_DASHBOARD,
    'data': ScreenModule.DATA_IMPORT,
    'staging': ScreenModule.DATA_STAGING,
    'stagingholistic': ScreenModule.DATA_STAGING_HOLISTIC,
    'connections': ScreenModule.CONNECTIONS,
    'Mapping': ScreenModule.MAPPING,
    'mappingdetails': ScreenModule.MAPPING_DETAILS,
    'holisticView': ScreenModule.HOLISTIC_VIEW,
    'archive': ScreenModule.ARCHIVE,
    'archive/view': ScreenModule.ARCHIVE_VIEW,
    'archive/report': ScreenModule.ARCHIVE_REPORT,
    'overview': ScreenModule.OVERVIEW,
    'data-validations': ScreenModule.DATA_VALIDATIONS,
    'data-quality': ScreenModule.DATA_QUALITY,
    'data-quality-detail': ScreenModule.DATA_QUALITY_DETAIL,
    'data-quality-report': ScreenModule.DATA_QUALITY_REPORT,
    'billing': ScreenModule.BILLING,
    'account': ScreenModule.ACCOUNTS,
    'members': ScreenModule.MEMBERS,
    'ProjectWorkflow': ScreenModule.PROJECT_WORKFLOW,
    'alert/details': ScreenModule.ALERT_DETAILS,
    'ocr-view': ScreenModule.OCR_VIEW,
    'projects': ScreenModule.PROJECTS,
    'insights': ScreenModule.INSIGHTS,
    'edit-scenario': ScreenModule.EDIT_SCENARIO,
    'duplicate-check': ScreenModule.DUPLICATE_CHECK,
    'text-analysis': ScreenModule.TEXT_ANALYSIS,
    'transaction-metrics': ScreenModule.TRANSACTION_METRICS,
    'admin-dashboard': ScreenModule.ADMIN_DASHBOARD,
    'roles': ScreenModule.ROLES,
    'view-role': ScreenModule.VIEW_ROLE,
    'organisation-setup': ScreenModule.ORGANISATION_SETUP,
    'home': ScreenModule.HOME
  };
  
  return routeToScreenMap[basePath] || null;
}

/**
 * Check if user permission meets minimum required permission
 * 
 * @param userPermission - User's current permission level
 * @param requiredPermission - Required permission level
 * @returns boolean indicating if user has sufficient permission
 */
function hasMinimumPermission(userPermission: PermissionLevel, requiredPermission: PermissionLevel): boolean {
  const permissionHierarchy = {
    [PermissionLevel.NONE]: 0,
    [PermissionLevel.VIEW]: 1,
    [PermissionLevel.EDIT]: 2,
    [PermissionLevel.MANAGE]: 3,
    [PermissionLevel.DELETE]: 4
  };
  
  return permissionHierarchy[userPermission] >= permissionHierarchy[requiredPermission];
}

/**
 * Get user's accessible routes based on their role
 * 
 * @param userRole - The user's role
 * @returns Array of accessible route paths
 */
export function getAccessibleRoutes(userRole: UserRole): string[] {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  if (!roleCapabilities) return [];
  
  return roleCapabilities.permissions
    .filter(permission => permission.permission !== PermissionLevel.NONE)
    .map(permission => permission.route);
}

/**
 * Check if a route is accessible by a user role
 * 
 * @param userRole - The user's role
 * @param route - The route to check
 * @returns boolean indicating if route is accessible
 */
export function isRouteAccessible(userRole: UserRole, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(userRole);
  return accessibleRoutes.some(accessibleRoute => route.startsWith(accessibleRoute));
}

// ============================================================================
// GUARD CONFIGURATION FOR ROUTES
// ============================================================================

/**
 * Example usage in app.routes.ts:
 * 
 * export const routes: Routes = [
 *   { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminOnlyGuard] },
 *   { path: 'data/:name', component: DataImportComponent, canActivate: [DataManagerGuard] },
 *   { path: 'alert', component: AlertComponent, canActivate: [InvestigatorGuard] },
 *   { path: 'projects', component: ProjectsComponent, canActivate: [RoleGuard] },
 *   { path: 'members', component: MembersComponent, canActivate: [RoleGuardWithPermission(PermissionLevel.MANAGE)] },
 *   { path: 'billing', component: BillingComponent, canActivate: [MultipleRoleGuard([UserRole.INSTANCE_ADMIN, UserRole.ADMIN_SETTINGS])] }
 * ];
 */
