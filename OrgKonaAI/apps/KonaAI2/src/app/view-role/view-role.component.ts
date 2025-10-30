import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Permission {
  name: string;
  view: boolean;
  edit: boolean;
  manage: boolean;
}

interface PermissionCategory {
  name: string;
  active: boolean;
  permissions: Permission[];
}

@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent implements OnInit {
  roleName: string = '';
  roleDescription: string = '';
  isEditMode: boolean = false;
  isAddMode: boolean = false;

  editRoleName: string = '';
  editRoleDescription: string = '';

  private defaultPermissionCategories: PermissionCategory[] = [
    {
      name: 'Project Management',
      active: true,
      permissions: [
        { name: 'View project details', view: false, edit: false, manage: false },
        { name: 'Create projects', view: false, edit: false, manage: false },
        { name: 'Edit project details', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'Investigation Workflow',
      active: false,
      permissions: [
        { name: 'View investigations', view: false, edit: false, manage: false },
        { name: 'Assign investigations', view: false, edit: false, manage: false },
        { name: 'Close investigations', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'Data Management',
      active: false,
      permissions: [
        { name: 'Upload data sources', view: false, edit: false, manage: false },
        { name: 'Data mappings', view: false, edit: false, manage: false },
        { name: 'Manage API integrations (SAP, Oracle)', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'Insights & Reporting',
      active: false,
      permissions: [
        { name: 'View reports', view: false, edit: false, manage: false },
        { name: 'Create reports', view: false, edit: false, manage: false },
        { name: 'Export data', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'Document Management',
      active: false,
      permissions: [
        { name: 'View documents', view: false, edit: false, manage: false },
        { name: 'Upload documents', view: false, edit: false, manage: false },
        { name: 'Delete documents', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'Role Management',
      active: false,
      permissions: [
        { name: 'View roles', view: false, edit: false, manage: false },
        { name: 'Create roles', view: false, edit: false, manage: false },
        { name: 'Delete roles', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'User Management',
      active: false,
      permissions: [
        { name: 'View users', view: false, edit: false, manage: false },
        { name: 'Create users', view: false, edit: false, manage: false },
        { name: 'Delete users', view: false, edit: false, manage: false }
      ]
    },
    {
      name: 'System Settings',
      active: false,
      permissions: [
        { name: 'View settings', view: false, edit: false, manage: false },
        { name: 'Modify settings', view: false, edit: false, manage: false },
        { name: 'System configuration', view: false, edit: false, manage: false }
      ]
    }
  ];

  permissionCategories: PermissionCategory[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initializePermissionCategories();

    this.route.params.subscribe(params => {
      if (params['id'] === 'add' || this.route.snapshot.url[0]?.path === 'add-role') {
        this.initializeAddMode();
      } else if (params['id']) {
        this.loadRoleData(params['id']);
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['edit'] === 'true' && !this.isAddMode) {
        this.onEditRole();
      }
    });
  }

  private initializePermissionCategories(): void {
    this.permissionCategories = JSON.parse(JSON.stringify(this.defaultPermissionCategories));
  }

  private initializeAddMode(): void {
    this.isAddMode = true;
    this.isEditMode = true;
    this.roleName = '';
    this.roleDescription = '';
    this.editRoleName = '';
    this.editRoleDescription = '';
  }

  private loadRoleData(roleId: string): void {
    this.isAddMode = false;

    switch (roleId) {
      case 'data-manager':
        this.roleName = 'Data Manager';
        this.roleDescription = 'Manages data imports, integrations, and mappings.';
        this.loadDataManagerPermissions();
        break;
      case 'super-admin':
        this.roleName = 'Super Admin';
        this.roleDescription = 'Full access to the system settings and management.';
        this.loadSuperAdminPermissions();
        break;
      case 'l1-reviewer':
        this.roleName = 'L1 Reviewer';
        this.roleDescription = 'Reviews and assesses cases at the initial level.';
        this.loadL1ReviewerPermissions();
        break;
      default:
        break;
    }
  }

  private loadSuperAdminPermissions(): void {
    this.permissionCategories.forEach(category => {
      category.permissions.forEach((permission, index) => {
        permission.view = true;
        permission.edit = index % 2 === 0;  // Half the items
        permission.manage = index % 2 !== 0;
      });
    });
  }

  private loadDataManagerPermissions(): void {
    const dataManagement = this.permissionCategories.find(c => c.name === 'Data Management');
    if (dataManagement) {
      dataManagement.permissions[0].view = true;
      dataManagement.permissions[0].manage = true;
      dataManagement.permissions[1].view = true;
      dataManagement.permissions[1].edit = true;
    }

    const projectManagement = this.permissionCategories.find(c => c.name === 'Project Management');
    if (projectManagement) {
      projectManagement.permissions[0].view = true;
      projectManagement.permissions[1].edit = true;
      projectManagement.permissions[2].manage = true;
    }

    const documentManagement = this.permissionCategories.find(c => c.name === 'Document Management');
    if (documentManagement) {
      documentManagement.permissions[0].view = true;
      documentManagement.permissions[1].edit = true;
      documentManagement.permissions[2].manage = true;
    }
  }

  private loadL1ReviewerPermissions(): void {
    const investigation = this.permissionCategories.find(c => c.name === 'Investigation Workflow');
    if (investigation) {
      investigation.permissions[0].view = true;
      investigation.permissions[1].edit = true;
      investigation.permissions[2].manage = true;
    }

    const insights = this.permissionCategories.find(c => c.name === 'Insights & Reporting');
    if (insights) {
      insights.permissions[0].view = true;
      insights.permissions[1].edit = true;
      insights.permissions[2].manage = true;
    }

    const document = this.permissionCategories.find(c => c.name === 'Document Management');
    if (document) {
      document.permissions[0].view = true;
      document.permissions[1].edit = true;
    }
  }

  onBackClick(): void {
    this.router.navigate(['/roles']);
  }

  onEditRole(): void {
    this.isEditMode = true;
    this.editRoleName = this.roleName;
    this.editRoleDescription = this.roleDescription;
  }

  onDeleteRole(): void {
    console.log('Delete role clicked');
  }

  selectCategory(category: PermissionCategory): void {
    this.permissionCategories.forEach(cat => cat.active = false);
    category.active = true;
  }

  getActivePermissions(): Permission[] {
    const activeCategory = this.permissionCategories.find(cat => cat.active);
    return activeCategory ? activeCategory.permissions : [];
  }

  getActiveCategoryName(): string {
    const activeCategory = this.permissionCategories.find(cat => cat.active);
    return activeCategory ? activeCategory.name : '';
  }

  isAllViewChecked(): boolean {
    const permissions = this.getActivePermissions();
    return permissions.length > 0 && permissions.every(p => p.view);
  }

  isAllEditChecked(): boolean {
    const permissions = this.getActivePermissions();
    return permissions.length > 0 && permissions.every(p => p.edit);
  }

  isAllManageChecked(): boolean {
    const permissions = this.getActivePermissions();
    return permissions.length > 0 && permissions.every(p => p.manage);
  }

  onSaveRole(): void {
    if (!this.editRoleName.trim()) {
      console.error('Role name is required');
      return;
    }

    if (!this.editRoleDescription.trim()) {
      console.error('Role description is required');
      return;
    }

    const hasEnoughPermissions = this.permissionCategories.every(category => {
      const selectedCount = category.permissions.reduce(
        (count, p) => count + Number(p.view) + Number(p.edit) + Number(p.manage),
        0
      );
      return selectedCount >= 3;  // Require at least 3 selected per category
    });

    if (!hasEnoughPermissions) {
      console.error('Each category must have at least 3 permissions selected');
      return;
    }

    if (this.isAddMode) {
      const newRole = {
        id: this.generateRoleId(this.editRoleName),
        name: this.editRoleName,
        description: this.editRoleDescription,
        permissions: this.permissionCategories
      };

      console.log('New role created:', newRole);
      this.router.navigate(['/roles'], {
        queryParams: { created: 'true', roleName: this.editRoleName }
      });
    } else {
      this.roleName = this.editRoleName;
      this.roleDescription = this.editRoleDescription;
      this.isEditMode = false;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });

      console.log('Role updated:', {
        name: this.roleName,
        description: this.roleDescription,
        permissions: this.permissionCategories
      });
    }
  }

  onCancelEdit(): void {
    if (this.isAddMode) {
      this.router.navigate(['/roles']);
    } else {
      this.editRoleName = this.roleName;
      this.editRoleDescription = this.roleDescription;
      this.isEditMode = false;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

  onPermissionChange(categoryName: string, permissionName: string, permissionType: 'view' | 'edit' | 'manage', event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    const category = this.permissionCategories.find(cat => cat.name === categoryName);
    if (category) {
      const permission = category.permissions.find(p => p.name === permissionName);
      if (permission) {
        permission[permissionType] = checked;
      }
    }
  }

  onHeaderCheckboxChange(permissionType: 'view' | 'edit' | 'manage', event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    const activeCategory = this.permissionCategories.find(cat => cat.active);
    if (activeCategory) {
      activeCategory.permissions.forEach(permission => {
        permission[permissionType] = checked;
      });
    }
  }

  private generateRoleId(roleName: string): string {
    return roleName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  get pageTitle(): string {
    if (this.isAddMode) return 'Add Role';
    if (this.isEditMode) return 'Edit Role';
    return 'View Role';
  }

  get pageSubtitle(): string {
    if (this.isAddMode) return 'Create a new role with specific permissions to control user access.';
    if (this.isEditMode) return 'Modify role permissions to align with evolving needs.';
    return 'Review role details and permissions.';
  }

  get permissionsTitle(): string {
    if (this.isAddMode || this.isEditMode) return 'Configure Permissions';
    return 'Permissions';
  }

  get permissionsDescription(): string {
    if (this.isAddMode || this.isEditMode) {
      return 'Define user permissions at the platform level to control access and actions across all projects.';
    }
    return 'Defined user permissions at the platform level to control access and actions across all projects.';
  }

  get saveButtonText(): string {
    return this.isAddMode ? 'Create Role' : 'Save';
  }

  get showDeleteButton(): boolean {
    return !this.isEditMode && !this.isAddMode;
  }

  get showRoleInfo(): boolean {
    return !this.isEditMode && !this.isAddMode;
  }
}
