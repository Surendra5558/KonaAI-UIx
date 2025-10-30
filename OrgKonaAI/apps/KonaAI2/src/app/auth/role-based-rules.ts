/**
 * KonaAI Role-Based Access Control (RBAC) Rules
 * 
 * This file defines comprehensive role-based access control rules for the KonaAI application.
 * It includes detailed information about roles, permissions, screen access, and implementation guidelines.
 * 
 * @author KonaAI Development Team
 * @version 1.0.0
 * @created 2024
 */

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

/**
 * Enum defining all available roles in the KonaAI system
 */
export enum UserRole {
  INSTANCE_ADMIN = 'Instance Admin',
  GUEST = 'Guest',
  AUDIT_COMPLIANCE = 'Audit & Compliance',
  DATA_MANAGER = 'Data Manager',
  INVESTIGATOR = 'Investigator',
  PROJECT_ADMIN = 'Project Admin',
  ADMIN_SETTINGS = 'Admin Settings',
  CLIENT_ADMIN = 'Client Admin',
  L1_REVIEWER = 'L1 Reviewer',
  L2_REVIEWER = 'L2 Reviewer',
  L1_USER = 'L1 User',
  L2_USER = 'L2 User'
}

/**
 * Permission levels for granular access control
 */
export enum PermissionLevel {
  NONE = 'none',           // No access
  VIEW = 'view',           // Read-only access
  EDIT = 'edit',           // Create and modify access
  MANAGE = 'manage',       // Full administrative access
  DELETE = 'delete'        // Delete access (highest level)
}

/**
 * Screen/Module identifiers for access control
 */
export enum ScreenModule {
  // Authentication & User Management
  LOGIN = 'login',
  AD_AUTH = 'ad-auth',
  
  // Project Management
  PROJECTS = 'projects',
  PROJECT_CREATION = 'ProjectCreation',
  PROJECT_DASHBOARD = 'projectsDashboard',
  PROJECT_WORKFLOW = 'ProjectWorkflow',
  OVERVIEW = 'overview',
  
  // Data Management
  DATA_IMPORT = 'data',
  DATA_STAGING = 'staging',
  DATA_STAGING_HOLISTIC = 'stagingholistic',
  DATA_VALIDATIONS = 'data-validations',
  DATA_QUALITY = 'data-quality',
  DATA_QUALITY_DETAIL = 'data-quality-detail',
  DATA_QUALITY_REPORT = 'data-quality-report',
  CONNECTIONS = 'connections',
  MAPPING = 'Mapping',
  MAPPING_DETAILS = 'mappingdetails',
  
  // Investigation & Alerts
  ALERTS = 'alert',
  ALERT_DASHBOARD = 'alert-dashboard',
  ALERT_DETAILS = 'alert/details',
  TRANSACTION_ALERT = 'alert/details',
  CREATE_ALERT = 'create-alert',
  OCR_VIEW = 'ocr-view',
  HOLISTIC_VIEW = 'holisticView',
  
  // Insights & Analytics
  INSIGHTS = 'insights',
  INSIGHTS_OVERVIEW = 'insights-overview',
  TEXT_ANALYSIS = 'text-analysis',
  TRANSACTION_METRICS = 'transaction-metrics',
  DUPLICATE_CHECK = 'duplicate-check',
  SCENARIO_MANAGER = 'scenario-manager',
  EDIT_SCENARIO = 'edit-scenario',
  INSIGHTS_ENTITY_TRANS = 'insights-entity-trans',
  
  // Archive & Reports
  ARCHIVE = 'archive',
  ARCHIVE_VIEW = 'archive/view',
  ARCHIVE_REPORT = 'archive/report',
  
  // Administration
  ADMIN_DASHBOARD = 'admin-dashboard',
  MEMBERS = 'members',
  ROLES = 'roles',
  VIEW_ROLE = 'view-role',
  ORGANISATION_SETUP = 'organisation-setup',
  BILLING = 'billing',
  ACCOUNTS = 'account',
  
  // Questionnaire Management
  QUESTIONNAIRE = 'questionnaire',
  QUESTIONNAIRE_LIST = 'questionnaire/list',
  QUESTIONNAIRE_EDITOR = 'create',
  QUESTIONNAIRE_PREVIEW = 'preview',
  
  // System
  VM_DETAILS = 'vm-details',
  HOME = 'home',
  HELP = 'help',
  NOTIFICATIONS = 'notifications'
}

/**
 * Permission categories for organized access control
 */
export enum PermissionCategory {
  PROJECT_MANAGEMENT = 'Project Management',
  DATA_MANAGEMENT = 'Data Management',
  INVESTIGATION_WORKFLOW = 'Investigation Workflow',
  INSIGHTS_REPORTING = 'Insights & Reporting',
  DOCUMENT_MANAGEMENT = 'Document Management',
  ROLE_MANAGEMENT = 'Role Management',
  USER_MANAGEMENT = 'User Management',
  SYSTEM_SETTINGS = 'System Settings',
  AUDIT_COMPLIANCE = 'Audit & Compliance',
  BILLING_MANAGEMENT = 'Billing Management'
}

// ============================================================================
// ROLE PERMISSION MATRIX
// ============================================================================

/**
 * Interface defining permission structure for each screen
 */
export interface ScreenPermission {
  screen: ScreenModule;
  category: PermissionCategory;
  permission: PermissionLevel;
  description: string;
  route: string;
  requiresAuth: boolean;
}

/**
 * Interface defining role capabilities
 */
export interface RoleCapabilities {
  role: UserRole;
  description: string;
  defaultRoute: string;
  permissions: ScreenPermission[];
  sidebarSections: string[];
  specialAccess: string[];
}

/**
 * Comprehensive role-based access control matrix
 */
export const ROLE_ACCESS_MATRIX: Record<UserRole, RoleCapabilities> = {
  [UserRole.INSTANCE_ADMIN]: {
    role: UserRole.INSTANCE_ADMIN,
    description: 'Highest level administrator with full system access and control over all modules and settings.',
    defaultRoute: '/admin-dashboard',
    sidebarSections: ['admin'],
    specialAccess: ['system-configuration', 'instance-settings', 'global-permissions'],
    permissions: [
      // Full access to all screens
      { screen: ScreenModule.ADMIN_DASHBOARD, category: PermissionCategory.SYSTEM_SETTINGS, permission: PermissionLevel.MANAGE, description: 'Full administrative dashboard access', route: '/admin-dashboard', requiresAuth: true },
      { screen: ScreenModule.PROJECTS, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Full project management access', route: '/projects', requiresAuth: true },
      { screen: ScreenModule.MEMBERS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Full user management access', route: '/members', requiresAuth: true },
      { screen: ScreenModule.ROLES, category: PermissionCategory.ROLE_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Full role management access', route: '/roles', requiresAuth: true },
      { screen: ScreenModule.BILLING, category: PermissionCategory.BILLING_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Full billing management access', route: '/billing', requiresAuth: true },
      { screen: ScreenModule.ACCOUNTS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Full account management access', route: '/account', requiresAuth: true }
    ]
  },

  [UserRole.ADMIN_SETTINGS]: {
    role: UserRole.ADMIN_SETTINGS,
    description: 'Administrator responsible for system settings, user management, and organizational configuration.',
    defaultRoute: '/admin-dashboard',
    sidebarSections: ['admin'],
    specialAccess: ['user-management', 'role-management', 'system-settings'],
    permissions: [
      { screen: ScreenModule.ADMIN_DASHBOARD, category: PermissionCategory.SYSTEM_SETTINGS, permission: PermissionLevel.MANAGE, description: 'Administrative dashboard access', route: '/admin-dashboard', requiresAuth: true },
      { screen: ScreenModule.MEMBERS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'User management access', route: '/members', requiresAuth: true },
      { screen: ScreenModule.ROLES, category: PermissionCategory.ROLE_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Role management access', route: '/roles', requiresAuth: true },
      { screen: ScreenModule.BILLING, category: PermissionCategory.BILLING_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Billing information access', route: '/billing', requiresAuth: true },
      { screen: ScreenModule.ACCOUNTS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Account management access', route: '/account', requiresAuth: true },
      { screen: ScreenModule.ORGANISATION_SETUP, category: PermissionCategory.SYSTEM_SETTINGS, permission: PermissionLevel.MANAGE, description: 'Organization setup access', route: '/organisation-setup', requiresAuth: true }
    ]
  },

  [UserRole.CLIENT_ADMIN]: {
    role: UserRole.CLIENT_ADMIN,
    description: 'Client-level administrator with access to client-specific projects, members, and settings.',
    defaultRoute: '/projectsDashboard',
    sidebarSections: ['Dashboard'],
    specialAccess: ['client-projects', 'client-members', 'client-settings'],
    permissions: [
      { screen: ScreenModule.PROJECT_DASHBOARD, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Project dashboard access', route: '/projectsDashboard', requiresAuth: true },
      { screen: ScreenModule.PROJECTS, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Project management access', route: '/projects', requiresAuth: true },
      { screen: ScreenModule.MEMBERS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Organization members access', route: '/members', requiresAuth: true },
      { screen: ScreenModule.OVERVIEW, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Project overview access', route: '/overview', requiresAuth: true },
      { screen: ScreenModule.PROJECT_WORKFLOW, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Project workflow access', route: '/ProjectWorkflow', requiresAuth: true }
    ]
  },

  [UserRole.PROJECT_ADMIN]: {
    role: UserRole.PROJECT_ADMIN,
    description: 'Project administrator with full control over assigned projects and project-related activities.',
    defaultRoute: '/projects',
    sidebarSections: ['audit'],
    specialAccess: ['project-creation', 'project-settings', 'project-members'],
    permissions: [
      { screen: ScreenModule.PROJECTS, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Full project management access', route: '/projects', requiresAuth: true },
      { screen: ScreenModule.PROJECT_CREATION, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Project creation access', route: '/ProjectCreation', requiresAuth: true },
      { screen: ScreenModule.MEMBERS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Organization members view access', route: '/members', requiresAuth: true },
      { screen: ScreenModule.OVERVIEW, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Project overview management', route: '/overview', requiresAuth: true },
      { screen: ScreenModule.PROJECT_WORKFLOW, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Project workflow management', route: '/ProjectWorkflow', requiresAuth: true }
    ]
  },

  [UserRole.DATA_MANAGER]: {
    role: UserRole.DATA_MANAGER,
    description: 'Responsible for data imports, integrations, mappings, and data quality management.',
    defaultRoute: '/projectsDashboard',
    sidebarSections: ['dataManager'],
    specialAccess: ['data-imports', 'data-mappings', 'data-connections', 'data-quality'],
    permissions: [
      { screen: ScreenModule.PROJECT_DASHBOARD, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Data management dashboard', route: '/projectsDashboard', requiresAuth: true },
      { screen: ScreenModule.DATA_IMPORT, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data import management', route: '/data', requiresAuth: true },
      { screen: ScreenModule.DATA_STAGING, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data staging management', route: '/staging', requiresAuth: true },
      { screen: ScreenModule.DATA_STAGING_HOLISTIC, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Holistic data staging', route: '/stagingholistic', requiresAuth: true },
      { screen: ScreenModule.CONNECTIONS, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data connections management', route: '/connections', requiresAuth: true },
      { screen: ScreenModule.MAPPING, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data mapping management', route: '/Mapping', requiresAuth: true },
      { screen: ScreenModule.MAPPING_DETAILS, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Detailed mapping configuration', route: '/mappingdetails', requiresAuth: true },
      { screen: ScreenModule.DATA_VALIDATIONS, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data validation management', route: '/data-validations', requiresAuth: true },
      { screen: ScreenModule.DATA_QUALITY, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data quality management', route: '/data-quality', requiresAuth: true },
      { screen: ScreenModule.DATA_QUALITY_DETAIL, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data quality detailed view', route: '/data-quality-detail', requiresAuth: true },
      { screen: ScreenModule.DATA_QUALITY_REPORT, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.MANAGE, description: 'Data quality reporting', route: '/data-quality-report', requiresAuth: true }
    ]
  },

  [UserRole.INVESTIGATOR]: {
    role: UserRole.INVESTIGATOR,
    description: 'Conducts investigations, reviews alerts, and manages investigation workflows.',
    defaultRoute: '/projectsDashboard',
    sidebarSections: ['investigator'],
    specialAccess: ['investigation-workflow', 'alert-management', 'case-assignment'],
    permissions: [
      { screen: ScreenModule.PROJECT_DASHBOARD, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Investigation dashboard', route: '/projectsDashboard', requiresAuth: true },
      { screen: ScreenModule.PROJECTS, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Project view access', route: '/projects', requiresAuth: true },
      { screen: ScreenModule.MEMBERS, category: PermissionCategory.USER_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Organization members view', route: '/members', requiresAuth: true },
      { screen: ScreenModule.ALERTS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.MANAGE, description: 'Alert management', route: '/alert', requiresAuth: true },
      { screen: ScreenModule.ALERT_DETAILS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.MANAGE, description: 'Alert details management', route: '/alert/details', requiresAuth: true },
      { screen: ScreenModule.TRANSACTION_ALERT, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.MANAGE, description: 'Transaction alert management', route: '/alert/details', requiresAuth: true },
      { screen: ScreenModule.OCR_VIEW, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'OCR document view', route: '/ocr-view', requiresAuth: true },
      { screen: ScreenModule.HOLISTIC_VIEW, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Holistic investigation view', route: '/holisticView', requiresAuth: true }
    ]
  },

  [UserRole.AUDIT_COMPLIANCE]: {
    role: UserRole.AUDIT_COMPLIANCE,
    description: 'Audit and compliance officer with access to audit trails, compliance reports, and oversight functions.',
    defaultRoute: '/projectsDashboard',
    sidebarSections: ['audit'],
    specialAccess: ['audit-trails', 'compliance-reports', 'oversight-functions'],
    permissions: [
      { screen: ScreenModule.PROJECT_DASHBOARD, category: PermissionCategory.AUDIT_COMPLIANCE, permission: PermissionLevel.VIEW, description: 'Audit dashboard', route: '/projectsDashboard', requiresAuth: true },
      { screen: ScreenModule.PROJECTS, category: PermissionCategory.AUDIT_COMPLIANCE, permission: PermissionLevel.VIEW, description: 'Project audit access', route: '/projects', requiresAuth: true },
      { screen: ScreenModule.MEMBERS, category: PermissionCategory.AUDIT_COMPLIANCE, permission: PermissionLevel.VIEW, description: 'Member audit access', route: '/members', requiresAuth: true },
      { screen: ScreenModule.ARCHIVE, category: PermissionCategory.AUDIT_COMPLIANCE, permission: PermissionLevel.VIEW, description: 'Archive audit access', route: '/archive', requiresAuth: true },
      { screen: ScreenModule.ARCHIVE_VIEW, category: PermissionCategory.AUDIT_COMPLIANCE, permission: PermissionLevel.VIEW, description: 'Archive view access', route: '/archive/view', requiresAuth: true },
      { screen: ScreenModule.ARCHIVE_REPORT, category: PermissionCategory.AUDIT_COMPLIANCE, permission: PermissionLevel.VIEW, description: 'Archive reporting', route: '/archive/report', requiresAuth: true }
    ]
  },

  [UserRole.L1_REVIEWER]: {
    role: UserRole.L1_REVIEWER,
    description: 'Level 1 reviewer responsible for initial case review and assessment.',
    defaultRoute: '/projectsDashboard',
    sidebarSections: ['investigator'],
    specialAccess: ['l1-review', 'case-assessment', 'initial-approval'],
    permissions: [
      { screen: ScreenModule.PROJECT_DASHBOARD, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'L1 review dashboard', route: '/projectsDashboard', requiresAuth: true },
      { screen: ScreenModule.ALERTS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Alert review access', route: '/alert', requiresAuth: true },
      { screen: ScreenModule.ALERT_DETAILS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.EDIT, description: 'Alert details review', route: '/alert/details', requiresAuth: true },
      { screen: ScreenModule.OCR_VIEW, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Document review access', route: '/ocr-view', requiresAuth: true }
    ]
  },

  [UserRole.L2_REVIEWER]: {
    role: UserRole.L2_REVIEWER,
    description: 'Level 2 reviewer responsible for advanced case review and final approval.',
    defaultRoute: '/projectsDashboard',
    sidebarSections: ['investigator'],
    specialAccess: ['l2-review', 'final-approval', 'escalation-management'],
    permissions: [
      { screen: ScreenModule.PROJECT_DASHBOARD, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'L2 review dashboard', route: '/projectsDashboard', requiresAuth: true },
      { screen: ScreenModule.ALERTS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.MANAGE, description: 'Advanced alert management', route: '/alert', requiresAuth: true },
      { screen: ScreenModule.ALERT_DETAILS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.MANAGE, description: 'Advanced alert details', route: '/alert/details', requiresAuth: true },
      { screen: ScreenModule.OCR_VIEW, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Document review access', route: '/ocr-view', requiresAuth: true },
      { screen: ScreenModule.HOLISTIC_VIEW, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Holistic case review', route: '/holisticView', requiresAuth: true }
    ]
  },

  [UserRole.GUEST]: {
    role: UserRole.GUEST,
    description: 'Limited access user with basic viewing capabilities and restricted functionality.',
    defaultRoute: '/home',
    sidebarSections: ['Dashboard'],
    specialAccess: ['basic-viewing', 'limited-functionality'],
    permissions: [
      { screen: ScreenModule.HOME, category: PermissionCategory.PROJECT_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Home page access', route: '/home', requiresAuth: true },
      { screen: ScreenModule.CONNECTIONS, category: PermissionCategory.DATA_MANAGEMENT, permission: PermissionLevel.VIEW, description: 'Connections view access', route: '/connections', requiresAuth: true }
    ]
  },

  [UserRole.L1_USER]: {
    role: UserRole.L1_USER,
    description: 'L1 User with investigator role - limited access to alert dashboard only.',
    defaultRoute: '/ProjectWorkflow/1?pfTab=alert',
    sidebarSections: ['investigator'],
    specialAccess: ['alert-dashboard-only', 'investigator-role-display'],
    permissions: [
      { screen: ScreenModule.ALERTS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Alert dashboard access only', route: '/alert', requiresAuth: true },
      { screen: ScreenModule.ALERT_DETAILS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Alert details view access', route: '/alert/details', requiresAuth: true }
    ]
  },

  [UserRole.L2_USER]: {
    role: UserRole.L2_USER,
    description: 'L2 User with investigation role - access to Alert Dashboard and My Alerts under Investigation section.',
    defaultRoute: '/alert-dashboard',
    sidebarSections: ['investigation'],
    specialAccess: ['alert-dashboard-access', 'my-alerts-access', 'investigation-role-display'],
    permissions: [
      { screen: ScreenModule.ALERT_DASHBOARD, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Alert Dashboard access', route: '/alert-dashboard', requiresAuth: true },
      { screen: ScreenModule.ALERTS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'My Alerts access', route: '/alert', requiresAuth: true },
      { screen: ScreenModule.ALERT_DETAILS, category: PermissionCategory.INVESTIGATION_WORKFLOW, permission: PermissionLevel.VIEW, description: 'Alert details view access', route: '/alert/details', requiresAuth: true }
    ]
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a user role has access to a specific screen
 * @param userRole - The user's role
 * @param screen - The screen to check access for
 * @returns boolean indicating if access is granted
 */
export function hasScreenAccess(userRole: UserRole, screen: ScreenModule): boolean {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  if (!roleCapabilities) return false;
  
  return roleCapabilities.permissions.some(permission => 
    permission.screen === screen && permission.permission !== PermissionLevel.NONE
  );
}

/**
 * Get the permission level for a user role on a specific screen
 * @param userRole - The user's role
 * @param screen - The screen to check
 * @returns PermissionLevel or null if no access
 */
export function getScreenPermission(userRole: UserRole, screen: ScreenModule): PermissionLevel | null {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  if (!roleCapabilities) return null;
  
  const permission = roleCapabilities.permissions.find(p => p.screen === screen);
  return permission ? permission.permission : null;
}

/**
 * Get all screens accessible by a user role
 * @param userRole - The user's role
 * @returns Array of accessible screens
 */
export function getAccessibleScreens(userRole: UserRole): ScreenModule[] {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  if (!roleCapabilities) return [];
  
  return roleCapabilities.permissions
    .filter(permission => permission.permission !== PermissionLevel.NONE)
    .map(permission => permission.screen);
}

/**
 * Get sidebar sections available for a user role
 * @param userRole - The user's role
 * @returns Array of sidebar section names
 */
export function getSidebarSections(userRole: UserRole): string[] {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  return roleCapabilities ? roleCapabilities.sidebarSections : [];
}

/**
 * Get the default route for a user role
 * @param userRole - The user's role
 * @returns Default route string
 */
export function getDefaultRoute(userRole: UserRole): string {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  return roleCapabilities ? roleCapabilities.defaultRoute : '/login';
}

/**
 * Check if a user role has special access to a feature
 * @param userRole - The user's role
 * @param specialAccess - The special access feature to check
 * @returns boolean indicating if special access is granted
 */
export function hasSpecialAccess(userRole: UserRole, specialAccess: string): boolean {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  if (!roleCapabilities) return false;
  
  return roleCapabilities.specialAccess.includes(specialAccess);
}

/**
 * Get all roles that have access to a specific screen
 * @param screen - The screen to check
 * @returns Array of roles with access
 */
export function getRolesWithScreenAccess(screen: ScreenModule): UserRole[] {
  return Object.values(UserRole).filter(role => hasScreenAccess(role, screen));
}

/**
 * Get detailed permission information for a role and screen combination
 * @param userRole - The user's role
 * @param screen - The screen to check
 * @returns ScreenPermission object or null
 */
export function getScreenPermissionDetails(userRole: UserRole, screen: ScreenModule): ScreenPermission | null {
  const roleCapabilities = ROLE_ACCESS_MATRIX[userRole];
  if (!roleCapabilities) return null;
  
  return roleCapabilities.permissions.find(permission => permission.screen === screen) || null;
}

// ============================================================================
// ROLE HIERARCHY AND INHERITANCE
// ============================================================================

/**
 * Role hierarchy levels (higher number = more privileges)
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.INSTANCE_ADMIN]: 10,
  [UserRole.ADMIN_SETTINGS]: 9,
  [UserRole.CLIENT_ADMIN]: 8,
  [UserRole.PROJECT_ADMIN]: 7,
  [UserRole.DATA_MANAGER]: 6,
  [UserRole.INVESTIGATOR]: 5,
  [UserRole.L2_REVIEWER]: 4,
  [UserRole.L1_REVIEWER]: 3,
  [UserRole.AUDIT_COMPLIANCE]: 2,
  [UserRole.L2_USER]: 1.8,
  [UserRole.L1_USER]: 1.5,
  [UserRole.GUEST]: 1
};

/**
 * Check if one role has higher privileges than another
 * @param role1 - First role to compare
 * @param role2 - Second role to compare
 * @returns boolean indicating if role1 has higher privileges
 */
export function hasHigherPrivileges(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

// ============================================================================
// IMPLEMENTATION GUIDELINES
// ============================================================================

/**
 * Implementation notes for developers:
 * 
 * 1. ROUTE GUARDS:
 *    - Use RoleGuard service to protect routes
 *    - Check permissions before component initialization
 *    - Redirect unauthorized users to appropriate pages
 * 
 * 2. COMPONENT ACCESS:
 *    - Use hasScreenAccess() function in component constructors
 *    - Hide UI elements based on permission levels
 *    - Show appropriate error messages for unauthorized access
 * 
 * 3. SIDEBAR NAVIGATION:
 *    - Use getSidebarSections() to show/hide navigation sections
 *    - Filter menu items based on user permissions
 *    - Update active states based on accessible routes
 * 
 * 4. API INTEGRATION:
 *    - Include role information in API requests
 *    - Validate permissions on the backend
 *    - Return appropriate error codes for unauthorized access
 * 
 * 5. DYNAMIC PERMISSIONS:
 *    - Update permissions in real-time when user role changes
 *    - Refresh UI components when permissions are modified
 *    - Maintain session state for permission changes
 * 
 * 6. AUDIT TRAIL:
 *    - Log all permission checks and access attempts
 *    - Track role changes and permission modifications
 *    - Generate compliance reports for audit purposes
 */

// ============================================================================
// EXPORT ALL INTERFACES AND TYPES
// ============================================================================

// All interfaces and types are already exported above
