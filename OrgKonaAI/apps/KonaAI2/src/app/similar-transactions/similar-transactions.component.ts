import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import * as bootstrap from 'bootstrap';

export interface Transaction {
  id: string;
  vendorNumber: string;
  vendorName: string;
  systemInvoiceNo: string;
  systemInvoiceLineNo: string;
  physicalInvoiceNo: string;
  tag?: string;
  alerts: number;
  hasOcr: boolean;
  hasExternalLink: boolean;
  selected: boolean;
  groupId: string;
}

export interface TransactionGroup {
  id: string;
  name: string;
  transactions: Transaction[];
  expanded: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

@Component({
  selector: 'app-similar-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './similar-transactions.component.html',
  styleUrls: ['./similar-transactions.component.scss'],
 encapsulation: ViewEncapsulation.ShadowDom
})
export class SimilarTransactionsComponent implements OnInit {
  @Input() data: TransactionGroup[] = [];
  @Output() transactionSelected = new EventEmitter<Transaction>();
  @Output() bulkActionRequested = new EventEmitter<{action: string, transactions: Transaction[]}>();

  // Filter options
  riskCategories: FilterOption[] = [
    { value: 'high', label: 'High Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'low', label: 'Low Risk' }
  ];

  tests: FilterOption[] = [
    { value: 'duplicate', label: 'Duplicate Detection' },
    { value: 'anomaly', label: 'Anomaly Detection' },
    { value: 'compliance', label: 'Compliance Check' }
  ];

  // Column configuration
  availableColumns: ColumnConfig[] = [
    { key: 'vendorNumber', label: 'Vendor Number', visible: true, sortable: true },
    { key: 'vendorName', label: 'Vendor Name', visible: true, sortable: true },
    { key: 'systemInvoiceNo', label: 'System Invoice No', visible: true, sortable: true },
    { key: 'systemInvoiceLineNo', label: 'System Invoice Line No', visible: true, sortable: true },
    { key: 'physicalInvoiceNo', label: 'Physical Invoice No', visible: true, sortable: true },
    { key: 'tag', label: 'Tag', visible: true, sortable: false },
    { key: 'alerts', label: 'Alerts', visible: true, sortable: true },
    { key: 'ocr', label: 'OCR', visible: true, sortable: false }
  ];

  // State variables
  selectedRiskCategory = '';
  selectedTests = '';
  showColumnsPanel = false;
  
  // Sorting
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalItems = 0;
  
  // Selection
  selectedTransactions: Transaction[] = [];
  
  // Mock data for development
  mockGroups: TransactionGroup[] = [
    {
      id: 'group-2232',
      name: 'Group-2232',
      expanded: true,
      transactions: [
        {
          id: '1',
          vendorNumber: '2000093134',
          vendorName: 'MOBIL PNG GAS H...',
          systemInvoiceNo: 'SYS-65000061304',
          systemInvoiceLineNo: 'MOBIL PNG GAS HOLDI...',
          physicalInvoiceNo: 'INV-65000061300',
          tag: 'Prioritise Review',
          alerts: 1,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2232'
        },
        {
          id: '2',
          vendorNumber: '2000093134',
          vendorName: 'Gerlach LLC',
          systemInvoiceNo: 'SYS-65000061305',
          systemInvoiceLineNo: 'MOBIL PNG GAS HOLDI...',
          physicalInvoiceNo: 'INV-65000061312',
          alerts: 2,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2232'
        },
        {
          id: '3',
          vendorNumber: '2000093135',
          vendorName: 'Gerlach LLC',
          systemInvoiceNo: 'SYS-65000061311',
          systemInvoiceLineNo: 'MOBIL PNG GAS HOLDI...',
          physicalInvoiceNo: 'INV-65000061376',
          tag: 'Prioritise Review',
          alerts: 4,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2232'
        }
      ]
    },
    {
      id: 'group-2233',
      name: 'Group-2233',
      expanded: false,
      transactions: [
        {
          id: '4',
          vendorNumber: '2000093134',
          vendorName: 'Emmerich and Sons',
          systemInvoiceNo: 'SYS-65000061324',
          systemInvoiceLineNo: 'MOBIL PNG GAS HOLDI...',
          physicalInvoiceNo: 'INV-65000061376',
          tag: 'Downgrade',
          alerts: 3,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2233'
        },
        {
          id: '5',
          vendorNumber: '2000093134',
          vendorName: 'Goldner, Cummerat...',
          systemInvoiceNo: 'SYS-65000061341',
          systemInvoiceLineNo: 'MOBIL PNG GAS HOLDI...',
          physicalInvoiceNo: 'INV-65000061307',
          alerts: 0,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2233'
        },
        {
          id: '6',
          vendorNumber: '2000093135',
          vendorName: 'Harber Group',
          systemInvoiceNo: 'SYS-65000061332',
          systemInvoiceLineNo: 'MOBIL PNG GAS HOLDI...',
          physicalInvoiceNo: 'INV-65000061356',
          tag: 'Flag for Review',
          alerts: 4,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2233'
        }
      ]
    },
    {
      id: 'group-2234',
      name: 'Group-2234',
      expanded: false,
      transactions: [
        
      ]
    },
      {
      id: 'group-2235',
      name: 'Group-2235',
      expanded: false,
      transactions: [
        
      ]
    },
      {
      id: 'group-2236',
      name: 'Group-2236',
      expanded: false,
      transactions: [
        
      ]
    },
      {
      id: 'group-2237',
      name: 'Group-2237',
      expanded: false,
      transactions: [
        
      ]
    },
      {
      id: 'group-2238',
      name: 'Group-2238',
      expanded: false,
      transactions: [
        
      ]
    },
    {
      id: 'group-2239',
      name: 'Group-2239',
      expanded: false,
      transactions: [
        
      ]
    },
    {
      id: 'group-2240',
      name: 'Group-2240',
      expanded: false,
      transactions: [
        
      ]
    },
     {
      id: 'group-2241',
      name: 'Group-2241',
      expanded: false,
      transactions: [
        
      ]
    },
    {
      id: 'group-2242',
      name: 'Group-2242',
      expanded: false,
      transactions: [
        
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Use provided data or fall back to mock data
    if (this.data.length === 0) {
      this.data = this.mockGroups;
    }
    this.updatePagination();
  }

  // Group management
  toggleGroup(group: TransactionGroup): void {
    group.expanded = !group.expanded;
  }

  getGroupBadges(group: TransactionGroup): {type: string, text: string}[] {
    const badges: {type: string, text: string}[] = [];
    
    const hasFlag = group.transactions.some(t => t.tag === 'Flag for Review');
    const hasPriority = group.transactions.some(t => t.tag === 'Prioritise Review');
    
    if (hasPriority) {
      badges.push({ type: 'priority', text: 'Prioritise Review' });
    }
    if (hasFlag) {
      badges.push({ type: 'flag', text: 'Flag for Review' });
    }
    
    return badges;
  }

  getGroupAlertCount(group: TransactionGroup): number {
    return group.transactions.reduce((sum, t) => sum + t.alerts, 0);
  }

  getGroupOcrCount(group: TransactionGroup): number {
    return group.transactions.filter(t => t.hasOcr).length;
  }

  // Sorting
  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applySorting();
  }

  private applySorting(): void {
    this.data.forEach(group => {
      group.transactions.sort((a, b) => {
        let aValue: any = a[this.sortColumn as keyof Transaction];
        let bValue: any = b[this.sortColumn as keyof Transaction];
        
        // Handle different data types
        if (typeof aValue === 'string') {
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
    });
  }

  // Selection management
  get isAllSelected(): boolean {
    const allTransactions = this.getAllTransactions();
    return allTransactions.length > 0 && allTransactions.every(t => t.selected);
  }

  toggleSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    
    this.data.forEach(group => {
      group.transactions.forEach(transaction => {
        transaction.selected = isChecked;
      });
    });
    
    this.updateSelectionState();
  }

  updateSelectionState(): void {
    this.selectedTransactions = this.getAllTransactions().filter(t => t.selected);
  }

  private getAllTransactions(): Transaction[] {
    return this.data.flatMap(group => group.transactions);
  }

  // Pagination
  get paginatedGroups(): TransactionGroup[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // For simplicity, we're paginating groups, not individual transactions
    return this.data.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  updatePagination(): void {
    this.totalItems = this.data.length;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const current = this.currentPage;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (current > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < totalPages - 3) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  }

  // Column management
  toggleColumnsPanel(): void {
    this.showColumnsPanel = !this.showColumnsPanel;
  }

  // Action handlers
  viewTransaction(transaction: Transaction): void {
    this.transactionSelected.emit(transaction);
  }

  editTransaction(transaction: Transaction): void {
    // Implement edit functionality
    console.log('Edit transaction:', transaction);
  }

  flagTransaction(transaction: Transaction): void {
    transaction.tag = 'Flag for Review';
    // Implement API call to update transaction
    console.log('Flag transaction:', transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      // Find and remove transaction from its group
      this.data.forEach(group => {
        const index = group.transactions.findIndex(t => t.id === transaction.id);
        if (index > -1) {
          group.transactions.splice(index, 1);
        }
      });
      
      // Remove empty groups
      this.data = this.data.filter(group => group.transactions.length > 0);
      this.updatePagination();
    }
  }

  // Bulk actions
  performBulkAction(action: string): void {
    if (this.selectedTransactions.length === 0) {
      alert('Please select at least one transaction.');
      return;
    }
    
    this.bulkActionRequested.emit({
      action,
      transactions: this.selectedTransactions
    });
  }

  // Export functionality
  exportToCSV(): void {
    const allTransactions = this.getAllTransactions();
    const csvData = this.convertToCSV(allTransactions);
    this.downloadCSV(csvData, 'similar-transactions.csv');
  }

  private convertToCSV(transactions: Transaction[]): string {
    const headers = [
      'Vendor Number',
      'Vendor Name',
      'System Invoice No',
      'System Invoice Line No',
      'Physical Invoice No',
      'Tag',
      'Alerts',
      'Has OCR',
      'Has External Link'
    ];
    
    const rows = transactions.map(t => [
      t.vendorNumber,
      t.vendorName,
      t.systemInvoiceNo,
      t.systemInvoiceLineNo,
      t.physicalInvoiceNo,
      t.tag || '',
      t.alerts.toString(),
      t.hasOcr ? 'Yes' : 'No',
      t.hasExternalLink ? 'Yes' : 'No'
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  private downloadCSV(csvData: string, filename: string): void {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Filter methods
  applyFilters(): void {
    // Implement filtering logic based on selectedRiskCategory and selectedTests
    console.log('Applying filters:', {
      riskCategory: this.selectedRiskCategory,
      tests: this.selectedTests
    });
  }

  clearFilters(): void {
    this.selectedRiskCategory = '';
    this.selectedTests = '';
    this.applyFilters();
  }

  // Utility methods
  getStatusClass(transaction: Transaction): string {
    if (transaction.tag === 'Prioritise Review') return 'status-priority';
    if (transaction.tag === 'Flag for Review') return 'status-flag';
    if (transaction.tag === 'Downgrade') return 'status-downgrade';
    return '';
  }

  getTotalAlerts(): number {
    return this.getAllTransactions().reduce((sum, t) => sum + t.alerts, 0);
  }

  getTotalOCRCount(): number {
    return this.getAllTransactions().filter(t => t.hasOcr).length;
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent, transaction: Transaction): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      transaction.selected = !transaction.selected;
      this.updateSelectionState();
    }
  }
  selectedCount = 2;

  closeToolbar() {
    console.log('Toolbar closed');
  }

  applyAction() {
    console.log('Apply clicked');
  }

  viewDetails() {
    console.log('View transaction details');
  }

  newAlert() {
    console.log('New Alert created');
  }
  showPopup()
  {
   this.isOpen = true;
  }
  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  
}
