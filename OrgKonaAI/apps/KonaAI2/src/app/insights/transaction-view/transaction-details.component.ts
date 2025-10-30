import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface TransactionDetail {
  systemInvoice: string;
  vendorName: string;
  invoiceType: string;
  invoiceDescription: string;
  tag?: string;
  tagClass?: string;
  alerts: number;
  hasOcr: boolean;
  selected: boolean;
  amount?: number;
  currency?: string;
  date?: string;
  status?: string;
}

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transactions: TransactionDetail[] = [];
  selectedVendors: string[] = [];
  searchTerm: string = '';
  selectedRiskCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 15;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get selected vendors from route params or query params
    this.route.queryParams.subscribe(params => {
      if (params['vendors']) {
        this.selectedVendors = JSON.parse(params['vendors']);
      }
    });

    // Load transaction data for selected vendors
    this.loadTransactionData();
  }

  loadTransactionData(): void {
    // Mock data - in real app, this would come from a service
    this.transactions = [
      {
        systemInvoice: 'SYS-65000061304',
        vendorName: 'MOBIL PNG GAS HOLDINGS PTY LTD',
        invoiceType: 'RE-Vendor Invoice gross',
        invoiceDescription: 'Apr 21 Op Site Maintenance',
        tag: 'Flag for Review',
        tagClass: 'flag-review',
        alerts: 1,
        hasOcr: true,
        selected: false,
        amount: 15420.50,
        currency: 'USD',
        date: '2024-04-21',
        status: 'Pending'
      },
      {
        systemInvoice: 'SYS-65000061305',
        vendorName: 'Gerlach LLC',
        invoiceType: 'RE-Vendor Invoice gross',
        invoiceDescription: 'Field Operations',
        tag: 'Prioritise Review',
        tagClass: 'prioritise-review',
        alerts: 1,
        hasOcr: true,
        selected: false,
        amount: 8750.00,
        currency: 'USD',
        date: '2024-04-20',
        status: 'Approved'
      },
      {
        systemInvoice: 'SYS-65000061306',
        vendorName: 'Emmerich and Sons',
        invoiceType: 'RE-Vendor Invoice gross',
        invoiceDescription: 'Equipment Rental Monthly',
        tag: 'Prioritise Review',
        tagClass: 'prioritise-review',
        alerts: 2,
        hasOcr: true,
        selected: false,
        amount: 12350.75,
        currency: 'USD',
        date: '2024-04-19',
        status: 'Pending'
      },
      {
        systemInvoice: 'SYS-65000061307',
        vendorName: 'Hammes, Leannon and Goldner Custom',
        invoiceType: 'RE-Vendor Invoice gross',
        invoiceDescription: 'Logistics Support',
        tag: 'Prioritise Review',
        tagClass: 'prioritise-review',
        alerts: 4,
        hasOcr: true,
        selected: false,
        amount: 28950.25,
        currency: 'USD',
        date: '2024-04-18',
        status: 'Rejected'
      },
      {
        systemInvoice: 'SYS-65000061308',
        vendorName: 'Goldner, Cummerate and Rempel Custom',
        invoiceType: 'RE-Vendor Invoice gross',
        invoiceDescription: 'Professional Services',
        tag: 'Prioritise Review',
        tagClass: 'prioritise-review',
        alerts: 1,
        hasOcr: true,
        selected: false,
        amount: 15680.00,
        currency: 'USD',
        date: '2024-04-17',
        status: 'Pending'
      }
    ];
  }

  goBack(): void {
    // TODO: Implement navigation back to previous view
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.transactions.forEach(tx => tx.selected = isChecked);
  }

  onTransactionSelectionChange(): void {
    // Handle transaction selection changes
  }

  getSelectedCount(): number {
    return this.transactions.filter(tx => tx.selected).length;
  }

  clearAllSelections(): void {
    this.transactions.forEach(tx => tx.selected = false);
  }

  applyTag(tag: string): void {
    const selectedTransactions = this.transactions.filter(tx => tx.selected);
    selectedTransactions.forEach(tx => {
      switch (tag) {
        case 'prioritise':
          tx.tag = 'Prioritise Review';
          tx.tagClass = 'prioritise-review';
          break;
        case 'flag':
          tx.tag = 'Flag for Review';
          tx.tagClass = 'flag-review';
          break;
        case 'downgrade':
          tx.tag = 'Downgrade';
          tx.tagClass = 'downgrade';
          break;
      }
    });
    this.clearAllSelections();
  }

  createNewAlert(): void {
    const selectedTransactions = this.transactions.filter(tx => tx.selected);
    console.log('Create new alert for:', selectedTransactions);
    // TODO: Navigate to create alert page or open modal
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getRiskLevelClass(alerts: number): string {
    if (alerts >= 4) return 'high-risk';
    if (alerts >= 2) return 'medium-risk';
    return 'low-risk';
  }
}
