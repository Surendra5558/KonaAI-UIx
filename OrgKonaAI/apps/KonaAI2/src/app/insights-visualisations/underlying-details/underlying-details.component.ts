import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe, CurrencyPipe } from '@angular/common';

interface Transaction {
  transactionLineNo: number;
  vendorId: string;
  vendorName: string;
  invoiceType: string;
  invoiceDescription: string;
  glAccountDescription: string;
  physicalInvoice: string;
  systemInvoice: string;
  postingDate: string;
  currency: string;
  amount: number;
}

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

interface TestInfo {
  testId: string;
  category: string;
  totalTested: number;
  flaggedPercent: number;
  totalAmount: number;
  atRisk: number;
}

@Component({
  selector: 'app-underlying-details',
  imports: [CommonModule, DecimalPipe, CurrencyPipe],
  templateUrl: './underlying-details.component.html',
  styleUrl: './underlying-details.component.scss'
})
export class UnderlyingDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef<HTMLDivElement>;

  // Expose Math to template
  Math = Math;

  // Event listeners for cleanup
  private scrollListener?: () => void;
  private resizeListener?: () => void;

  // Test Information
  testInfo: TestInfo = {
    testId: 'T2SCFPY111',
    category: 'Conflict of Interest',
    totalTested: 122397,
    flaggedPercent: 1.069,
    totalAmount: 830842877.00,
    atRisk: 640672701.60
  };

  // Sample transaction data
  transactions: Transaction[] = [
    {
      transactionLineNo: 150792,
      vendorId: '0001003812',
      vendorName: 'MOBIL PNG GAS HOLDI...',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Apr 21 Op Site Maintenance',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006300',
      systemInvoice: 'SYS-6500006304',
      postingDate: '14-11-2023',
      currency: 'NOK',
      amount: 45000
    },
    {
      transactionLineNo: 170600,
      vendorId: '0000003640',
      vendorName: 'Geriach LLC',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Field Operations',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006301',
      systemInvoice: 'SYS-6500006304',
      postingDate: '18-01-2023',
      currency: 'NOK',
      amount: 32500
    },
    {
      transactionLineNo: 150790,
      vendorId: '0040070379',
      vendorName: 'Emmerich and Sons',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Equipment Rental Monthly',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006302',
      systemInvoice: 'SYS-6500006304',
      postingDate: '22-05-2023',
      currency: 'NOK',
      amount: 18750
    },
    {
      transactionLineNo: 170584,
      vendorId: '0040019213',
      vendorName: 'Hammes, Laenmon and...',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Logistics Support',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006303',
      systemInvoice: 'SYS-6500006305',
      postingDate: '05-11-2023',
      currency: 'NOK',
      amount: 28900
    },
    {
      transactionLineNo: 170588,
      vendorId: '0040032677',
      vendorName: 'Goldner, Cummerate an...',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Professional Services',
      glAccountDescription: '-',
      physicalInvoice: 'INV-6500006304',
      systemInvoice: 'SYS-6500006307',
      postingDate: '02-04-2023',
      currency: 'EUR',
      amount: 15600
    },
    {
      transactionLineNo: 170596,
      vendorId: '0040049965',
      vendorName: 'Harbor Group',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Maintenance Contract',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006305',
      systemInvoice: 'SYS-6500006311',
      postingDate: '14-11-2023',
      currency: 'USD',
      amount: 41200
    },
    {
      transactionLineNo: 150055,
      vendorId: '0040060477',
      vendorName: 'Dach, Pollich and Kozey...',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Logistics Support',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006306',
      systemInvoice: 'SYS-6500006309',
      postingDate: '18-01-2023',
      currency: 'EUR',
      amount: 33750
    },
    {
      transactionLineNo: 170604,
      vendorId: '0040074591',
      vendorName: "O'Connell-Lind ANPG C...",
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Technical Consulting',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006307',
      systemInvoice: 'SYS-6500006309',
      postingDate: '22-05-2023',
      currency: 'EUR',
      amount: 27300
    },
    {
      transactionLineNo: 150047,
      vendorId: '0040034463',
      vendorName: 'Lakin-Ernser Custom...',
      invoiceType: 'RE-Vendor invoice gross Pr...',
      invoiceDescription: 'Apr 21 Op Site Maintenance',
      glAccountDescription: '-',
      physicalInvoice: 'INV-6500006308',
      systemInvoice: 'SYS-6500006311',
      postingDate: '05-11-2023',
      currency: 'USD',
      amount: 52400
    },
    {
      transactionLineNo: 190053,
      vendorId: '0040038637',
      vendorName: 'Schimmel-Reilly Custom...',
      invoiceType: 'RE-Vendor invoice gross Pr...',
      invoiceDescription: 'Drilling Services Q1',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006309',
      systemInvoice: 'SYS-6500006312',
      postingDate: '02-04-2023',
      currency: 'USD',
      amount: 89500
    },
    {
      transactionLineNo: 170998,
      vendorId: '0040028843',
      vendorName: 'Schiller-Volkman Custo...',
      invoiceType: 'RE-Vendor invoice gross Pr...',
      invoiceDescription: 'Professional Services',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006310',
      systemInvoice: 'SYS-6500006318',
      postingDate: '14-11-2023',
      currency: 'USD',
      amount: 36800
    },
    {
      transactionLineNo: 150795,
      vendorId: '0040042657',
      vendorName: 'Lind-Gremblade...',
      invoiceType: 'RE-Vendor invoice gross Pr...',
      invoiceDescription: 'Equipment Rental Monthly',
      glAccountDescription: '-',
      physicalInvoice: 'INV-6500006311',
      systemInvoice: 'SYS-6500006313',
      postingDate: '18-01-2023',
      currency: 'GBP',
      amount: 22100
    },
    {
      transactionLineNo: 156382,
      vendorId: '0040020347',
      vendorName: 'ENERGY IMPORT BANC...',
      invoiceType: 'RE-Vendor invoice gross',
      invoiceDescription: 'Maintenance Contract',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006312',
      systemInvoice: 'SYS-6500006316',
      postingDate: '22-05-2023',
      currency: 'GBP',
      amount: 67900
    },
    {
      transactionLineNo: 170682,
      vendorId: '0040046521',
      vendorName: 'Lubowitz, Little and Mos...',
      invoiceType: 'RE-Vendor invoice gross Pr...',
      invoiceDescription: 'Logistics Support',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006313',
      systemInvoice: 'SYS-6500006314',
      postingDate: '05-11-2023',
      currency: 'USD',
      amount: 44300
    },
    {
      transactionLineNo: 150765,
      vendorId: '0040013448',
      vendorName: 'Walker-Labudie...',
      invoiceType: 'RE-Vendor invoice gross Pr...',
      invoiceDescription: 'Logistics Support',
      glAccountDescription: '0510003000- L:pay, prod &',
      physicalInvoice: 'INV-6500006314',
      systemInvoice: 'SYS-6500006315',
      postingDate: '02-04-2023',
      currency: 'NOK',
      amount: 31800
    }
  ];

  // Column configuration
  availableColumns: ColumnConfig[] = [
    { key: 'transactionLineNo', label: 'Transaction line no', visible: true, sortable: true },
    { key: 'vendorId', label: 'Vendor ID', visible: true, sortable: true },
    { key: 'vendorName', label: 'Vendor Name', visible: true, sortable: true },
    { key: 'invoiceType', label: 'Invoice Type', visible: true, sortable: true },
    { key: 'invoiceDescription', label: 'Invoice Description', visible: true, sortable: true },
    { key: 'glAccountDescription', label: 'GL Account Description', visible: true, sortable: true },
    { key: 'physicalInvoice', label: 'Physical Invoice', visible: true, sortable: true },
    { key: 'systemInvoice', label: 'System Invoice', visible: true, sortable: true },
    { key: 'postingDate', label: 'Posting Date', visible: true, sortable: true },
    { key: 'currency', label: 'Currency', visible: true, sortable: true },
    { key: 'amount', label: 'Amount', visible: false, sortable: true }
  ];

  // Filters and search
  searchTerm: string = '';
  selectedGroup: string = 'All Groups';
  showColumnCustomizer: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalItems: number = 2069;

  // Sort configuration
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngAfterViewInit() {
    // Set up scroll indicators after view initialization
    setTimeout(() => {
      this.setupScrollIndicators();
    });
  }

  ngOnDestroy() {
    // Clean up event listeners
    if (this.scrollListener) {
      this.tableContainer?.nativeElement?.removeEventListener('scroll', this.scrollListener);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private setupScrollIndicators(): void {
    if (!this.tableContainer?.nativeElement) return;

    const container = this.tableContainer.nativeElement;
    
    // Initial check
    this.updateScrollIndicators();
    
    // Create and store scroll listener
    this.scrollListener = () => {
      this.updateScrollIndicators();
    };
    
    // Create and store resize listener
    this.resizeListener = () => {
      this.updateScrollIndicators();
    };
    
    // Attach listeners
    container.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.resizeListener);
  }

  private updateScrollIndicators(): void {
    if (!this.tableContainer?.nativeElement) return;

    const container = this.tableContainer.nativeElement;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    // Add/remove classes based on scroll position
    if (scrollLeft > 0) {
      container.classList.add('scrolled-left');
    } else {
      container.classList.remove('scrolled-left');
    }
    
    if (scrollLeft < maxScrollLeft - 1) { // -1 for floating point precision
      container.classList.add('has-more-right');
    } else {
      container.classList.remove('has-more-right');
    }
  }

  get visibleColumns(): ColumnConfig[] {
    return this.availableColumns.filter(col => col.visible);
  }

  get filteredTransactions(): Transaction[] {
    let filtered = [...this.transactions];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        Object.values(t).some(value => 
          value?.toString().toLowerCase().includes(term)
        )
      );
    }

    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortField as keyof Transaction];
        const bVal = b[this.sortField as keyof Transaction];
        
        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTransactions.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Helper method to check if column is visible
  isColumnVisible(key: string): boolean {
    const column = this.availableColumns.find(col => col.key === key);
    return column ? column.visible : false;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1;
  }

  onGroupChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedGroup = target.value;
    this.currentPage = 1;
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value);
    this.currentPage = 1;
  }

  toggleColumnCustomizer(): void {
    this.showColumnCustomizer = !this.showColumnCustomizer;
  }

  toggleColumn(columnKey: string): void {
    const column = this.availableColumns.find(col => col.key === columnKey);
    if (column) {
      column.visible = !column.visible;
      // Update scroll indicators after column visibility changes
      setTimeout(() => {
        this.updateScrollIndicators();
      });
    }
  }

  showAllColumns(): void {
    this.availableColumns.forEach(col => col.visible = true);
    // Update scroll indicators after showing all columns
    setTimeout(() => {
      this.updateScrollIndicators();
    });
  }

  hideAllColumns(): void {
    this.availableColumns.forEach(col => col.visible = false);
    // Update scroll indicators after hiding all columns
    setTimeout(() => {
      this.updateScrollIndicators();
    });
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }
}