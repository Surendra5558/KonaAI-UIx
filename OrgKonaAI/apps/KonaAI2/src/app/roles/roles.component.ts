import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';
import { DeletePopupComponent } from '../shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, DeletePopupComponent],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  showDeletePopup = false;
  deleteData: DeletePopupData = {
    title: 'Delete Role',
    message: 'Are you sure you want to delete',
    itemName: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  constructor(private router: Router) {}

  hasRoles: boolean = true;

  presentRoles: Array<{ name: string; permissions: string; description: string }> = [
    {
      name: 'Super Admin',
      permissions: 'View Modules, View Users, Edit Users, Delete Users, View Roles, Edit Roles....',
      description: 'A brief description of the role and the purpose of the role....'
    },
    {
      name: 'Data Manager',
      permissions: 'View Data Sources, Edit Data Sources, Delete Data Sources, View Mappings...',
      description: 'Manages data imports, integrations, and mappings'
    },
    {
      name: 'L1 Reviewer',
      permissions: 'View Assigned Alerts, View Transaction Details, View Supporting Document...',
      description: 'Reviews and assesses cases at the initial level.'
    }
  ];

  toggleRoles(): void {
    this.hasRoles = !this.hasRoles;
  }

  trackByRoleName = (_: number, item: { name: string }) => item.name;

  onEditClick(roleName: string): void {
    const roleId = roleName.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/view-role', roleId], { queryParams: { edit: 'true' } });
  }

  onDeleteClick(roleName: string): void {
    this.deleteData = {
      ...this.deleteData,
      itemName: roleName
    };
    this.showDeletePopup = true;
  }

  handleDeleteResult(result: DeletePopupResult): void {
    this.showDeletePopup = false;

    if (result.confirmed && result.data?.itemName) {
      this.deleteRole(result.data.itemName);
    }
  }

  private deleteRole(roleName: string): void {
    this.presentRoles = this.presentRoles.filter(role => role.name !== roleName);

    if (this.presentRoles.length === 0) {
      this.hasRoles = false;
    }

    console.log(`Role "${roleName}" deleted successfully`);
  }

  onRedirectClick(roleName: string): void {
    const roleId = roleName.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/view-role', roleId]);
  }

  openAddRole(){
    this.router.navigate(['/view-role', 'add']);
  }
}
