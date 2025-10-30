
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

interface Test {
  id: string;
  description: string;
  tested: number;
  failed: number;
  isExpanded: boolean;
  category: string;
  lastRun: string;
  records: Record[];
}

interface Record {
  vendorId: string;
  vendorName: string;
  invoiceDescription: string;
  physicalInvoice: string;
  systemInvoice: string;
  postingDate: string;
  currency: string;
  amount: number;
}

interface DetailRecord {
  group: number;
  vendorId: string;
  vendorName: string;
  invoiceDescription: string;
  physicalInvoice: string;
  systemInvoice: string;
  postingDate: string;
  currency: string;
}

interface Column {
  key: string;
  label: string;
  visible: boolean;
  pinned: boolean;
}

@Component({
  selector: 'app-insight-duplicatecheck',
   standalone: true,
  imports: [CommonModule,FormsModule,DecimalPipe], 
  templateUrl: './insight-duplicatecheck.component.html',
  styleUrls: ['./insight-duplicatecheck.component.scss']
})
export class InsightDuplicatecheckComponent implements OnInit {
  tests: Test[] = [
    {
      id: 'P2PCIPY111',
      description: 'Payments made to different vendors using the same phone number',
      tested: 122327,
      failed: 2069,
      isExpanded: false,
      category: 'Conflict of Interest',
      lastRun: '2024-01-15',
      records: [
        {
          vendorId: '0001003812',
          vendorName: 'MOBIL PNG GAS HOLDINGS PTY L...',
          invoiceDescription: 'Apr 21 Op Site Maintenance',
          physicalInvoice: '65000062204',
          systemInvoice: '65000062204',
          postingDate: '14-11-2023',
          currency: 'GBP',
          amount: 2407700
        },
        {
          vendorId: '0000003640',
          vendorName: 'Gerlach LLC',
          invoiceDescription: 'Field Operations',
          physicalInvoice: '65000062835',
          systemInvoice: '65000062835',
          postingDate: '18-01-2023',
          currency: 'NOK',
          amount: 2461910
        },
        {
          vendorId: '0040070379',
          vendorName: 'Emmerich and Sons',
          invoiceDescription: 'Equipment Rental Monthly',
          physicalInvoice: '65000062886',
          systemInvoice: '65000062886',
          postingDate: '22-05-2023',
          currency: 'EUR',
          amount: 2473647
        },
        {
          vendorId: '0040019213',
          vendorName: 'Hammes, Leannon and Goldner Cus...',
          invoiceDescription: 'Logistics Support',
          physicalInvoice: '65000062833',
          systemInvoice: '65000062833',
          postingDate: '05-11-2023',
          currency: 'EUR',
          amount: 2745820
        },
        {
          vendorId: '0040032677',
          vendorName: 'Goldner, Cummerate and Rempel C...',
          invoiceDescription: 'Equipment Rental Monthly',
          physicalInvoice: '65000062078',
          systemInvoice: '65000062078',
          postingDate: '02-04-2023',
          currency: 'USD',
          amount: 2398930
        }
      ]
    },
    {
      id: 'P2PCIPY112',
      description: 'Payments made to different vendors using the same bank account',
      tested: 122327,
      failed: 780,
      isExpanded: false,
      category: 'Conflict of Interest',
      lastRun: '2024-01-15',
      records: []
    },
    {
      id: 'P2PCIPY115',
      description: 'Payments made to different vendors using the same address',
      tested: 122327,
      failed: 10,
      isExpanded: false,
      category: 'Conflict of Interest',
      lastRun: '2024-01-15',
      records: []
    },
    {
      id: 'P2PCIPY116',
      description: 'Vendors registered with personal email domains (e.g., Gmail, Yahoo, etc.)',
      tested: 122327,
      failed: 23670,
      isExpanded: false,
      category: 'Conflict of Interest',
      lastRun: '2024-01-15',
      records: []
    },
    {
      id: 'P2PCIPY141',
      description: 'Payments made to vendors where the phone number matches an employee\'s',
      tested: 122327,
      failed: 263,
      isExpanded: false,
      category: 'Conflict of Interest',
      lastRun: '2024-01-15',
      records: []
    }
  ];

  detailRecords: DetailRecord[] = [
    { group: 1, vendorId: '0001003812', vendorName: 'MOBIL PNG GAS HOLDINGS PTY L...', invoiceDescription: 'Apr 21 Op Site Maintenance', physicalInvoice: 'INV-65000061300', systemInvoice: 'SYS-65000061304', postingDate: '14-11-2023', currency: 'NOK' },
    { group: 1, vendorId: '0000003640', vendorName: 'Gerlach LLC', invoiceDescription: 'Field Operations', physicalInvoice: 'INV-65000061301', systemInvoice: 'SYS-65000061304', postingDate: '18-01-2023', currency: 'NOK' },
    { group: 1, vendorId: '0040070379', vendorName: 'Emmerich and Sons', invoiceDescription: 'Equipment Rental Monthly', physicalInvoice: 'INV-65000061302', systemInvoice: 'SYS-65000061304', postingDate: '22-05-2023', currency: 'NOK' },
    { group: 2, vendorId: '0040019213', vendorName: 'Hammes, Leannon and...', invoiceDescription: 'Logistics Support', physicalInvoice: 'INV-65000061303', systemInvoice: 'SYS-65000061305', postingDate: '05-11-2023', currency: 'NOK' },
    { group: 2, vendorId: '0040032677', vendorName: 'Goldner, Cummerate an...', invoiceDescription: 'Professional Services', physicalInvoice: 'INV-65000061304', systemInvoice: 'SYS-65000061307', postingDate: '02-04-2023', currency: 'EUR' },
    { group: 3, vendorId: '0040049955', vendorName: 'Harber Group', invoiceDescription: 'Maintenance Contract', physicalInvoice: 'INV-65000061305', systemInvoice: 'SYS-65000061311', postingDate: '14-11-2023', currency: 'USD' },
    { group: 3, vendorId: '0040060477', vendorName: 'Dach, Pollich and Kozey...', invoiceDescription: 'Logistics Support', physicalInvoice: 'INV-65000061306', systemInvoice: 'SYS-65000061309', postingDate: '18-01-2023', currency: 'EUR' },
    { group: 3, vendorId: '0040074551', vendorName: 'O\'Connell-Lind ANPG C...', invoiceDescription: 'Technical Consulting', physicalInvoice: 'INV-65000061307', systemInvoice: 'SYS-65000061309', postingDate: '22-05-2023', currency: 'EUR' },
    { group: 3, vendorId: '0040034463', vendorName: 'Lakin-Emser Custom...', invoiceDescription: 'Apr 21 Op Site Maintenance', physicalInvoice: 'INV-65000061308', systemInvoice: 'SYS-65000061311', postingDate: '05-11-2023', currency: 'USD' },
    { group: 3, vendorId: '0040038637', vendorName: 'Schimmel-Reilly Custom...', invoiceDescription: 'Drilling Services Q1', physicalInvoice: 'INV-65000061309', systemInvoice: 'SYS-65000061312', postingDate: '02-04-2023', currency: 'USD' },
    { group: 3, vendorId: '0040012843', vendorName: 'Schiller-Volkman Custom...', invoiceDescription: 'Professional Services', physicalInvoice: 'INV-65000061310', systemInvoice: 'SYS-65000061318', postingDate: '14-11-2023', currency: 'USD' },
    { group: 3, vendorId: '0040042657', vendorName: 'Lind-Grembiebe...', invoiceDescription: 'Equipment Rental Monthly', physicalInvoice: 'INV-65000061311', systemInvoice: 'SYS-65000061313', postingDate: '18-01-2023', currency: 'GDP' },
    { group: 3, vendorId: '0040020347', vendorName: 'ENERGY IMPORT BANK...', invoiceDescription: 'Maintenance Contract', physicalInvoice: 'INV-65000061312', systemInvoice: 'SYS-65000061316', postingDate: '22-05-2023', currency: 'GDP' },
    { group: 3, vendorId: '0040046521', vendorName: 'Lubowitz, Little and Moo...', invoiceDescription: 'Logistics Support', physicalInvoice: 'INV-65000061313', systemInvoice: 'SYS-65000061314', postingDate: '05-11-2023', currency: 'USD' }
  ];

  showDetailView: boolean = false;
  selectedTest: Test | null = null;
  showColumnModal: boolean = false;
  columnSearchTerm: string = '';
  
  columns: Column[] = [
    { key: 'groups', label: 'Groups', visible: true, pinned: false },
    { key: 'vendorId', label: 'Vendor ID', visible: true, pinned: false },
    { key: 'vendorName', label: 'Vendor Name', visible: true, pinned: false },
    { key: 'invoiceDescription', label: 'Invoice Description', visible: true, pinned: false },
    { key: 'glDescription', label: 'GL Description', visible: false, pinned: false },
    { key: 'physicalInvoice', label: 'Physical Invoice', visible: true, pinned: true },
    { key: 'systemInvoice', label: 'System Invoice', visible: true, pinned: false },
    { key: 'postingDate', label: 'Posting Date', visible: true, pinned: false },
    { key: 'currency', label: 'Currency', visible: true, pinned: false },
    { key: 'amount', label: 'Amount', visible: true, pinned: false }
  ];

  filteredColumns: Column[] = [];

  ngOnInit(): void {
    this.filteredColumns = [...this.columns];
  }

  toggleExpansion(testId: string): void {
    this.tests = this.tests.map(test => 
      test.id === testId 
        ? { ...test, isExpanded: !test.isExpanded }
        : test
    );
  }

  handleViewAllDetails(test: Test): void {
    this.selectedTest = test;
    this.showDetailView = true;
  }

  handleBackToList(): void {
    this.showDetailView = false;
    this.selectedTest = null;
    this.showColumnModal = false;
  }

  toggleColumnDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnModal = !this.showColumnModal;
  }

  closeColumnDropdown(event: Event): void {
    event.stopPropagation();
    this.showColumnModal = false;
  }

  toggleColumnVisibility(columnKey: string): void {
    this.columns = this.columns.map(col => 
      col.key === columnKey 
        ? { ...col, visible: !col.visible }
        : col
    );
  }

  toggleColumnPin(columnKey: string): void {
    this.columns = this.columns.map(col => 
      col.key === columnKey 
        ? { ...col, pinned: !col.pinned }
        : col
    );
  }

  showAllColumns(): void {
    this.columnSearchTerm = '';
    this.filterColumns();
  }

  filterColumns(): void {
    this.filteredColumns = this.columns.filter(col => 
      col.label.toLowerCase().includes(this.columnSearchTerm.toLowerCase())
    );
  }
}