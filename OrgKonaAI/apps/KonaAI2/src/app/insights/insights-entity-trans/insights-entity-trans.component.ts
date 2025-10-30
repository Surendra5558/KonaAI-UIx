import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Vendor {
  id: string;
  name: string;
  country: string;
  riskRanking: number;
  riskScore: number;
  tag?: string;
  tagClass?: string;
  alerts: number;
  selected: boolean;
}

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
}

@Component({
  selector: 'app-insights-entity-trans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insights-entity-trans.component.html',
  styleUrls: ['./insights-entity-trans.component.scss']
})
export class InsightsEntityTransComponent implements OnInit {
  activeTab: 'entity-profiling' | 'transaction-details' = 'entity-profiling';
  activeView: 'entity-view' | 'transaction-view' = 'entity-view';
  selectedInsightType: string = 'P2P';
  selectedInvoiceType: string = 'invoices';
  searchTerm: string = '';
  selectedRiskCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 15;
  selectedTag: string = '';
  showActionPopup: boolean = false;
  actionPopupPosition: { top: number, left: number } = { top: 0, left: 0 };
  selectedRowIndex: number = -1;
  showChangeTagPopup: boolean = false;
  selectedTagOption: string = '';

  transactions: TransactionDetail[] = [
    {
      systemInvoice: 'SYS-65000061304',
      vendorName: 'MOBIL PNG GAS HOLDINGS PTY LTD',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Apr 21 Op Site Maintenance',
      tag: 'Flag for Review',
      tagClass: 'flag-review',
      alerts: 1,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061304',
      vendorName: 'Gerlach LLC',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Field Operations',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 1,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061304',
      vendorName: 'Emmerich and Sons',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Equipment Rental Monthly',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 2,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061305',
      vendorName: 'Hammes, Leannon and Goldner Custom',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Logistics Support',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 4,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061307',
      vendorName: 'Goldner, Cummerate and Rempel Custom',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Professional Services',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 1,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061311',
      vendorName: 'Harber Group',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Maintenance Contract',
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 3,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061309',
      vendorName: 'Dach, Pollich and Kozey KUMUL PETROLEUM',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Logistics Support',
      tag: undefined,
      tagClass: undefined,
      alerts: 1,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061309',
      vendorName: "O'Connell-Lind ANPG CONCESSIONAIRE FUNDS BIOCOMBUSTIVEIS",
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Technical Consulting',
      tag: 'Flag for Review',
      tagClass: 'flag-review',
      alerts: 4,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061311',
      vendorName: 'Lakin-Emser Custom',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Apr 21 Op Site Maintenance',
      tag: undefined,
      tagClass: undefined,
      alerts: 0,
      hasOcr: true,
      selected: false
    }
  ];

  // Transaction View Data - Comprehensive transaction data as per Figma design
  transactionViewData: any[] = [
    {
      systemInvoice: 'SYS-65000061304',
      vendorName: 'MOBIL PNG GAS HOLDINGS PTY LTD',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Apr 21 Op Site Maintenance',
      postingDate: '14-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061300',
      tag: 'Flag for Review',
      tagClass: 'flag-review',
      alerts: 1,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061304',
      vendorName: 'Gerlach LLC',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Field Operations',
      postingDate: '18-01-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061301',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 1,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061304',
      vendorName: 'Emmerich and Sons',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Equipment Rental Monthly',
      postingDate: '22-05-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061302',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 2,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061305',
      vendorName: 'Hammes, Leannon and Goldner Custom',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Logistics Support',
      postingDate: '05-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061303',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 4,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061307',
      vendorName: 'Goldner, Cummerate and Rempel Custom',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Professional Services',
      postingDate: '02-04-2023',
      glAccountDescription: '-',
      physicalInvoice: 'INV-65000061304',
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 1,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061311',
      vendorName: 'Harber Group',
      invoiceType: 'RE-Vendor Invoice gross',
      invoiceDescription: 'Maintenance Contract',
      postingDate: '14-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061305',
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 3,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061309',
      vendorName: 'Dach, Pollich and Kozey KUMUL PETROLEUM',
      invoiceType: 'RE-Vendor Invoice gross Process via citi direct',
      invoiceDescription: 'Logistics Support',
      postingDate: '18-01-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061306',
      tag: undefined,
      tagClass: undefined,
      alerts: 0,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061309',
      vendorName: "O'Connell-Lind ANPG CONCESSIONAIRE FUNDS BIOCOMBUSTIVEIS",
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Technical Consulting',
      postingDate: '22-05-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061307',
      tag: 'Flag for Review',
      tagClass: 'flag-review',
      alerts: 4,
      hasOcr: true,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061311',
      vendorName: 'Lakin-Emser Custom',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Apr 21 Op Site Maintenance',
      postingDate: '05-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061308',
      tag: undefined,
      tagClass: undefined,
      alerts: 0,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061312',
      vendorName: 'Schimmel-Reilly Custom',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Drilling Services Q1',
      postingDate: '14-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061309',
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 0,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061318',
      vendorName: 'Schiller-Volkman Custom',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Professional Services',
      postingDate: '18-01-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061310',
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 0,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061313',
      vendorName: 'Lind-Grembiebe',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Equipment Rental Monthly',
      postingDate: '22-05-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061311',
      tag: undefined,
      tagClass: undefined,
      alerts: 0,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061316',
      vendorName: 'ENERGY IMPORT BANK OF CHINA Custom',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Maintenance Contract',
      postingDate: '05-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061312',
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 0,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061314',
      vendorName: 'Lubowitz, Little and Moore O/L SEARCH LTD',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Logistics Support',
      postingDate: '14-11-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061313',
      tag: undefined,
      tagClass: undefined,
      alerts: 0,
      hasOcr: false,
      selected: false
    },
    {
      systemInvoice: 'SYS-65000061315',
      vendorName: 'Walker-Labadie',
      invoiceType: 'RE-Vendor Invoice gross PYMAT',
      invoiceDescription: 'Logistics Support',
      postingDate: '18-01-2023',
      glAccountDescription: '0510003000- L,pay, prod &',
      physicalInvoice: 'INV-65000061314',
      tag: undefined,
      tagClass: undefined,
      alerts: 0,
      hasOcr: false,
      selected: false
    }
  ];

  vendors: Vendor[] = [
    {
      id: '0001003812',
      name: 'MOBIL PNG GAS HOLDINGS PTY LTD',
      country: 'Australia',
      riskRanking: 1,
      riskScore: 127.03,
      tag: 'Flag for Review',
      tagClass: 'flag-review',
      alerts: 1,
      selected: false
    },
    {
      id: '0000003640',
      name: 'Gerlach LLC',
      country: 'Australia',
      riskRanking: 2,
      riskScore: 99.57,
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 1,
      selected: false
    },
    {
      id: '0040070379',
      name: 'Emmerich and Sons',
      country: 'Australia',
      riskRanking: 3,
      riskScore: 90.33,
      alerts: 2,
      selected: false
    },
    {
      id: '0040019213',
      name: 'Hammes, Leannon and Goldner Custom',
      country: 'Australia',
      riskRanking: 4,
      riskScore: 89.66,
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 4,
      selected: false
    },
    {
      id: '0040032677',
      name: 'Goldner, Cummerate and Rempel Custom',
      country: 'United Kingdom',
      riskRanking: 5,
      riskScore: 80.26,
      tag: 'Prioritise Review',
      tagClass: 'prioritise-review',
      alerts: 0,
      selected: false
    },
    {
      id: '0040049955',
      name: 'Harber Group',
      country: 'Australia',
      riskRanking: 6,
      riskScore: 80.26,
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 3,
      selected: false
    },
    {
      id: '0040060477',
      name: 'Dach, Pollich and Kozey KUMUL PETROLEUM',
      country: 'United States',
      riskRanking: 7,
      riskScore: 80.26,
      alerts: 0,
      selected: false
    },
    {
      id: '0040074551',
      name: "O'Connell-Lind ANPG CONCESSIONAIRE FUNDS BIOCOMBUSTIVEIS",
      country: 'Australia',
      riskRanking: 8,
      riskScore: 79.62,
      tag: 'Flag for Review',
      tagClass: 'flag-review',
      alerts: 4,
      selected: false
    },
    {
      id: '0040034463',
      name: 'Lakin-Emser Custom',
      country: 'Australia',
      riskRanking: 9,
      riskScore: 78.76,
      alerts: 0,
      selected: false
    },
    {
      id: '0040038637',
      name: 'Schimmel-Reilly Custom',
      country: 'United States',
      riskRanking: 10,
      riskScore: 78.09,
      alerts: 0,
      selected: false
    },
    {
      id: '0040012843',
      name: 'Schiller-Volkman Custom',
      country: 'United States',
      riskRanking: 11,
      riskScore: 68.38,
      alerts: 0,
      selected: false
    },
    {
      id: '0040042657',
      name: 'Lind-Grembiebe',
      country: 'Brazil',
      riskRanking: 12,
      riskScore: 65.13,
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 0,
      selected: false
    },
    {
      id: '0040020347',
      name: 'ENERGY IMPORT BANK OF CHINA Custom',
      country: 'Brazil',
      riskRanking: 13,
      riskScore: 64.77,
      alerts: 0,
      selected: false
    },
    {
      id: '0040046521',
      name: 'Lubowitz, Little and Moore O/L SEARCH LTD',
      country: 'United States',
      riskRanking: 14,
      riskScore: 59.55,
      tag: 'Downgrade',
      tagClass: 'downgrade',
      alerts: 0,
      selected: false
    },
    {
      id: '0040013448',
      name: 'Walker-Labadie',
      country: 'Brazil',
      riskRanking: 15,
      riskScore: 59.55,
      alerts: 0,
      selected: false
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Check if activeView query parameter is set to 'transaction-view'
    this.route.queryParams.subscribe(params => {
      if (params['activeView'] === 'transaction-view') {
        this.switchToTransactionView();
        this.setActiveTab('transaction-details');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.vendors.forEach(vendor => vendor.selected = isChecked);
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    // This method is called whenever selection changes to trigger popup visibility
    // The popup visibility is handled by the hasSelectedRecords() method in the template
  }

  hasSelectedRecords(): boolean {
    return this.vendors.some(vendor => vendor.selected);
  }

  getSelectedCount(): number {
    return this.vendors.filter(vendor => vendor.selected).length;
  }

  clearAllSelections(): void {
    this.vendors.forEach(vendor => vendor.selected = false);
    this.selectedTag = '';
  }

  applyTag(): void {
    if (!this.selectedTag) {
      return;
    }

    const selectedVendors = this.vendors.filter(vendor => vendor.selected);
    selectedVendors.forEach(vendor => {
      switch (this.selectedTag) {
        case 'prioritise':
          vendor.tag = 'Prioritise Review';
          vendor.tagClass = 'prioritise-review';
          break;
        case 'flag':
          vendor.tag = 'Flag for Review';
          vendor.tagClass = 'flag-review';
          break;
        case 'downgrade':
          vendor.tag = 'Downgrade';
          vendor.tagClass = 'downgrade';
          break;
      }
    });

    // Clear selections after applying tag
    this.clearAllSelections();
  }

  viewTransactionDetails(): void {
    const selectedVendors = this.vendors.filter(vendor => vendor.selected);
    console.log('View transaction details for:', selectedVendors);
    
    if (selectedVendors.length > 0) {
      // Switch to transaction details tab
      this.setActiveTab('transaction-details');
      // Close the popup by clearing all selections
      this.clearAllSelections();
    }
  }

  createNewAlert(): void {
    const selectedVendors = this.vendors.filter(vendor => vendor.selected);
    console.log('Create new alert for:', selectedVendors);
    
    if (selectedVendors.length > 0) {
      // Navigate to create alert screen with selected vendor data
      const vendorData = selectedVendors.map(vendor => ({
        vendorName: vendor.name,
        riskScore: vendor.riskScore,
        riskRanking: vendor.riskRanking,
        country: vendor.country,
        alerts: vendor.alerts,
        tag: vendor.tag
      }));
      
      this.router.navigate(['/createalert'], { 
        queryParams: { 
          data: JSON.stringify(vendorData),
          source: 'entity-profiling',
          count: selectedVendors.length
        }
      });
    } else {
      // If no vendors selected, navigate without data
      this.router.navigate(['/createalert']);
    }
  }

  setActiveTab(tab: 'entity-profiling' | 'transaction-details'): void {
    this.activeTab = tab;
    // Clear all selections and tag when switching tabs
    this.clearAllSelectionsFromBothTabs();
  }

  switchToEntityProfiling(): void {
    // Allow switching back to entity profiling from transaction details
    if (this.activeTab === 'transaction-details') {
      this.activeTab = 'entity-profiling';
      // Clear all selections when switching back
      this.clearAllSelectionsFromBothTabs();
    }
    // Do nothing if already on entity profiling (cannot switch to transaction details directly)
  }

  switchToTransactionDetails(): void {
    // This method is called when user navigates to transaction details from entity profiling
    // Currently this is disabled in the UI, but keeping the method for future use
    if (this.activeTab === 'entity-profiling') {
      this.activeTab = 'transaction-details';
      // Clear all selections when switching
      this.clearAllSelectionsFromBothTabs();
    }
  }

  switchToTransactionView(): void {
    this.activeView = 'transaction-view';
    this.clearAllSelectionsFromBothTabs();
  }

  switchToEntityView(): void {
    this.activeView = 'entity-view';
    this.clearAllSelectionsFromBothTabs();
  }


  toggleSelectAllTransactions(event: any): void {
    const isChecked = event.target.checked;
    this.transactions.forEach(t => (t.selected = isChecked));
    this.onTransactionSelectionChange();
  }

  toggleSelectAllTransactionView(event: any): void {
    const isChecked = event.target.checked;
    this.transactionViewData.forEach(t => (t.selected = isChecked));
    this.onTransactionViewSelectionChange();
  }

  onTransactionSelectionChange(): void {
    // This method is called whenever transaction selection changes to trigger popup visibility
    // The popup visibility is handled by the hasSelectedTransactions() method in the template
  }

  onTransactionViewSelectionChange(): void {
    // This method is called whenever transaction view selection changes to trigger popup visibility
    // The popup visibility is handled by the hasSelectedTransactionViewRecords() method in the template
  }

  hasSelectedTransactionViewRecords(): boolean {
    return this.transactionViewData.some(transaction => transaction.selected);
  }

  getSelectedTransactionViewCount(): number {
    return this.transactionViewData.filter(transaction => transaction.selected).length;
  }

  hasSelectedTransactions(): boolean {
    return this.transactions.some(transaction => transaction.selected);
  }

  getSelectedTransactionCount(): number {
    return this.transactions.filter(transaction => transaction.selected).length;
  }

  clearAllTransactionSelections(): void {
    this.transactions.forEach(transaction => transaction.selected = false);
    this.selectedTag = '';
  }

  clearAllTransactionViewSelections(): void {
    this.transactionViewData.forEach(transaction => transaction.selected = false);
  }

  getCloseSelectionMethod(): () => void {
    if (this.activeView === 'transaction-view') {
      return () => this.clearAllTransactionViewSelections();
    } else if (this.activeTab === 'entity-profiling') {
      return () => this.clearAllSelections();
    } else {
      return () => this.clearAllTransactionSelections();
    }
  }

  getSelectionPopupTitle(): string {
    if (this.activeView === 'transaction-view') {
      return 'Selected Transactions';
    } else if (this.activeTab === 'entity-profiling') {
      return 'Selected Entities';
    } else {
      return 'Selected Transactions';
    }
  }

  getSelectionPopupCount(): number {
    if (this.activeView === 'transaction-view') {
      return this.getSelectedTransactionViewCount();
    } else if (this.activeTab === 'entity-profiling') {
      return this.getSelectedCount();
    } else {
      return this.getSelectedTransactionCount();
    }
  }

  getCreateAlertMethod(): () => void {
    if (this.activeView === 'transaction-view') {
      return () => this.createNewAlertFromTransactionView();
    } else if (this.activeTab === 'entity-profiling') {
      return () => this.createNewAlert();
    } else {
      return () => this.createNewAlertFromTransactions();
    }
  }

  createNewAlertFromTransactionView(): void {
    const selectedTransactions = this.transactionViewData.filter(transaction => transaction.selected);
    console.log('Create new alert for transaction view:', selectedTransactions);
    
    if (selectedTransactions.length > 0) {
      // Navigate to create alert screen with selected transaction data
      const transactionData = selectedTransactions.map(transaction => ({
        systemInvoice: transaction.systemInvoice,
        vendorName: transaction.vendorName,
        invoiceType: transaction.invoiceType,
        invoiceDescription: transaction.invoiceDescription,
        tag: transaction.tag,
        alerts: transaction.alerts,
        hasOcr: transaction.hasOcr
      }));
      
      this.router.navigate(['/createalert'], { 
        queryParams: { 
          data: JSON.stringify(transactionData),
          source: 'transaction-view',
          count: selectedTransactions.length
        }
      });
    } else {
      // If no transactions selected, navigate without data
      this.router.navigate(['/createalert']);
    }
    
    this.clearAllTransactionViewSelections();
  }

  getApplyTagMethod(): () => void {
    if (this.activeView === 'transaction-view') {
      return () => this.applyTransactionViewTag();
    } else if (this.activeTab === 'entity-profiling') {
      return () => this.applyTag();
    } else {
      return () => this.applyTransactionTag();
    }
  }

  applyTransactionViewTag(): void {
    if (!this.selectedTag) {
      return;
    }

    const selectedTransactions = this.transactionViewData.filter(transaction => transaction.selected);
    selectedTransactions.forEach(transaction => {
      switch (this.selectedTag) {
        case 'prioritise':
          transaction.tag = 'Prioritise Review';
          transaction.tagClass = 'prioritise-review';
          break;
        case 'flag':
          transaction.tag = 'Flag for Review';
          transaction.tagClass = 'flag-review';
          break;
        case 'downgrade':
          transaction.tag = 'Downgrade';
          transaction.tagClass = 'downgrade';
          break;
      }
    });

    // Clear selections after applying tag
    this.clearAllTransactionViewSelections();
  }

  clearAllSelectionsFromBothTabs(): void {
    // Clear entity selections
    this.clearAllSelections();
    // Clear transaction selections
    this.clearAllTransactionSelections();
    // Clear transaction view selections
    this.clearAllTransactionViewSelections();
    // Clear selected tag
    this.selectedTag = '';
  }

  applyTransactionTag(): void {
    if (!this.selectedTag) {
      return;
    }

    const selectedTransactions = this.transactions.filter(transaction => transaction.selected);
    selectedTransactions.forEach(transaction => {
      switch (this.selectedTag) {
        case 'prioritise':
          transaction.tag = 'Prioritise Review';
          transaction.tagClass = 'prioritise-review';
          break;
        case 'flag':
          transaction.tag = 'Flag for Review';
          transaction.tagClass = 'flag-review';
          break;
        case 'downgrade':
          transaction.tag = 'Downgrade';
          transaction.tagClass = 'downgrade';
          break;
      }
    });

    // Clear selections after applying tag
    this.clearAllTransactionSelections();
  }

  viewTransactionDetailsFromSelection(): void {
    const selectedTransactions = this.transactions.filter(transaction => transaction.selected);
    console.log('View transaction details for:', selectedTransactions);
    // Already on transaction details view, just close popup
    this.clearAllTransactionSelections();
  }

  createNewAlertFromTransactions(): void {
    const selectedTransactions = this.transactions.filter(transaction => transaction.selected);
    console.log('Create new alert for transactions:', selectedTransactions);
    
    if (selectedTransactions.length > 0) {
      // Navigate to create alert screen with selected transaction data
      const transactionData = selectedTransactions.map(transaction => ({
        systemInvoice: transaction.systemInvoice,
        vendorName: transaction.vendorName,
        invoiceType: transaction.invoiceType,
        invoiceDescription: transaction.invoiceDescription,
        tag: transaction.tag,
        alerts: transaction.alerts,
        hasOcr: transaction.hasOcr
      }));
      
      this.router.navigate(['/createalert'], { 
        queryParams: { 
          data: JSON.stringify(transactionData),
          source: 'transaction-details',
          count: selectedTransactions.length
        }
      });
    } else {
      // If no transactions selected, navigate without data
      this.router.navigate(['/createalert']);
    }
  }

  showActionMenu(event: MouseEvent, rowIndex: number): void {
    event.stopPropagation();
    
    // Calculate popup position relative to clicked button
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    this.actionPopupPosition = {
      top: buttonRect.bottom + scrollTop + 5,
      left: buttonRect.left + scrollLeft - 180 // Adjust to align popup to the right of button
    };
    
    this.selectedRowIndex = rowIndex;
    this.showActionPopup = true;
  }

  hideActionMenu(): void {
    this.showActionPopup = false;
    this.selectedRowIndex = -1;
  }

  onChangeTag(rowIndex: number): void {
    console.log('Change tag for row:', rowIndex);
    
    // Close the action menu popup first
    this.hideActionMenu();
    
    // Reset selected tag option to show all radio buttons as unchecked
    this.selectedTagOption = '';
    
    // Show the change tag popup
    this.showChangeTagPopup = true;
  }

  private getTagOptionValue(tag?: string): string {
    switch (tag) {
      case 'Prioritise Review':
        return 'prioritise';
      case 'Flag for Review':
        return 'flag';
      case 'Downgrade':
        return 'downgrade';
      default:
        return 'none';
    }
  }

  onViewAlerts(rowIndex: number): void {
    console.log('View alerts for row:', rowIndex);
    
    // Get the data for the selected row
    let rowData: any = {};
    if (this.activeTab === 'entity-profiling' && this.vendors[rowIndex]) {
      const vendor = this.vendors[rowIndex];
      rowData = {
        type: 'vendor',
        vendorName: vendor.name,
        riskScore: vendor.riskScore,
        riskRanking: vendor.riskRanking,
        country: vendor.country,
        alerts: vendor.alerts,
        tag: vendor.tag
      };
    } else if (this.activeTab === 'transaction-details' && this.transactions[rowIndex]) {
      const transaction = this.transactions[rowIndex];
      rowData = {
        type: 'transaction',
        systemInvoice: transaction.systemInvoice,
        vendorName: transaction.vendorName,
        invoiceType: transaction.invoiceType,
        invoiceDescription: transaction.invoiceDescription,
        tag: transaction.tag,
        alerts: transaction.alerts,
        hasOcr: transaction.hasOcr
      };
    }
    
    // Navigate to alerts screen with row data
    this.router.navigate(['/alert'], { 
      queryParams: { 
        data: JSON.stringify(rowData),
        source: this.activeTab,
        rowIndex: rowIndex
      }
    });
    
    this.hideActionMenu();
  }

  onCreateAlert(rowIndex: number): void {
    console.log('Create alert for row:', rowIndex);
    
    // Get the selected transaction data
    let transactionData: any = {};
    if (this.activeTab === 'entity-profiling' && this.vendors[rowIndex]) {
      const vendor = this.vendors[rowIndex];
      transactionData = {
        vendorName: vendor.name,
        riskScore: vendor.riskScore,
        riskRanking: vendor.riskRanking,
        country: vendor.country,
        alerts: vendor.alerts
      };
    } else if (this.activeTab === 'transaction-details' && this.transactions[rowIndex]) {
      const transaction = this.transactions[rowIndex];
      transactionData = {
        systemInvoice: transaction.systemInvoice,
        vendorName: transaction.vendorName,
        invoiceType: transaction.invoiceType,
        invoiceDescription: transaction.invoiceDescription,
        tag: transaction.tag,
        alerts: transaction.alerts,
        hasOcr: transaction.hasOcr
      };
    }
    
    // Navigate to create alert screen with transaction data
    this.router.navigate(['/createalert'], { 
      queryParams: { 
        data: JSON.stringify(transactionData),
        source: this.activeTab,
        rowIndex: rowIndex
      }
    });
    
    this.hideActionMenu();
  }

  closeChangeTagPopup(): void {
    this.showChangeTagPopup = false;
    this.selectedTagOption = '';
  }

  saveTagChange(): void {
    if (this.selectedRowIndex === -1 || !this.selectedTagOption) {
      return;
    }

    // Apply the tag change to the selected row
    if (this.activeTab === 'entity-profiling' && this.vendors[this.selectedRowIndex]) {
      this.applyTagToVendor(this.selectedRowIndex, this.selectedTagOption);
    } else if (this.activeTab === 'transaction-details' && this.transactions[this.selectedRowIndex]) {
      this.applyTagToTransaction(this.selectedRowIndex, this.selectedTagOption);
    }

    // Close the popup
    this.closeChangeTagPopup();
    console.log(`Tag changed to: ${this.selectedTagOption} for row: ${this.selectedRowIndex}`);
  }

  private applyTagToVendor(rowIndex: number, tagOption: string): void {
    const vendor = this.vendors[rowIndex];
    switch (tagOption) {
      case 'prioritise':
        vendor.tag = 'Prioritise Review';
        vendor.tagClass = 'prioritise-review';
        break;
      case 'flag':
        vendor.tag = 'Flag for Review';
        vendor.tagClass = 'flag-review';
        break;
      case 'downgrade':
        vendor.tag = 'Downgrade';
        vendor.tagClass = 'downgrade';
        break;
      case 'none':
        vendor.tag = undefined;
        vendor.tagClass = undefined;
        break;
    }
  }

  private applyTagToTransaction(rowIndex: number, tagOption: string): void {
    const transaction = this.transactions[rowIndex];
    switch (tagOption) {
      case 'prioritise':
        transaction.tag = 'Prioritise Review';
        transaction.tagClass = 'prioritise-review';
        break;
      case 'flag':
        transaction.tag = 'Flag for Review';
        transaction.tagClass = 'flag-review';
        break;
      case 'downgrade':
        transaction.tag = 'Downgrade';
        transaction.tagClass = 'downgrade';
        break;
      case 'none':
        transaction.tag = undefined;
        transaction.tagClass = undefined;
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showActionPopup) {
      this.hideActionMenu();
    }
  }

  navigateToScenarioManager(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectid')) || 1;
    this.router.navigate(['/ProjectWorkflow', projectId], { 
      queryParams: { pfTab: 'insights', activeTab: 'scenario-manager' } 
    });
  }

  navigateToSimilarTransactions(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectid')) || 1;
    this.router.navigate(['/ProjectWorkflow', projectId], {
      queryParams: { pfTab: 'insights', activeTab: 'similar-transactions' }
    });
  }

  navigateToVisualizations(): void {
    // Default to a sample project id if present in route context; fall back to 1
    const projectId = Number(this.route.snapshot.paramMap.get('projectid')) || 1;
    // Step 1: Go to Project Workflow with Insights tab requested
    // Step 2: Inside Insights, ensure the Visualizations tab is active via query param
    this.router.navigate(['/ProjectWorkflow', projectId], {
      queryParams: { pfTab: 'insights', activeTab: 'overview' }
    });
  }
}
