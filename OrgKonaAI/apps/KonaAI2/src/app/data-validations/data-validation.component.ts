// data-import.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VmDetailsComponent } from '../vm-details/vm-details.component';

interface tableDatas {
  XBLNR: string;
  MANDT: string;
  BUKRS: string;
  Status: string;
}

@Component({
  selector: 'app-data-validations',
  standalone: true,
  imports: [CommonModule, FormsModule, VmDetailsComponent],
  templateUrl: './data-validation.component.html',
  styleUrls: ['./data-validation.component.scss']
})
export class DataValidationComponent implements OnInit {
  successCount = 5;
  errorCount = 0;
  warningCount = 1;
  tableData: any[] = [];
  searchText = '';
  rowId = '';

  records = [
    { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Failed', selected: false },
    { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Passed', selected: false },
  ];

  paymentData = [
    { dccId: 'VM-001', description: 'Vendors in master (LFA1) not in company codes (LFB1)', hitCount: 126216, totalCount: 11462346, hitPercentage: 31.98, status: 'Failed' },
    { dccId: 'VM-002', description: 'Vendors in company codes (LFB1) not in master (LFA1)', hitCount: 1, totalCount: 417491, hitPercentage: 0, status: 'Failed' }
    , { dccId: 'VM-003', description: 'Vendors in master (LFA1) not in company codes (LFB1)', hitCount: 126216, totalCount: 11462346, hitPercentage: 31.98, status: 'Passed' },
    { dccId: 'VM-004', description: 'Vendors in company codes (LFB1) not in master (LFA1)', hitCount: 1, totalCount: 417491, hitPercentage: 0, status: 'Failed' }
    , { dccId: 'VM-005', description: 'Vendors in master (LFA1) not in company codes (LFB1)', hitCount: 126216, totalCount: 11462346, hitPercentage: 31.98, status: 'Passed' },
    { dccId: 'VM-006', description: 'Vendors in company codes (LFB1) not in master (LFA1)', hitCount: 1, totalCount: 417491, hitPercentage: 0, status: 'Passed' }
  ];

  showPaymentsPopup = false;
  selectedRow: any;
  showPaymentsScreen = false;
  activeTab = 'open';
  isSidebarPinned: boolean = false;
  sub: Subscription;
  tableDatas: tableDatas[] = [];
  showPaymentsDetailsScreen: boolean = false;
  constructor(private route: Router, private authService: AuthService, private dialog: MatDialog) {
    this.sub = this.authService.sidebarValue$.subscribe(val => {
      this.isSidebarPinned = val;
    });
    console.log('dat-Validation screen')
  }

  updateSelection() { }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.records.forEach(r => r.selected = checked);
  }

  isAllSelected() {
    return this.records.length > 0 && this.records.every(r => r.selected);
  }

  reExtract() {
    console.log('Re-Extracting:', this.selectedRecords);
  }

  get selectedRecords() {
    return this.records.filter(r => r.selected);
  }

  ngOnInit(): void {
    this.sub = this.authService.sidebarValue$.subscribe(val => {
      this.isSidebarPinned = val;
    });
    this.tableDatas = [
      { XBLNR: 'SC2025001', MANDT: '100', BUKRS: 'SC01', Status: 'Success' },
      { XBLNR: 'SC2025002', MANDT: '200', BUKRS: 'SC02', Status: 'Error' },
      { XBLNR: 'SC2025003', MANDT: '300', BUKRS: 'SC03', Status: 'Warning' },
      { XBLNR: 'SC2025004', MANDT: '400', BUKRS: 'SC04', Status: 'Pending' },
      { XBLNR: 'SC2025005', MANDT: '500', BUKRS: 'SC05', Status: 'Success' },
    ];
    this.tableData = [
      { Submodule: 'Invoices', RecordCount: '1250', status: 'In-Progress' },
      { Submodule: 'Payments', RecordCount: '1450', status: 'In-Progress' },
      { Submodule: 'Purchase Order', RecordCount: '2,505', status: 'In-Progress' }
    ];

    setTimeout(() => {
      this.tableData = [
        { Submodule: 'Invoices', RecordCount: '1250', status: 'Failed' },
        { Submodule: 'Payments', RecordCount: '1450', status: 'Failed' },
        { Submodule: 'Purchase Order', RecordCount: '2,505', status: 'Completed' }
      ];
    }, 5000);

  }
  
  get filteredPayments() {
    if (!this.searchText) return this.paymentData;
    const search = this.searchText.toLowerCase();
    return this.paymentData.filter(
      r =>
        r.dccId.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search)
    );
  }
  onRowClick(e: any) {

  }

  openFullScreenPayments(row: any) {
    this.showPaymentsScreen = true;
    this.showPaymentsDetailsScreen = false;
  }

  openFullScreenPaymentsDetails(row: any) {
    this.showPaymentsScreen = false;
    this.showPaymentsDetailsScreen = true;
    this.rowId = row.dccId;
  }

  closeFullScreen() {
    this.showPaymentsScreen = false;
    this.showPaymentsDetailsScreen = false;
  }
  openPaymentsModal(row: any) {
    const modalEl = document.getElementById('paymentsModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  handleChildEvent(e: any) {
    this.showPaymentsScreen = true;
    this.showPaymentsDetailsScreen = false;
  }
  onDownload(row: any) {
    console.log('Download clicked', row);
  }
}