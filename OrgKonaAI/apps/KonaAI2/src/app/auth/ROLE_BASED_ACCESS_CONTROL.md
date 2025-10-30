# KonaAI Role-Based Access Control (RBAC) Documentation

## Table of Contents
1. [Overview](#overview)
2. [Role Definitions](#role-definitions)
3. [Permission System](#permission-system)
4. [Screen Access Matrix](#screen-access-matrix)
5. [Implementation Guide](#implementation-guide)
6. [Route Protection](#route-protection)
7. [Component Integration](#component-integration)
8. [API Integration](#api-integration)
9. [Testing Guidelines](#testing-guidelines)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

## Overview

The KonaAI application implements a comprehensive Role-Based Access Control (RBAC) system that manages user permissions and screen access based on predefined roles. This system ensures that users can only access features and data appropriate to their role within the organization.

### Key Features
- **Granular Permissions**: Fine-grained control over what users can view, edit, or manage
- **Role Hierarchy**: Clear hierarchy of roles with different privilege levels
- **Route Protection**: Automatic protection of routes based on user roles
- **Dynamic UI**: UI elements show/hide based on user permissions
- **Audit Trail**: Comprehensive logging of access attempts and permission changes

## Role Definitions

### 1. Instance Admin
- **Description**: Highest level administrator with full system access
- **Default Route**: `/admin-dashboard`
- **Key Responsibilities**:
  - Full system configuration and management
  - User and role management
  - Billing and subscription management
  - Global system settings
- **Special Access**: System configuration, instance settings, global permissions

### 2. Admin Settings
- **Description**: Administrator responsible for system settings and user management
- **Default Route**: `/admin-dashboard`
- **Key Responsibilities**:
  - User management and role assignment
  - System settings configuration
  - Organization setup and management
- **Special Access**: User management, role management, system settings

### 3. Client Admin
- **Description**: Client-level administrator with access to client-specific resources
- **Default Route**: `/projectsDashboard`
- **Key Responsibilities**:
  - Client project management
  - Client member management
  - Client-specific settings
- **Special Access**: Client projects, client members, client settings

### 4. Project Admin
- **Description**: Project administrator with full control over assigned projects
- **Default Route**: `/projects`
- **Key Responsibilities**:
  - Project creation and management
  - Project member assignment
  - Project workflow management
- **Special Access**: Project creation, project settings, project members

### 5. Data Manager
- **Description**: Responsible for data imports, integrations, and data quality
- **Default Route**: `/projectsDashboard`
- **Key Responsibilities**:
  - Data import and staging
  - Data mapping and validation
  - Data quality management
  - API integrations (SAP, Oracle)
- **Special Access**: Data imports, data mappings, data connections, data quality

### 6. Investigator
- **Description**: Conducts investigations and manages investigation workflows
- **Default Route**: `/projectsDashboard`
- **Key Responsibilities**:
  - Alert investigation and management
  - Case assignment and tracking
  - Document review and analysis
- **Special Access**: Investigation workflow, alert management, case assignment

### 7. L1 Reviewer
- **Description**: Level 1 reviewer for initial case assessment
- **Default Route**: `/projectsDashboard`
- **Key Responsibilities**:
  - Initial case review
  - Basic case assessment
  - Document review
- **Special Access**: L1 review, case assessment, initial approval

### 8. L2 Reviewer
- **Description**: Level 2 reviewer for advanced case review and final approval
- **Default Route**: `/projectsDashboard`
- **Key Responsibilities**:
  - Advanced case review
  - Final approval decisions
  - Escalation management
- **Special Access**: L2 review, final approval, escalation management

### 9. Audit & Compliance
- **Description**: Audit and compliance officer with oversight functions
- **Default Route**: `/projectsDashboard`
- **Key Responsibilities**:
  - Audit trail monitoring
  - Compliance reporting
  - Oversight functions
- **Special Access**: Audit trails, compliance reports, oversight functions

### 10. L1 User
- **Description**: L1 User with investigator role - limited access to alert dashboard only
- **Default Route**: `/alert`
- **Key Responsibilities**:
  - Alert dashboard access only
  - View alert details
  - Limited investigation capabilities
- **Special Access**: Alert dashboard only, investigator role display

### 11. Guest
- **Description**: Limited access user with basic viewing capabilities
- **Default Route**: `/home`
- **Key Responsibilities**:
  - Basic system navigation
  - Limited feature access
- **Special Access**: Basic viewing, limited functionality

## Permission System

### Permission Levels
The system uses five permission levels in hierarchical order:

1. **NONE** (0): No access to the feature
2. **VIEW** (1): Read-only access
3. **EDIT** (2): Create and modify access
4. **MANAGE** (3): Full administrative access
5. **DELETE** (4): Delete access (highest level)

### Permission Categories
Permissions are organized into logical categories:

- **Project Management**: Project creation, editing, and workflow management
- **Data Management**: Data imports, staging, mapping, and quality
- **Investigation Workflow**: Alert management, case assignment, and review
- **Insights & Reporting**: Analytics, reports, and data export
- **Document Management**: Document upload, view, and management
- **Role Management**: Role creation, editing, and assignment
- **User Management**: User creation, editing, and management
- **System Settings**: System configuration and settings
- **Audit & Compliance**: Audit trails and compliance reporting
- **Billing Management**: Billing and subscription management

## Screen Access Matrix

### Complete Screen Access by Role

| Screen | Instance Admin | Admin Settings | Client Admin | Project Admin | Data Manager | Investigator | L1 Reviewer | L2 Reviewer | Audit & Compliance | L1 User | Guest |
|--------|---------------|----------------|--------------|---------------|--------------|--------------|-------------|-------------|-------------------|---------|-------|
| Admin Dashboard | MANAGE | MANAGE | NONE | NONE | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| Projects | MANAGE | VIEW | MANAGE | MANAGE | VIEW | VIEW | NONE | NONE | VIEW | NONE | NONE |
| Project Creation | MANAGE | VIEW | VIEW | MANAGE | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| Data Import | MANAGE | VIEW | VIEW | VIEW | MANAGE | NONE | NONE | NONE | NONE | NONE | NONE |
| Data Staging | MANAGE | VIEW | VIEW | VIEW | MANAGE | NONE | NONE | NONE | NONE | NONE | NONE |
| Connections | MANAGE | VIEW | VIEW | VIEW | MANAGE | NONE | NONE | NONE | NONE | NONE | VIEW |
| Mapping | MANAGE | VIEW | VIEW | VIEW | MANAGE | NONE | NONE | NONE | NONE | NONE | NONE |
| Alerts | MANAGE | VIEW | VIEW | VIEW | NONE | MANAGE | VIEW | MANAGE | VIEW | VIEW | NONE |
| Members | MANAGE | MANAGE | MANAGE | VIEW | NONE | VIEW | NONE | NONE | VIEW | NONE | NONE |
| Roles | MANAGE | MANAGE | NONE | NONE | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| Billing | MANAGE | VIEW | NONE | NONE | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| Archive | MANAGE | VIEW | VIEW | VIEW | NONE | NONE | NONE | NONE | VIEW | NONE | NONE |

## Implementation Guide

### 1. File Structure
```
src/app/auth/
├── role-based-rules.ts          # Core RBAC definitions and rules
├── role.guard.ts               # Route guards for protection
├── auth.service.ts             # Authentication service
├── auth.guard.ts               # Basic authentication guard
└── ROLE_BASED_ACCESS_CONTROL.md # This documentation
```

### 2. Core Files

#### role-based-rules.ts
Contains all role definitions, permission matrices, and utility functions:
- `UserRole` enum: All available roles
- `PermissionLevel` enum: Permission levels
- `ScreenModule` enum: All screen identifiers
- `ROLE_ACCESS_MATRIX`: Complete permission matrix
- Utility functions for permission checking

#### role.guard.ts
Contains route guards for protecting routes:
- `RoleGuard`: Basic role-based route protection
- `RoleGuardWithPermission`: Permission level-based protection
- `MultipleRoleGuard`: Multiple role access
- `AdminOnlyGuard`: Admin-only access
- `DataManagerGuard`: Data management access
- `InvestigatorGuard`: Investigation access

### 3. Integration Steps

#### Step 1: Import Required Modules
```typescript
import { 
  UserRole, 
  ScreenModule, 
  PermissionLevel,
  hasScreenAccess,
  getScreenPermission,
  getDefaultRoute
} from './auth/role-based-rules';

import { 
  RoleGuard, 
  AdminOnlyGuard, 
  DataManagerGuard,
  InvestigatorGuard 
} from './auth/role.guard';
```

#### Step 2: Update Route Configuration
```typescript
export const routes: Routes = [
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AdminOnlyGuard] 
  },
  { 
    path: 'data/:name', 
    component: DataImportComponent, 
    canActivate: [DataManagerGuard] 
  },
  { 
    path: 'alert', 
    component: AlertComponent, 
    canActivate: [InvestigatorGuard] 
  },
  { 
    path: 'projects', 
    component: ProjectsComponent, 
    canActivate: [RoleGuard] 
  },
  { 
    path: 'members', 
    component: MembersComponent, 
    canActivate: [RoleGuardWithPermission(PermissionLevel.MANAGE)] 
  }
];
```

#### Step 3: Component Integration
```typescript
export class MyComponent implements OnInit {
  currentUser: any;
  userRole: UserRole;
  hasAccess: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.userRole = this.currentUser?.role as UserRole;
    
    // Check if user has access to this screen
    this.hasAccess = hasScreenAccess(this.userRole, ScreenModule.MY_SCREEN);
    
    if (!this.hasAccess) {
      // Redirect or show error
      this.router.navigate([getDefaultRoute(this.userRole)]);
    }
  }
}
```

## Route Protection

### 1. Basic Route Protection
```typescript
{ path: 'protected-route', component: MyComponent, canActivate: [RoleGuard] }
```

### 2. Permission Level Protection
```typescript
{ 
  path: 'admin-only', 
  component: AdminComponent, 
  canActivate: [RoleGuardWithPermission(PermissionLevel.MANAGE)] 
}
```

### 3. Multiple Role Protection
```typescript
{ 
  path: 'multi-role', 
  component: MultiRoleComponent, 
  canActivate: [MultipleRoleGuard([UserRole.ADMIN, UserRole.MANAGER])] 
}
```

### 4. Specialized Guards
```typescript
// Admin only
{ path: 'admin', component: AdminComponent, canActivate: [AdminOnlyGuard] }

// Data management
{ path: 'data', component: DataComponent, canActivate: [DataManagerGuard] }

// Investigation
{ path: 'investigation', component: InvestigationComponent, canActivate: [InvestigatorGuard] }
```

## Component Integration

### 1. Permission Checking in Components
```typescript
export class MyComponent implements OnInit {
  userRole: UserRole;
  canEdit: boolean = false;
  canDelete: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userRole = this.authService.currentUserValue?.role as UserRole;
    
    // Check specific permissions
    this.canEdit = getScreenPermission(this.userRole, ScreenModule.MY_SCREEN) === PermissionLevel.EDIT;
    this.canDelete = getScreenPermission(this.userRole, ScreenModule.MY_SCREEN) === PermissionLevel.DELETE;
  }
}
```

### 2. Conditional UI Rendering
```html
<!-- Show edit button only if user has edit permission -->
<button *ngIf="canEdit" (click)="editItem()">Edit</button>

<!-- Show delete button only if user has delete permission -->
<button *ngIf="canDelete" (click)="deleteItem()">Delete</button>

<!-- Show admin section only for admin roles -->
<div *ngIf="isAdminRole" class="admin-section">
  <!-- Admin content -->
</div>
```

### 3. Sidebar Navigation
```typescript
export class SidebarComponent implements OnInit {
  sidebarSections: string[] = [];

  ngOnInit() {
    const userRole = this.authService.currentUserValue?.role as UserRole;
    this.sidebarSections = getSidebarSections(userRole);
  }
}
```

## API Integration

### 1. Include Role in API Requests
```typescript
export class ApiService {
  private getHeaders(): HttpHeaders {
    const user = this.authService.currentUserValue;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-Role': user?.role || '',
      'X-User-ID': user?.id?.toString() || ''
    });
  }

  getData(): Observable<any> {
    return this.http.get('/api/data', { headers: this.getHeaders() });
  }
}
```

### 2. Backend Permission Validation
```typescript
// Backend should validate permissions
app.get('/api/data', (req, res) => {
  const userRole = req.headers['x-user-role'];
  const requiredPermission = 'data.view';
  
  if (!hasPermission(userRole, requiredPermission)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  // Process request
});
```

## Testing Guidelines

### 1. Unit Tests for Role Functions
```typescript
describe('Role-Based Access Control', () => {
  it('should grant access to admin for admin dashboard', () => {
    expect(hasScreenAccess(UserRole.INSTANCE_ADMIN, ScreenModule.ADMIN_DASHBOARD)).toBe(true);
  });

  it('should deny access to guest for admin dashboard', () => {
    expect(hasScreenAccess(UserRole.GUEST, ScreenModule.ADMIN_DASHBOARD)).toBe(false);
  });

  it('should return correct permission level', () => {
    expect(getScreenPermission(UserRole.DATA_MANAGER, ScreenModule.DATA_IMPORT)).toBe(PermissionLevel.MANAGE);
  });
});
```

### 2. Integration Tests for Guards
```typescript
describe('Role Guards', () => {
  it('should allow admin access to admin route', () => {
    // Mock user with admin role
    // Test guard behavior
  });

  it('should redirect non-admin users', () => {
    // Mock user with non-admin role
    // Test redirect behavior
  });
});
```

### 3. Component Tests
```typescript
describe('Component with RBAC', () => {
  it('should show edit button for users with edit permission', () => {
    // Mock user with edit permission
    // Test UI rendering
  });

  it('should hide admin section for non-admin users', () => {
    // Mock non-admin user
    // Test UI hiding
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Route Access Denied
**Problem**: User gets redirected even though they should have access.
**Solution**: 
- Check if the route is properly mapped in `getScreenModuleFromRoute()`
- Verify the user's role is correctly set in the authentication service
- Ensure the role exists in the `ROLE_ACCESS_MATRIX`

#### 2. UI Elements Not Showing/Hiding
**Problem**: Buttons or sections appear for users who shouldn't see them.
**Solution**:
- Verify permission checking logic in component
- Check if the correct `ScreenModule` is being used
- Ensure permission levels are correctly compared

#### 3. Guard Not Working
**Problem**: Route guards are not preventing unauthorized access.
**Solution**:
- Check if the guard is properly imported and configured in routes
- Verify the guard function is returning the correct boolean value
- Ensure the authentication service is working correctly

### Debug Tips

#### 1. Enable Debug Logging
```typescript
// Add to role.guard.ts for debugging
console.log(`Checking access for role: ${userRole}, screen: ${screenModule}`);
console.log(`Access granted: ${hasAccess}`);
```

#### 2. Check User Role
```typescript
// Add to component for debugging
console.log('Current user:', this.authService.currentUserValue);
console.log('User role:', this.userRole);
```

#### 3. Verify Permission Matrix
```typescript
// Check if role exists in matrix
console.log('Role capabilities:', ROLE_ACCESS_MATRIX[userRole]);
```

## Best Practices

### 1. Security
- Always validate permissions on both frontend and backend
- Use HTTPS for all API communications
- Implement proper session management
- Log all permission checks and access attempts

### 2. Performance
- Cache permission checks when possible
- Use lazy loading for role-specific components
- Minimize permission checks in frequently called functions

### 3. Maintainability
- Keep role definitions centralized
- Use constants for role names and permission levels
- Document any custom permission logic
- Regular review and update of permission matrix

### 4. User Experience
- Provide clear error messages for access denied scenarios
- Redirect users to appropriate default routes
- Show loading states during permission checks
- Implement graceful degradation for permission failures

### 5. Testing
- Test all role combinations
- Verify both positive and negative test cases
- Include edge cases in test coverage
- Test permission changes in real-time

## Conclusion

The KonaAI Role-Based Access Control system provides a robust, scalable, and maintainable solution for managing user permissions and screen access. By following the implementation guidelines and best practices outlined in this documentation, developers can ensure secure and efficient access control throughout the application.

For additional support or questions, please refer to the development team or create an issue in the project repository.
