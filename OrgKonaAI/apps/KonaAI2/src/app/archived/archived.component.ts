// archived.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DeletePopupComponent, DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';
import { TopBarComponent } from '../TopBar/top-bar.component';
import { AuthService } from '../auth/auth.service';

interface ArchivedItem {
  id: string;
  projectName: string;
  submodule: string;
  sourceSystem: string;
  fileName: string;
  uploadedOn: Date;
  modifiedOn: Date;
  status: string;
}

interface Tab {
  key: string;
  label: string;
}

@Component({
  selector: 'app-archived',
  imports: [
    CommonModule,
    FormsModule,
    DeletePopupComponent,TopBarComponent
  ],
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss']
})
export class ArchivedComponent implements OnInit {
  // Tab configuration
  tabs: Tab[] = [
    { key: 'p2p', label: 'P2P' },
    { key: 'o2c', label: 'O2C' },
    { key: 'tre', label: 'T&E' }
  ];
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  pageIndex = 0;
  activeTab: string = 'p2p';
  showDeletePopup = false;
  selectedItem: ArchivedItem | null = null;
  deleteData: DeletePopupData = {
    title: 'Permanently Delete',
    message: 'Are you sure to permanently delete',
    itemName: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };
  activateTab: string ='projects';
    onTabChanged(tab: string) {
    console.log(tab)
    this.activateTab = tab;
    if (tab === 'organisation') {
      this.authservice.setShowOrganisationValue('true');
    }
    else if (tab === 'projects') {
      this.authservice.setShowOrganisationValue('false');
    }
  }
  // Sample data - replace with actual data service
  allData: ArchivedItem[] = [
    {
      id: '1',
      projectName: 'Q1 24 Procurement Audit',
      submodule: 'Orders',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Import'
    },
    {
      id: '2',
      projectName: 'Q1 24 Procurement Audit',
      submodule: 'Orders',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Import'
    },
    {
      id: '3',
      projectName: 'Q1 24 Procurement Audit',
      submodule: 'Invoices',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Quality'
    },
    {
      id: '4',
      projectName: 'Customer Refunds Review',
      submodule: 'Vendor',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Staging'
    },
    {
      id: '5',
      projectName: 'Credit Limit Review',
      submodule: 'Orders',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Quality'
    },
    {
      id: '6',
      projectName: 'Q1 24 Procurement Audit',
      submodule: 'Orders',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Quality'
    },
    {
      id: '7',
      projectName: 'Customer Refunds Review',
      submodule: 'Vendor',
      sourceSystem: 'SAP',
      fileName: 'Numera Privileged & Confidential-A...',
      uploadedOn: new Date('2024-12-01'),
      modifiedOn: new Date('2024-12-31'),
      status: 'Failed at Data Quality'
    },
  ];
  isOpen = false;
  selectedOption = 'Project';

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isOpen = false;
  }
  // Filter and search properties
  searchTerm: string = '';
  selectedProject: string = '';
  selectedModule: string = '';
  filteredData: ArchivedItem[] = [];

  // Sorting properties
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  // Filter options
  projects: string[] = [];
  modules: string[] = [];
  isDataManager:boolean=false;
  constructor(private router: Router,public authservice : AuthService){}

  ngOnInit(): void {
    
    const currentUser = this.authservice.currentUserValue;
    this.isDataManager = currentUser?.role === 'Data Manager';
    this.initializeData();
    this.extractFilterOptions();
    this.applyFiltersAndPagination();
  }

  initializeData(): void {
    // Initialize with sample data - in real app, fetch from service
    this.filteredData = [...this.allData];
    this.totalItems = this.allData.length;
  }

  extractFilterOptions(): void {
    // Extract unique values for filter dropdowns
    this.projects = [...new Set(this.allData.map(item => item.projectName))].sort();
    this.modules = [...new Set(this.allData.map(item => item.submodule))].sort();
  }

  setActiveTab(tabKey: string): void {
    this.activeTab = tabKey;
    // In real app, you might fetch different data based on tab
    this.resetFilters();
    this.applyFiltersAndPagination();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedProject = '';
    this.selectedModule = '';
    this.currentPage = 1;
  }

  applyFiltersAndPagination(): void {
    let filtered = [...this.allData];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.projectName.toLowerCase().includes(searchLower) ||
        item.submodule.toLowerCase().includes(searchLower) ||
        item.sourceSystem.toLowerCase().includes(searchLower) ||
        item.fileName.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
    }

    // Apply project filter
    if (this.selectedProject) {
      filtered = filtered.filter(item => item.projectName === this.selectedProject);
    }

    // Apply module filter
    if (this.selectedModule) {
      filtered = filtered.filter(item => item.submodule === this.selectedModule);
    }

    // Apply sorting
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        let aValue: any = a[this.sortColumn as keyof ArchivedItem];
        let bValue: any = b[this.sortColumn as keyof ArchivedItem];

        if (aValue instanceof Date && bValue instanceof Date) {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);

    this.filteredData = filtered.slice(startIndex, endIndex);
    this.startIndex = this.totalItems > 0 ? startIndex + 1 : 0;
    this.endIndex = endIndex;
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndPagination();
  }
  
  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  getVisiblePages(): number[] {
    const maxVisible = 5;
    const pages: number[] = [];

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Failed at Data Import': 'failed-data-import',
      'Failed at Data Quality': 'failed-data-quality',
      'Failed at Data Staging': 'failed-data-staging',
      'Completed': 'completed',
      'In Progress': 'in-progress'
    };

    return statusMap[status] || 'failed-data-import';
  }

  goBack(): void {
    // Navigate back to previous page
    // In real app: this.router.navigate(['/previous-route']);
    console.log('Navigate back');
  }

  openActionMenu(item: ArchivedItem): void {
    this.router.navigate(['/archive/view']);
    console.log('Open action menu for:', item);
  }

  deleteItem(item: ArchivedItem): void {
    this.selectedItem = item;
    this.deleteData = {
      ...this.deleteData,
      itemName: item.projectName
    };
    this.showDeletePopup = true;
  }
  handleDeleteResult(result: DeletePopupResult) {
    this.showDeletePopup = false;

    if (result.confirmed && this.selectedItem) {
      this.allData = this.allData.filter(d => d.id !== this.selectedItem!.id);
      this.applyFiltersAndPagination();
      console.log('Deleted item:', this.selectedItem);
      this.selectedItem = null;
    } else {
      console.log('Delete cancelled');
    }
  }

  // Utility methods for template
  trackByFn(index: number, item: ArchivedItem): string {
    return item.id;
  }
  
  // ---------- PAGINATION ACTIONS ----------
  setPageSize(size: number) {
    this.pageSize = size;
    this.pageIndex = 0;
  }
  prevPage() {
    if (this.pageIndex > 0) this.pageIndex--;
  }
  nextPage() {
    if (this.pageIndex < this.totalPages - 1) this.pageIndex++;
  }
  goToPage(i: number) {
    if (i >= 0 && i < this.totalPages) this.pageIndex = i;
  }
  private resetToFirstPage() { this.pageIndex = 0; }

}