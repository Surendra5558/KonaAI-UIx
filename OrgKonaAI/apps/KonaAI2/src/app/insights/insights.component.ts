
// insights.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';
import { ChoroplethController, ProjectionScale } from 'chartjs-chart-geo';
import { feature } from 'topojson-client';
import { InsightsOverviewComponent } from '../../insights-overview/insights-overview.component';
import { InsightDuplicatecheckComponent } from '../insight-duplicatecheck/insight-duplicatecheck.component';
import { InsightsTextAnalysisComponent } from '../../insights-text-analysis/insights-text-analysis.component';
import { InsightsTransactionMetricsComponent } from '../../insights-transaction-metrics/insights-transaction-metrics.component';
import { InsightsKnowYourVendorComponent } from '../../insights-know-your-vendor/insights-know-your-vendor.component';
import { ScenarioManagerComponent } from '../scenario-manager/scenario-manager.component';
import { SimilarTransactionsComponent } from '../similar-transactions/similar-transactions.component';


import { UnderlyingDetailsComponent } from '../insights-visualisations/underlying-details/underlying-details.component';
import { VisualizationComponent } from "./visualization/visualization.component";

// Unified Pagination Interface
interface PaginationData {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  visiblePages: (number | string)[];
  itemsPerPageOptions: number[];
  onPageChange: (page: number | string) => void;
  onItemsPerPageChange: () => void;
}
Chart.register(ChoroplethController, ProjectionScale);

Chart.register(...registerables);

interface VendorData {
  id: string;
  name: string;
  totalAmount: number;
  flaggedAmount: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface InvoiceStats {
  total: number;
  flagged: number;
  percentage: number;
}

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
  postingDate?: string;
  glAccountDescription?: string;
  physicalInvoice?: string;
  tag?: string;
  tagClass?: string;
  alerts: number;
  hasOcr: boolean;
  selected: boolean;
}

interface Scenario {
  id: number;
  scenarioName: string;
  createdBy: string;
  triggerType: string;
  lastExecutedOn: string;
  alerts: number;
  isActive: boolean;
}

interface TestDetail {
  testName: string;
  parameter: string;
  columnId: string;
  condition: string;
  value: string;
}

// Similar Transactions interfaces
interface SimilarTransaction {
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

interface SimilarTransactionGroup {
  id: string;
  name: string;
  transactions: SimilarTransaction[];
  expanded: boolean;
}

interface SimilarTransactionFilterOption {
  value: string;
  label: string;
}

interface SimilarTransactionColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScenarioManagerComponent, VisualizationComponent],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart', { static: false }) barChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('geoChart', { static: false }) geoChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild(VisualizationComponent, { static: false }) visualizationComponent!: VisualizationComponent;
  @Output() filterApplied = new EventEmitter<string[]>();


  // View toggles
  leftChartView: 'chart' | 'table' = 'chart';
  rightChartView: 'chart' | 'table' = 'chart';
  vendorView: 'chart' | 'table' = 'table';

  // Chart instances
  private barChartInstance: Chart | null = null;
  private geoChartInstance: Chart | null = null;
  private pieChartInstance: Chart | null = null;


  isVisualizationOpen = true;
  selectedCurrency = 'USD';
  reportingCurrency = 'USD';

  // Visualization sidebar properties
  visualizationPages: any[] = [];
  activeVisualizationPage: any = null;

  // Sample data for the main charts
  invoiceData = [
    { year: 2010, totalAmount: 420000000, flaggedAmount: -850000000, yoyChange: 'N/A' },
    { year: 2012, totalAmount: 720000000, flaggedAmount: 480000000, yoyChange: '+71.4%' },
    { year: 2014, totalAmount: 950000000, flaggedAmount: 820000000, yoyChange: '+31.9%' },
    { year: 2016, totalAmount: -650000000, flaggedAmount: 20000000, yoyChange: '-168.4%' },
    { year: 2018, totalAmount: -850000000, flaggedAmount: 120000000, yoyChange: '+30.8%' }
  ];

  // Dashboard stats
  overdue: InvoiceStats = { total: 792, flagged: 0, percentage: 0 };
  invoiceFlagged: InvoiceStats = { total: 121, flagged: 80, percentage: 66.1 };
  invLinesFlagged: InvoiceStats = { total: 122, flagged: 33, percentage: 27.0 };
  invAmtFlagged: InvoiceStats = { total: 615, flagged: 498, percentage: 80.97 };

  // Additional stats
  totalVendors = 1752;
  flaggedVendors = 1341;
  totalInvoices = 121800;
  flaggedInvoices = 65210;
  totalInvLines = 122330;
  flaggedInvLines = 66070;

  // Vendor risk data
  vendorRiskData: VendorData[] = [
    { id: '0000001816', name: 'MOBIL FUEL CAIL', totalAmount: 8447700, flaggedAmount: 7050000, riskLevel: 'High' },
    { id: '0000008640', name: 'Certrim LLC', totalAmount: 2441700, flaggedAmount: 2341550, riskLevel: 'High' },
    { id: '0740003799', name: 'Emmerton and B...', totalAmount: 6473644, flaggedAmount: 2005200, riskLevel: 'High' },
    { id: '0000078511', name: 'Fairmont, Laure...', totalAmount: 2743820, flaggedAmount: 1831500, riskLevel: 'Medium' },
    { id: '0000238677', name: 'Goldstar, Cumm...', totalAmount: 4388940, flaggedAmount: 1479800, riskLevel: 'Medium' },
    { id: '0000048479', name: 'Lens Queensbake', totalAmount: 1785000, flaggedAmount: 1344500, riskLevel: 'High' },
    { id: '0000018327', name: 'Shirmoot Realty...', totalAmount: 1556120, flaggedAmount: 1102470, riskLevel: 'Medium' },
    { id: '0000024386', name: 'Grady LLC', totalAmount: 1394200, flaggedAmount: 1074350, riskLevel: 'High' }
  ];

  geoData = [
    { region: 'North America', riskScore: 8.5, color: 'high' },
    { region: 'Europe', riskScore: 6.2, color: 'medium' },
    { region: 'Asia Pacific', riskScore: 4.8, color: 'low' },
    { region: 'Latin America', riskScore: 7.1, color: 'medium' },
    { region: 'Middle East', riskScore: 9.2, color: 'high' },
    { region: 'Africa', riskScore: 3.9, color: 'low' }
  ];
  //states = ["Active", "Resolved", "Closed", "Pending", "Acknowledged", "Suppressed", "Unknown"];
  selected: Set<string> = new Set();

  // Entity and Transaction data
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

  transactionViewData: TransactionDetail[] = [
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

  // Scenario Manager data and properties
  scenarios: Scenario[] = [
    {
      id: 1,
      scenarioName: 'Duplicate Business Check',
      createdBy: 'Manual - Johnson',
      triggerType: 'Automatic',
      lastExecutedOn: '16 Jun 2021, 5:15 PM',
      alerts: 1,
      isActive: true
    },
    {
      id: 2,
      scenarioName: 'Weekend Transactions',
      createdBy: 'Jane Smith',
      triggerType: 'Manual',
      lastExecutedOn: '16 Jul 2021, 5:50 PM',
      alerts: 3,
      isActive: true
    },
    {
      id: 3,
      scenarioName: 'Frequent Employee Claims',
      createdBy: 'Jane Smith',
      triggerType: 'Manual',
      lastExecutedOn: '',
      alerts: 4,
      isActive: false
    },
    {
      id: 4,
      scenarioName: 'Refund Private Vendor',
      createdBy: 'Jane Smith',
      triggerType: 'Automatic',
      lastExecutedOn: '12 Apr 2021, 3:42 PM',
      alerts: 1,
      isActive: true
    }
  ];

  filteredScenarios: Scenario[] = [];
  scenarioSearchTerm: string = '';
  
  // Scenario Manager Modal states
  showDeleteModal: boolean = false;
  showPreviewModal: boolean = false;
  showTriggerModal: boolean = false;
  showEditModal: boolean = false;
  
  selectedScenario: Scenario | null = null;
  
  // Preview modal data
  previewData = {
    scenarioName: 'Weekend Transactions',
    dataDetails: {
      database: 'Invoice Amount',
      operations: 'greater than',
      value: '₹1,50,000'
    },
    testDetails: [
      {
        testName: 'PAYTHRESH1-Payment clearance on same date of Physical Deposit',
        parameter: 'Invoice Amount',
        columnId: 'AmtDCB',
        condition: '',
        value: '30'
      },
      {
        testName: 'PAYTHRESH1-Payment clearance on same date of Physical Deposit',
        parameter: 'Invoice Amount',
        columnId: 'AmtDCB',
        condition: '',
        value: '30'
      }
    ]
  };

  // Similar Transactions data and properties
  similarTransactionGroups: SimilarTransactionGroup[] = [
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
        {
          id: '7',
          vendorNumber: '2000093136',
          vendorName: 'Sample Vendor 1',
          systemInvoiceNo: 'SYS-65000061350',
          systemInvoiceLineNo: 'SAMPLE LINE 1',
          physicalInvoiceNo: 'INV-65000061350',
          tag: 'Flag for Review',
          alerts: 2,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2234'
        }
      ]
    },
    {
      id: 'group-2235',
      name: 'Group-2235',
      expanded: false,
      transactions: [
        {
          id: '8',
          vendorNumber: '2000093137',
          vendorName: 'Sample Vendor 2',
          systemInvoiceNo: 'SYS-65000061351',
          systemInvoiceLineNo: 'SAMPLE LINE 2',
          physicalInvoiceNo: 'INV-65000061351',
          tag: 'Prioritise Review',
          alerts: 1,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2235'
        }
      ]
    },
    {
      id: 'group-2236',
      name: 'Group-2236',
      expanded: false,
      transactions: [
        {
          id: '9',
          vendorNumber: '2000093138',
          vendorName: 'Sample Vendor 3',
          systemInvoiceNo: 'SYS-65000061352',
          systemInvoiceLineNo: 'SAMPLE LINE 3',
          physicalInvoiceNo: 'INV-65000061352',
          alerts: 0,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2236'
        }
      ]
    },
    {
      id: 'group-2237',
      name: 'Group-2237',
      expanded: false,
      transactions: [
        {
          id: '10',
          vendorNumber: '2000093139',
          vendorName: 'Sample Vendor 4',
          systemInvoiceNo: 'SYS-65000061353',
          systemInvoiceLineNo: 'SAMPLE LINE 4',
          physicalInvoiceNo: 'INV-65000061353',
          tag: 'Downgrade',
          alerts: 3,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2237'
        }
      ]
    },
    {
      id: 'group-2238',
      name: 'Group-2238',
      expanded: false,
      transactions: [
        {
          id: '11',
          vendorNumber: '2000093140',
          vendorName: 'Sample Vendor 5',
          systemInvoiceNo: 'SYS-65000061354',
          systemInvoiceLineNo: 'SAMPLE LINE 5',
          physicalInvoiceNo: 'INV-65000061354',
          tag: 'Flag for Review',
          alerts: 1,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2238'
        }
      ]
    },
    {
      id: 'group-2239',
      name: 'Group-2239',
      expanded: false,
      transactions: [
        {
          id: '12',
          vendorNumber: '2000093141',
          vendorName: 'Sample Vendor 6',
          systemInvoiceNo: 'SYS-65000061355',
          systemInvoiceLineNo: 'SAMPLE LINE 6',
          physicalInvoiceNo: 'INV-65000061355',
          alerts: 2,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2239'
        }
      ]
    },
    {
      id: 'group-2240',
      name: 'Group-2240',
      expanded: false,
      transactions: [
        {
          id: '13',
          vendorNumber: '2000093142',
          vendorName: 'Sample Vendor 7',
          systemInvoiceNo: 'SYS-65000061356',
          systemInvoiceLineNo: 'SAMPLE LINE 7',
          physicalInvoiceNo: 'INV-65000061356',
          tag: 'Prioritise Review',
          alerts: 4,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2240'
        }
      ]
    },
    {
      id: 'group-2241',
      name: 'Group-2241',
      expanded: false,
      transactions: [
        {
          id: '14',
          vendorNumber: '2000093143',
          vendorName: 'Sample Vendor 8',
          systemInvoiceNo: 'SYS-65000061357',
          systemInvoiceLineNo: 'SAMPLE LINE 8',
          physicalInvoiceNo: 'INV-65000061357',
          alerts: 0,
          hasOcr: false,
          hasExternalLink: true,
          selected: false,
          groupId: 'group-2241'
        }
      ]
    },
    {
      id: 'group-2242',
      name: 'Group-2242',
      expanded: false,
      transactions: [
        {
          id: '15',
          vendorNumber: '2000093144',
          vendorName: 'Sample Vendor 9',
          systemInvoiceNo: 'SYS-65000061358',
          systemInvoiceLineNo: 'SAMPLE LINE 9',
          physicalInvoiceNo: 'INV-65000061358',
          tag: 'Downgrade',
          alerts: 1,
          hasOcr: true,
          hasExternalLink: false,
          selected: false,
          groupId: 'group-2242'
        }
      ]
    }
  ];

  // Similar Transactions filter options
  similarTransactionRiskCategories: SimilarTransactionFilterOption[] = [
    { value: 'high', label: 'High Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'low', label: 'Low Risk' }
  ];

  similarTransactionTests: SimilarTransactionFilterOption[] = [
    { value: 'duplicate', label: 'Duplicate Detection' },
    { value: 'anomaly', label: 'Anomaly Detection' },
    { value: 'compliance', label: 'Compliance Check' }
  ];

  // Similar Transactions column configuration
  similarTransactionAvailableColumns: SimilarTransactionColumnConfig[] = [
    { key: 'vendorNumber', label: 'Vendor Number', visible: true, sortable: true },
    { key: 'vendorName', label: 'Vendor Name', visible: true, sortable: true },
    { key: 'systemInvoiceNo', label: 'System Invoice No', visible: true, sortable: true },
    { key: 'systemInvoiceLineNo', label: 'System Invoice Line No', visible: true, sortable: true },
    { key: 'physicalInvoiceNo', label: 'Physical Invoice No', visible: true, sortable: true },
    { key: 'tag', label: 'Tag', visible: true, sortable: false },
    { key: 'alerts', label: 'Alerts', visible: true, sortable: true },
    { key: 'ocr', label: 'OCR', visible: true, sortable: false }
  ];

  // Similar Transactions state variables
  selectedSimilarTransactionRiskCategory = '';
  selectedSimilarTransactionTests = '';
  showSimilarTransactionColumnsPanel = false;
  
  // Similar Transactions sorting
  similarTransactionSortColumn = '';
  similarTransactionSortDirection: 'asc' | 'desc' = 'asc';
  
  // Similar Transactions pagination
  similarTransactionCurrentPage = 1;
  similarTransactionItemsPerPage = 15;
  similarTransactionTotalItems = 0;
  
  // Scenario Manager pagination
  scenarioCurrentPage = 1;
  scenarioItemsPerPage = 15;
  scenarioTotalItems = 0;

  // Unified Pagination Data Objects
  similarTransactionPaginationData: PaginationData = {
    currentPage: 1,
    itemsPerPage: 15,
    totalItems: 0,
    totalPages: 0,
    startItem: 1,
    endItem: 15,
    visiblePages: [1, 2, 3, '...', 20],
    itemsPerPageOptions: [15, 25, 50, 100],
    onPageChange: (page: number | string) => this.goToSimilarTransactionPage(page),
    onItemsPerPageChange: () => this.onSimilarTransactionItemsPerPageChange()
  };

  mainContentPaginationData: PaginationData = {
    currentPage: 1,
    itemsPerPage: 15,
    totalItems: 20,
    totalPages: 20,
    startItem: 1,
    endItem: 15,
    visiblePages: [1, 2, 3, '...', 20],
    itemsPerPageOptions: [15, 25, 50],
    onPageChange: (page: number | string) => this.goToMainContentPage(page),
    onItemsPerPageChange: () => this.onMainContentItemsPerPageChange()
  };

  scenarioPaginationData: PaginationData = {
    currentPage: 1,
    itemsPerPage: 15,
    totalItems: 0,
    totalPages: 0,
    startItem: 1,
    endItem: 15,
    visiblePages: [1, 2, 3, '...', 5],
    itemsPerPageOptions: [15, 25, 50],
    onPageChange: (page: number | string) => this.goToScenarioPage(page),
    onItemsPerPageChange: () => this.onScenarioItemsPerPageChange()
  };

  
  // Similar Transactions selection
  selectedSimilarTransactions: SimilarTransaction[] = [];
  
  // Similar Transactions modal state
  showSimilarTransactionModal = false;

  constructor(private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('ScreenName');
    if(name === 'ScenarioManager'){
      this.activeTab = 'scenario-manager'
      this.activeView = 'scenario-manager';
    }
    
    // Check for query parameters to set active tab
    const activeTabParam = this.route.snapshot.queryParamMap.get('activeTab');
    if (activeTabParam) {
      this.activeTab = activeTabParam;
      if (activeTabParam === 'scenario-manager') {
        this.activeView = 'scenario-manager';
      }
    }
    
    // Initialize scenario manager data
    this.filteredScenarios = [...this.scenarios];
    
    // Initialize similar transactions data
    this.updateSimilarTransactionPagination();
    this.updateSimilarTransactionPaginationData();
    
    
    // Initialize main content pagination
    this.updateMainContentPaginationData();
    
    // Initialize scenario pagination
    this.updateScenarioPaginationData();
    
    setTimeout(() => {
      this.initializeCharts();
      
      // Ensure pagination is updated after everything is initialized
      this.updateSimilarTransactionPagination();
      this.updateSimilarTransactionPaginationData();
    }, 100);
    
  }

  ngAfterViewInit(): void {
    // Ensure first visualization page is activated after view is initialized
    setTimeout(() => {
      if (this.visualizationPages.length > 0) {
        this.activateFirstVisualizationPage();
      }
    }, 300);
  }

  selectedInsightType: string = 'P2P';   // default value (O2C, P2P, T&E)
  selectedInvoiceType: string = 'invoices';  // default value (invoices, receipts, contracts)

  activeTab: string = 'overview'; // default tab
  activeView: 'entity-view' | 'transaction-view' | 'visualization' | 'scenario-manager' | 'similar-transactions' = 'visualization'; // default view
  activeTabEntity: 'entity-profiling' | 'transaction-details' = 'entity-profiling'; // for entity view tabs
  
  // Search and filter properties
  searchTerm: string = '';
  selectedRiskCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 15;
  selectedTag: string = '';
  
  // Popup properties
  showActionPopup: boolean = false;
  actionPopupPosition: { top: number, left: number } = { top: 0, left: 0 };
  selectedRowIndex: number = -1;
  showChangeTagPopup: boolean = false;
  selectedTagOption: string = '';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  
  // Unified activation for sidebar items
  activateSidebar(target: 'entity-view' | 'transaction-view' | 'scenario-manager' | 'similar-transactions'): void {
    switch (target) {
      case 'entity-view':
        this.navigateToEntityProfiling();
        break;
      case 'transaction-view':
        this.navigateToTransactionView();
        break;
      case 'scenario-manager':
        this.activeTab = 'scenario-manager';
        break;
      case 'similar-transactions':
        this.activeTab = 'similar-transactions';
        break;
    }
  }
  
  // Toggle methods
  toggleLeftView() {
    this.leftChartView = this.leftChartView === 'chart' ? 'table' : 'chart';
    if (this.leftChartView === 'chart') {
      setTimeout(() => this.createBarChart(), 100);
    }
  }

  toggleRightView() {
    this.rightChartView = this.rightChartView === 'chart' ? 'table' : 'chart';
    if (this.rightChartView === 'chart') {
      setTimeout(() => this.createGeoChart(), 100);
    }
  }

  toggleVendorView() {
    this.vendorView = this.vendorView === 'chart' ? 'table' : 'chart';
  }



  initializeCharts(): void {
    this.createBarChart();
    this.createGeoChart();
    this.createPieChart();
  }

  createBarChart(): void {
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    const ctx = this.barChart?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.invoiceData.map(d => d.year.toString()),
        datasets: [
          {
            label: 'Total Amount',
            data: this.invoiceData.map(d => d.totalAmount / 1000000),
            backgroundColor: '#4285F4',
            borderColor: '#4285F4',
            borderWidth: 1
          },
          {
            label: 'Flagged Amount',
            data: this.invoiceData.map(d => d.flaggedAmount / 1000000),
            type: 'line',
            borderColor: '#EA4335',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#EA4335',
            pointBorderColor: '#EA4335',
            pointRadius: 4,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount $'
            },
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              callback: function(value: any) {
                return value >= 0 ? `${value}B` : `-${Math.abs(value)}B`;
              }
            }
          }
        }
      }
    });
  }

  // createGeoChart(): void {
  //   if (this.geoChartInstance) {
  //     this.geoChartInstance.destroy();
  //   }

  //   const ctx = this.geoChart?.nativeElement?.getContext('2d');
  //   if (!ctx) return;

  //   this.geoChartInstance = new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       labels: this.geoData.map(d => d.region),
  //       datasets: [{
  //         data: this.geoData.map(d => d.riskScore),
  //         backgroundColor: this.geoData.map(d => {
  //           switch(d.color) {
  //             case 'high': return '#EA4335';
  //             case 'medium': return '#FBBC04';
  //             case 'low': return '#34A853';
  //             default: return '#9AA0A6';
  //           }
  //         }),
  //         borderWidth: 2,
  //         borderColor: '#fff'
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         legend: {
  //           display: false
  //         }
  //       }
  //     }
  //   });
  // }

createGeoChart(): void {
  if (this.geoChartInstance) this.geoChartInstance.destroy();

  const ctx = this.geoChart?.nativeElement?.getContext('2d');
  if (!ctx) return;

  fetch('https://unpkg.com/world-atlas/countries-50m.json')
    .then(r => r.json())
    .then(world => {
      const countries = (feature(world, world.objects.countries) as any).features;

      this.geoChartInstance = new Chart(ctx, {
        type: 'choropleth',
        data: {
          labels: countries.map((d: any) => d.properties.name),
          datasets: [{
            label: 'Risk Score',
            data: this.geoData.map((d, i) => ({
              feature: countries[i],
              value: d.riskScore
            })),
            backgroundColor: (ctx: import('chart.js').ScriptableContext<'choropleth'>) => {
              const value = (ctx.raw as { value?: number } | undefined)?.value;
              if (typeof value === 'number') {
                if (value > 8) return '#EA4335';
                if (value > 5) return '#FBBC04';
                return '#34A853';
              }
              return '#9AA0A6'; // default color if value is undefined
            }
          }]
        },
        options: {
          showOutline: true,
          showGraticule: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            projection: {
              axis: 'x',
              projection: 'equalEarth'
            }
          }
        }
      });
    });
}

  createPieChart(): void {
    const ctx = this.pieChart?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['REG - Vendor invoice gross', 'ZF - BNZMT reduced', 'ML - Vendor invoices LIV', 'SIA - OIL Account Document', 'NJ - IV Non Op Bill AO'],
        datasets: [{
          data: [55.4, 20.8, 12.5, 7.7, 3.6],
          backgroundColor: [
            '#1f4788',
            '#4A90E2',
            '#7BB3F0',
            '#A8CDF0',
            '#D6E8F5'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatAmount(amount: number): string {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000000) {
      return `$${(absAmount / 1000000000).toFixed(0)}B`;
    } else {
      return `$${(absAmount / 1000000).toFixed(0)}M`;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US').format(num);
  }

  getRiskLevelClass(riskLevel: string): string {
    switch (riskLevel) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return '';
    }
  }

  navigateToOverview(): void {
    console.log('Navigate to Overview');
  }

  navigateToTrends(): void {
    console.log('Navigate to Trends');
  }

  navigateToVendors(): void {
    console.log('Navigate to Vendors');
  }

  navigateToEntityProfiling(): void {
    this.router.navigate(['/insights-entity-trans']);
  }

  navigateToTransactionView(): void {
    this.router.navigate(['/insights-entity-trans'], { 
      queryParams: { activeView: 'transaction-view' } 
    });
  }

  navigateToScenarioManager(): void {
    this.activeTab = 'scenario-manager';
    this.activeView = 'scenario-manager';
  }

  navigateToSimilarTransactions(): void {
    this.activeTab = 'similar-transactions';
    this.activeView = 'similar-transactions';
    
    // Ensure pagination is updated when navigating to similar transactions
    setTimeout(() => {
      this.updateSimilarTransactionPagination();
      this.updateSimilarTransactionPaginationData();
    }, 50);
  }

  refreshData(): void {
    console.log('Refresh Data');
    this.initializeCharts();
  }



  
  toggleState(state: string) {
    if (this.selected.has(state)) {
      this.selected.delete(state);
    } else {
      this.selected.add(state);
    }
  }

  apply() {
    this.filterApplied.emit([...this.selected]);
  }

  clear() {
    this.selected.clear();

    
    this.filterApplied.emit([]);
  }

  // Visualization sidebar methods
  goToVisualizationPage(page: any) {
    // Set the active page
    this.activeVisualizationPage = page;
    
    // Navigate to the page in the visualization component
    if (this.visualizationComponent) {
      this.visualizationComponent.navigateToPage(page.name);
    }
    
    console.log('Activating visualization tab:', page.displayName);
  }

  // Method to check if a page is active
  isVisualizationPageActive(page: any): boolean {
    const isActive = this.activeVisualizationPage && this.activeVisualizationPage.name === page.name;
    console.log(`Checking if page ${page.name} is active:`, isActive, 'Active page:', this.activeVisualizationPage?.name);
    return isActive;
  }

  trackVisualizationPageByName(index: number, page: any) {
    return page.name;
  }

  // Method to receive pages from visualization component
  onVisualizationPagesLoaded(pages: any[]) {
    console.log('Pages loaded:', pages);
    this.visualizationPages = pages;
    if (pages.length > 0) {
      // Always activate the first page when pages are loaded
      this.activateFirstVisualizationPage();
    }
  }

  // Method to handle page changes from visualization component
  onVisualizationPageChanged(page: any) {
    this.activeVisualizationPage = page;
  }

  // Method to toggle visualization sidebar and activate first item if opening
  toggleVisualization() {
    this.isVisualizationOpen = !this.isVisualizationOpen;
    
    // If opening the sidebar and there are pages, activate the first one
    if (this.isVisualizationOpen && this.visualizationPages.length > 0) {
      this.activateFirstVisualizationPage();
    }
  }

  // Method to activate the first visualization page
  activateFirstVisualizationPage() {
    console.log('activateFirstVisualizationPage called, pages:', this.visualizationPages);
    if (this.visualizationPages.length > 0) {
      // Look for overview page first, otherwise use the first page
      const overviewPage = this.visualizationPages.find(page => 
        page.displayName.toLowerCase().includes('overview') || 
        page.name.toLowerCase().includes('overview')
      );
      
      this.activeVisualizationPage = overviewPage || this.visualizationPages[0];
      console.log('Set activeVisualizationPage to:', this.activeVisualizationPage);
      
      // Navigate to the page with a small delay to ensure component is ready
      setTimeout(() => {
        if (this.visualizationComponent) {
          this.visualizationComponent.navigateToPage(this.activeVisualizationPage.name);
          console.log('Navigated to visualization page:', this.activeVisualizationPage.displayName);
        } else {
          console.log('Visualization component not available yet');
        }
      }, 100);
    } else {
      console.log('No visualization pages available');
    }
  }

  // Entity and Transaction View Methods
  switchToEntityView(): void {
    this.activeView = 'entity-view';
    this.activeTabEntity = 'entity-profiling';
    this.clearAllSelections();
  }

  switchToTransactionView(): void {
    this.activeView = 'transaction-view';
    this.clearAllSelections();
  }

  switchToEntityProfiling(): void {
    this.activeTabEntity = 'entity-profiling';
    this.clearAllSelections();
  }

  switchToTransactionDetails(): void {
    this.activeTabEntity = 'transaction-details';
    this.clearAllSelections();
  }

  // Selection methods
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.vendors.forEach(vendor => vendor.selected = isChecked);
    this.onSelectionChange();
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

  onSelectionChange(): void {
    // This method is called whenever selection changes to trigger popup visibility
  }

  onTransactionSelectionChange(): void {
    // This method is called whenever transaction selection changes to trigger popup visibility
  }

  onTransactionViewSelectionChange(): void {
    // This method is called whenever transaction view selection changes to trigger popup visibility
  }

  hasSelectedRecords(): boolean {
    return this.vendors.some(vendor => vendor.selected);
  }

  hasSelectedTransactions(): boolean {
    return this.transactions.some(transaction => transaction.selected);
  }

  hasSelectedTransactionViewRecords(): boolean {
    return this.transactionViewData.some(transaction => transaction.selected);
  }

  getSelectedCount(): number {
    return this.vendors.filter(vendor => vendor.selected).length;
  }

  getSelectedTransactionCount(): number {
    return this.transactions.filter(transaction => transaction.selected).length;
  }

  getSelectedTransactionViewCount(): number {
    return this.transactionViewData.filter(transaction => transaction.selected).length;
  }

  clearAllSelections(): void {
    this.vendors.forEach(vendor => vendor.selected = false);
    this.transactions.forEach(transaction => transaction.selected = false);
    this.transactionViewData.forEach(transaction => transaction.selected = false);
    this.selectedTag = '';
  }

  // Popup methods
  getCloseSelectionMethod(): () => void {
    if (this.activeView === 'transaction-view') {
      return () => this.clearAllTransactionViewSelections();
    } else if (this.activeTabEntity === 'entity-profiling') {
      return () => this.clearAllSelections();
    } else {
      return () => this.clearAllTransactionSelections();
    }
  }

  getSelectionPopupTitle(): string {
    if (this.activeView === 'transaction-view') {
      return 'Selected Transactions';
    } else if (this.activeTabEntity === 'entity-profiling') {
      return 'Selected Entities';
    } else {
      return 'Selected Transactions';
    }
  }

  getSelectionPopupCount(): number {
    if (this.activeView === 'transaction-view') {
      return this.getSelectedTransactionViewCount();
    } else if (this.activeTabEntity === 'entity-profiling') {
      return this.getSelectedCount();
    } else {
      return this.getSelectedTransactionCount();
    }
  }

  getCreateAlertMethod(): () => void {
    if (this.activeView === 'transaction-view') {
      return () => this.createNewAlertFromTransactionView();
    } else if (this.activeTabEntity === 'entity-profiling') {
      return () => this.createNewAlert();
    } else {
      return () => this.createNewAlertFromTransactions();
    }
  }

  getApplyTagMethod(): () => void {
    if (this.activeView === 'transaction-view') {
      return () => this.applyTransactionViewTag();
    } else if (this.activeTabEntity === 'entity-profiling') {
      return () => this.applyTag();
    } else {
      return () => this.applyTransactionTag();
    }
  }

  // Tag application methods
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

    this.clearAllSelections();
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

    this.clearAllSelections();
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

    this.clearAllSelections();
  }

  // Alert creation methods
  createNewAlert(): void {
    const selectedVendors = this.vendors.filter(vendor => vendor.selected);
    console.log('Create new alert for:', selectedVendors);
    
    if (selectedVendors.length > 0) {
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
      this.router.navigate(['/createalert']);
    }
  }

  createNewAlertFromTransactions(): void {
    const selectedTransactions = this.transactions.filter(transaction => transaction.selected);
    console.log('Create new alert for transactions:', selectedTransactions);
    
    if (selectedTransactions.length > 0) {
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
      this.router.navigate(['/createalert']);
    }
  }

  createNewAlertFromTransactionView(): void {
    const selectedTransactions = this.transactionViewData.filter(transaction => transaction.selected);
    console.log('Create new alert for transaction view:', selectedTransactions);
    
    if (selectedTransactions.length > 0) {
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
      this.router.navigate(['/createalert']);
    }
  }

  // Action menu methods
  showActionMenu(event: MouseEvent, rowIndex: number): void {
    event.stopPropagation();
    
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    this.actionPopupPosition = {
      top: buttonRect.bottom + scrollTop + 5,
      left: buttonRect.left + scrollLeft - 180
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
    this.hideActionMenu();
    this.selectedTagOption = '';
    this.showChangeTagPopup = true;
  }

  onViewAlerts(rowIndex: number): void {
    console.log('View alerts for row:', rowIndex);
    this.hideActionMenu();
    // Navigate to alerts screen
    this.router.navigate(['/alert']);
  }

  onCreateAlert(rowIndex: number): void {
    console.log('Create alert for row:', rowIndex);
    this.hideActionMenu();
    // Navigate to create alert screen
    this.router.navigate(['/createalert']);
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
    if (this.activeTabEntity === 'entity-profiling' && this.vendors[this.selectedRowIndex]) {
      this.applyTagToVendor(this.selectedRowIndex, this.selectedTagOption);
    } else if (this.activeTabEntity === 'transaction-details' && this.transactions[this.selectedRowIndex]) {
      this.applyTagToTransaction(this.selectedRowIndex, this.selectedTagOption);
    }

    this.closeChangeTagPopup();
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

  viewTransactionDetails(): void {
    const selectedVendors = this.vendors.filter(vendor => vendor.selected);
    console.log('View transaction details for:', selectedVendors);
    
    if (selectedVendors.length > 0) {
      this.switchToTransactionDetails();
      this.clearAllSelections();
    }
  }

  clearAllTransactionSelections(): void {
    this.transactions.forEach(transaction => transaction.selected = false);
    this.selectedTag = '';
  }

  clearAllTransactionViewSelections(): void {
    this.transactionViewData.forEach(transaction => transaction.selected = false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showActionPopup) {
      this.hideActionMenu();
    }
  }

  // Scenario Manager Methods
  onScenarioSearch(): void {
    if (!this.scenarioSearchTerm.trim()) {
      this.filteredScenarios = [...this.scenarios];
    } else {
      this.filteredScenarios = this.scenarios.filter(scenario =>
        scenario.scenarioName.toLowerCase().includes(this.scenarioSearchTerm.toLowerCase()) ||
        scenario.createdBy.toLowerCase().includes(this.scenarioSearchTerm.toLowerCase()) ||
        scenario.triggerType.toLowerCase().includes(this.scenarioSearchTerm.toLowerCase())
      );
    }
  }

  onNewScenario(): void {
    // Logic for creating new scenario
    console.log('Create new scenario clicked');
  }

  onEditScenario(name: string) {
    this.router.navigate(['/edit-scenario', name]);
  }

  onDeleteScenario(scenario: Scenario): void {
    this.selectedScenario = scenario;
    this.showDeleteModal = true;
  }

  onTriggerScenario(scenario: Scenario): void {
    this.selectedScenario = scenario;
    this.showTriggerModal = true;
  }

  onPreviewScenario(scenario: Scenario): void {
    this.selectedScenario = scenario;
    this.showPreviewModal = true;
  }

  confirmDelete(): void {
    if (this.selectedScenario) {
      this.scenarios = this.scenarios.filter(s => s.id !== this.selectedScenario!.id);
      this.onScenarioSearch(); // Refresh filtered list
      this.closeDeleteModal();
    }
  }

  confirmTrigger(): void {
    if (this.selectedScenario) {
      // Logic to trigger scenario
      console.log('Triggering scenario:', this.selectedScenario.scenarioName);
      this.closeTriggerModal();
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedScenario = null;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedScenario = null;
  }

  closeTriggerModal(): void {
    this.showTriggerModal = false;
    this.selectedScenario = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedScenario = null;
  }

  exportReport(): void {
    console.log('Export report clicked');
  }

  // Similar Transactions Methods
  // Group management
  toggleSimilarTransactionGroup(group: SimilarTransactionGroup): void {
    group.expanded = !group.expanded;
  }

  getSimilarTransactionGroupBadges(group: SimilarTransactionGroup): {type: string, text: string}[] {
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

  getSimilarTransactionGroupAlertCount(group: SimilarTransactionGroup): number {
    return group.transactions.reduce((sum, t) => sum + t.alerts, 0);
  }

  getSimilarTransactionGroupOcrCount(group: SimilarTransactionGroup): number {
    return group.transactions.filter(t => t.hasOcr).length;
  }

  // Sorting
  sortSimilarTransactions(column: string): void {
    if (this.similarTransactionSortColumn === column) {
      this.similarTransactionSortDirection = this.similarTransactionSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.similarTransactionSortColumn = column;
      this.similarTransactionSortDirection = 'asc';
    }
    
    this.applySimilarTransactionSorting();
  }

  private applySimilarTransactionSorting(): void {
    this.similarTransactionGroups.forEach(group => {
      group.transactions.sort((a, b) => {
        let aValue: any = a[this.similarTransactionSortColumn as keyof SimilarTransaction];
        let bValue: any = b[this.similarTransactionSortColumn as keyof SimilarTransaction];
        
        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return this.similarTransactionSortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.similarTransactionSortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    });
  }

  // Selection management
  get isAllSimilarTransactionsSelected(): boolean {
    const allTransactions = this.getAllSimilarTransactions();
    return allTransactions.length > 0 && allTransactions.every(t => t.selected);
  }

  toggleSelectAllSimilarTransactions(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    
    this.similarTransactionGroups.forEach(group => {
      group.transactions.forEach(transaction => {
        transaction.selected = isChecked;
      });
    });
    
    this.updateSimilarTransactionSelectionState();
  }

  updateSimilarTransactionSelectionState(): void {
    this.selectedSimilarTransactions = this.getAllSimilarTransactions().filter(t => t.selected);
  }

  private getAllSimilarTransactions(): SimilarTransaction[] {
    return this.similarTransactionGroups.flatMap(group => group.transactions);
  }

  // Pagination
  get paginatedSimilarTransactionGroups(): SimilarTransactionGroup[] {
    const startIndex = (this.similarTransactionCurrentPage - 1) * this.similarTransactionItemsPerPage;
    const endIndex = startIndex + this.similarTransactionItemsPerPage;
    
    return this.similarTransactionGroups.slice(startIndex, endIndex);
  }

  get similarTransactionTotalPages(): number {
    return Math.ceil(this.similarTransactionTotalItems / this.similarTransactionItemsPerPage);
  }

  get similarTransactionStartItem(): number {
    return (this.similarTransactionCurrentPage - 1) * this.similarTransactionItemsPerPage + 1;
  }

  get similarTransactionEndItem(): number {
    return Math.min(this.similarTransactionCurrentPage * this.similarTransactionItemsPerPage, this.similarTransactionTotalItems);
  }

  updateSimilarTransactionPagination(): void {
    // Count total groups (since pagination is by groups)
    this.similarTransactionTotalItems = this.similarTransactionGroups.length;
  }

  updateSimilarTransactionPaginationData(): void {
    this.similarTransactionPaginationData.currentPage = this.similarTransactionCurrentPage;
    this.similarTransactionPaginationData.itemsPerPage = this.similarTransactionItemsPerPage;
    this.similarTransactionPaginationData.totalItems = this.similarTransactionTotalItems;
    this.similarTransactionPaginationData.totalPages = this.similarTransactionTotalPages;
    this.similarTransactionPaginationData.startItem = this.similarTransactionStartItem;
    this.similarTransactionPaginationData.endItem = this.similarTransactionEndItem;
    this.similarTransactionPaginationData.visiblePages = this.getSimilarTransactionVisiblePages();
  }

  goToSimilarTransactionPage(page: number | string): void {
    if (typeof page === 'string') return;
    
    if (page >= 1 && page <= this.similarTransactionTotalPages) {
      this.similarTransactionCurrentPage = page;
    }
  }

  onSimilarTransactionItemsPerPageChange(): void {
    this.similarTransactionCurrentPage = 1;
    this.similarTransactionItemsPerPage = this.similarTransactionPaginationData.itemsPerPage;
    this.updateSimilarTransactionPagination();
    this.updateSimilarTransactionPaginationData();
  }

  // Main Content Pagination Methods
  goToMainContentPage(page: number | string): void {
    if (typeof page === 'string') return;
    
    if (page >= 1 && page <= this.mainContentPaginationData.totalPages) {
      this.mainContentPaginationData.currentPage = page;
      this.currentPage = page;
      this.updateMainContentPaginationData();
    }
  }

  onMainContentItemsPerPageChange(): void {
    this.mainContentPaginationData.currentPage = 1;
    this.currentPage = 1;
    this.itemsPerPage = this.mainContentPaginationData.itemsPerPage;
    this.updateMainContentPaginationData();
  }

  updateMainContentPaginationData(): void {
    this.mainContentPaginationData.totalItems = 203; // Static value for demo
    this.mainContentPaginationData.totalPages = Math.ceil(this.mainContentPaginationData.totalItems / this.mainContentPaginationData.itemsPerPage);
    this.mainContentPaginationData.startItem = (this.mainContentPaginationData.currentPage - 1) * this.mainContentPaginationData.itemsPerPage + 1;
    this.mainContentPaginationData.endItem = Math.min(this.mainContentPaginationData.currentPage * this.mainContentPaginationData.itemsPerPage, this.mainContentPaginationData.totalItems);
    this.mainContentPaginationData.visiblePages = this.getMainContentVisiblePages();
  }

  getMainContentVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.mainContentPaginationData.totalPages;
    const current = this.mainContentPaginationData.currentPage;
    
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
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (current < totalPages - 3) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  // Scenario Pagination Methods
  goToScenarioPage(page: number | string): void {
    if (typeof page === 'string') return;
    
    if (page >= 1 && page <= this.scenarioPaginationData.totalPages) {
      this.scenarioPaginationData.currentPage = page;
      this.scenarioCurrentPage = page;
      this.updateScenarioPaginationData();
    }
  }

  onScenarioItemsPerPageChange(): void {
    this.scenarioPaginationData.currentPage = 1;
    this.scenarioCurrentPage = 1;
    this.scenarioItemsPerPage = this.scenarioPaginationData.itemsPerPage;
    this.updateScenarioPaginationData();
  }

  updateScenarioPaginationData(): void {
    this.scenarioPaginationData.totalItems = this.filteredScenarios.length;
    this.scenarioPaginationData.totalPages = Math.ceil(this.scenarioPaginationData.totalItems / this.scenarioPaginationData.itemsPerPage);
    this.scenarioPaginationData.startItem = (this.scenarioPaginationData.currentPage - 1) * this.scenarioPaginationData.itemsPerPage + 1;
    this.scenarioPaginationData.endItem = Math.min(this.scenarioPaginationData.currentPage * this.scenarioPaginationData.itemsPerPage, this.scenarioPaginationData.totalItems);
    this.scenarioPaginationData.visiblePages = this.getScenarioVisiblePages();
  }

  getScenarioVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.scenarioPaginationData.totalPages;
    const current = this.scenarioPaginationData.currentPage;
    
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
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (current < totalPages - 3) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  getSimilarTransactionVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.similarTransactionTotalPages;
    const current = this.similarTransactionCurrentPage;
    
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
  toggleSimilarTransactionColumnsPanel(): void {
    this.showSimilarTransactionColumnsPanel = !this.showSimilarTransactionColumnsPanel;
  }

  // Action handlers
  viewSimilarTransaction(transaction: SimilarTransaction): void {
    console.log('View similar transaction:', transaction);
  }

  editSimilarTransaction(transaction: SimilarTransaction): void {
    console.log('Edit similar transaction:', transaction);
  }

  flagSimilarTransaction(transaction: SimilarTransaction): void {
    transaction.tag = 'Flag for Review';
    console.log('Flag similar transaction:', transaction);
  }

  deleteSimilarTransaction(transaction: SimilarTransaction): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.similarTransactionGroups.forEach(group => {
        const index = group.transactions.findIndex(t => t.id === transaction.id);
        if (index > -1) {
          group.transactions.splice(index, 1);
        }
      });
      
      this.similarTransactionGroups = this.similarTransactionGroups.filter(group => group.transactions.length > 0);
      this.updateSimilarTransactionPagination();
    }
  }

  // Bulk actions
  performSimilarTransactionBulkAction(action: string): void {
    if (this.selectedSimilarTransactions.length === 0) {
      alert('Please select at least one transaction.');
      return;
    }
    
    console.log('Bulk action:', action, this.selectedSimilarTransactions);
  }

  // Export functionality
  exportSimilarTransactionsToCSV(): void {
    const allTransactions = this.getAllSimilarTransactions();
    const csvData = this.convertSimilarTransactionsToCSV(allTransactions);
    this.downloadSimilarTransactionsCSV(csvData, 'similar-transactions.csv');
  }

  private convertSimilarTransactionsToCSV(transactions: SimilarTransaction[]): string {
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

  private downloadSimilarTransactionsCSV(csvData: string, filename: string): void {
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
  applySimilarTransactionFilters(): void {
    console.log('Applying similar transaction filters:', {
      riskCategory: this.selectedSimilarTransactionRiskCategory,
      tests: this.selectedSimilarTransactionTests
    });
  }

  clearSimilarTransactionFilters(): void {
    this.selectedSimilarTransactionRiskCategory = '';
    this.selectedSimilarTransactionTests = '';
    this.applySimilarTransactionFilters();
  }

  // Utility methods
  getSimilarTransactionStatusClass(transaction: SimilarTransaction): string {
    if (transaction.tag === 'Prioritise Review') return 'status-priority';
    if (transaction.tag === 'Flag for Review') return 'status-flag';
    if (transaction.tag === 'Downgrade') return 'status-downgrade';
    return '';
  }

  getSimilarTransactionTotalAlerts(): number {
    return this.getAllSimilarTransactions().reduce((sum, t) => sum + t.alerts, 0);
  }

  getSimilarTransactionTotalOCRCount(): number {
    return this.getAllSimilarTransactions().filter(t => t.hasOcr).length;
  }

  // Keyboard navigation
  onSimilarTransactionKeyDown(event: KeyboardEvent, transaction: SimilarTransaction): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      transaction.selected = !transaction.selected;
      this.updateSimilarTransactionSelectionState();
    }
  }

  // Modal methods
  showSimilarTransactionPopup(): void {
    this.showSimilarTransactionModal = true;
  }

  closeSimilarTransactionModal(): void {
    this.showSimilarTransactionModal = false;
  }

  viewSimilarTransactionDetails(): void {
    console.log('View similar transaction details');
  }

  createNewSimilarTransactionAlert(): void {
    console.log('New Alert created for similar transactions');
  }

  applySimilarTransactionAction(): void {
    console.log('Apply clicked for similar transactions');
  }

  // OCR Navigation method
  navigateToOcrView(transaction: TransactionDetail): void {
    console.log('Navigate to OCR view for transaction:', transaction);
    
    // Navigate to OCR view with transaction data
    this.router.navigate(['/ocr-view'], {
      queryParams: {
        transactionId: transaction.systemInvoice,
        vendorName: transaction.vendorName,
        invoiceType: transaction.invoiceType,
        invoiceDescription: transaction.invoiceDescription,
        documentName: `${transaction.systemInvoice}_document.pdf`
      }
    });
  }

  // OCR Navigation method for similar transactions
  navigateToOcrViewFromSimilarTransaction(transaction: SimilarTransaction): void {
    console.log('Navigate to OCR view for similar transaction:', transaction);
    
    // Navigate to OCR view with similar transaction data
    this.router.navigate(['/ocr-view'], {
      queryParams: {
        transactionId: transaction.systemInvoiceNo,
        vendorName: transaction.vendorName,
        invoiceType: 'Similar Transaction',
        invoiceDescription: `Transaction from ${transaction.vendorName}`,
        documentName: `${transaction.systemInvoiceNo}_document.pdf`
      }
    });
  }

}