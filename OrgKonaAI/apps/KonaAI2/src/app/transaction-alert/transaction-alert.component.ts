import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface TransactionAlert {
  id: string;
  riskAmount: number;
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  currentRiskScore: number;
  isDuplicateTransaction: boolean;
  testsFailedCount: number;
  testsFailedList: string[];
  transactionDetails: TransactionDetails;
  entityDetails: EntityDetails;
  patternDescription: string;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  actions?: string[];
  replies?: Comment[];
  resolvedBy?: string;
}

export interface Auditor {
  id: string;
  name: string;
  selected: boolean;
  assigned?: string;
}

interface EntityDetails {
  entitiesInvolved: string[];
}

interface TimelineItem {
  id: number;
  user: string;
  email: string;
  avatar: string;
  date: string;
  time: string;
  status?: string; // e.g. "Resolved"
  details?: string[];
  comment?: string;
  location?: string;
  browser?: string;
  ip?: string;
}
export interface RiskAssessment {
  currentRiskScore: number;
  testsFailedCount: number;
  duplicateTransaction: boolean;
  personalExpenseClaimed: boolean;
  weekendTransaction: boolean;
}

export interface TransactionDetails {
  module: string;
  submodule: string;
  phase: number;
  riskAmount: number;
  transactionId: string;
  reportNumber: string;
  transactionDate: string;
  lineItemDescription: string;
  paymentType: string;
  billingCurrency: string;
  billingAmount: number;
  approvedBy: string;
  approvedOn: string;
  paymentDate: string;
  paymentStatus: string;
}

export interface EntityTransaction {
  transactionId: string;
  riskScore: number;
  riskAmount: number;
  testsFailedCount: number;
  module: string;
  alertId?: string;
  assignedTo?: string;
}

export interface AssociatedAlert {
  transactionId: string;
  riskScore: number;
  riskAmount: number;
  testsFailedCount: number;
  module: string;
  alertId?: string;
  assignedTo?: string;
  status: 'Resolved' | 'Escalated' | 'In Progress';
}

export interface AuditData {
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  patternDetected: string;
  riskAssessment: RiskAssessment;
  transactionDetails: TransactionDetails;
  transactionIdUnderReview: string;
  entitiesInvolved: string;
  testsFailedList: string[];
  identificationMethod: 'risk-scoring' | 'judgmental' | '';
}

export interface EvidenceItem {
  id: string;
  transactionId: string;
  name: string;
  type: 'document' | 'screenshot' | 'email' | 'receipt';
  status: 'pending' | 'completed' | 'rejected';
  size: string;
  uploadDate: Date;
  description?: string;
  tags?: string[];
  uploadedBy: string;
  fileUrl?: string;
}

@Component({
  selector: 'app-transaction-alert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-alert.component.html',
  styleUrls: ['./transaction-alert.component.scss']
})
export class TransactionAlertComponent implements OnInit {
  showEditPopup: boolean = false;
  openEvidenceMenuId: string | null = null;
  showRenamePopup: boolean = false;
  renameTarget: EvidenceItem | null = null;
  renameFormName: string = '';
  // Evidence add flow popups
  showUploadEvidencePopup: boolean = false;
  showRequestEvidencePopup: boolean = false;
  showLinkEvidencePopup: boolean = false;
  // Evidence add flow form state
  uploadedFiles: File[] = [];
  requestEmail: string = '';
  requestMessage: string = '';
  requestDueDate: string = '';
  linkUrl: string = '';
  linkName: string = '';
  isDragOver: boolean = false;
  currentRole: any;
  disableEdit: boolean = false;
  auditors: Auditor[] = [
    { id: 'l1', name: 'L1 Auditor', selected: false },
    { id: 'l2', name: 'L2 Auditor', selected: false },
    { id: 'l3', name: 'L3 Auditor', selected: true, assigned: 'Michael Johnson' }
  ];
  comments: Comment[] = [
    {
      id: 1,
      user: 'Michael Johnson',
      avatar: 'https://i.pravatar.cc/40?img=3',
      time: '30 minutes ago',
      text: 'The transaction has now been flagged in the system. I’ll run a full audit to see if there are any related trends to monitor.',
      actions: ['Reply'],
      resolvedBy: 'Name'
    },
    {
      id: 2,
      user: 'Alex Brown',
      avatar: 'https://i.pravatar.cc/40?img=5',
      time: '2 hours ago',
      text: 'Detected a discrepancy in the transaction amounts; it seems to be higher than the usual range for this vendor. Investigating further.',
      actions: ['Reply', 'Resolve Comment'],
      replies: [
        {
          id: 3,
          user: 'Sarah Williams',
          avatar: 'https://i.pravatar.cc/40?img=8',
          time: '1 hour ago',
          text: 'I checked the vendor’s previous transactions—this amount is consistent with their recent orders. The discrepancy might be due to updated pricing terms from last month.',
          actions: ['Reply'],
          replies: [
            {
              id: 4,
              user: 'Michael Johnson',
              avatar: 'https://i.pravatar.cc/40?img=3',
              time: '1 hour ago',
              text: 'Agree with Sarah. The pricing change was confirmed in the last meeting. Should we close this alert or escalate it for further monitoring?',
              actions: ['Reply']
            }
          ]
        }
      ]
    }
  ];
  timeline: TimelineItem[] = [
    {
      id: 1,
      user: 'Michael Johnson',
      email: 'michael.johnson@companyname.com',
      avatar: 'https://i.pravatar.cc/40?img=3',
      date: '30 Mar 25',
      time: '10:15 AM UTC',
      status: 'Resolved',
      details: [
        'Closure Type: Confirmed Misuse — Recovered',
        'Amount Recovered: $350'
      ],
      comment:
        'Duplicate lodging claims confirmed. Recovery approved and processed via payroll adjustment.',
      location: 'Toronto, Canada',
      browser: 'Edge on Windows 10',
      ip: 'IP: 10.20.14.34'
    },
    {
      id: 2,
      user: 'Alex Brown',
      email: 'alex.brown@companyname.com',
      avatar: 'https://i.pravatar.cc/40?img=5',
      date: '29 Mar 25',
      time: '02:20 PM UTC',
      comment:
        'Recommend recovery of over claimed amount $350. No policy violation if recovered.',
      location: 'London, UK',
      browser: 'Safari on macOS',
      ip: 'IP: 192.88.45.10'
    },
    {
      id: 3,
      user: 'Michael Johnson',
      email: 'michael.johnson@companyname.com',
      avatar: 'https://i.pravatar.cc/40?img=3',
      date: '29 Mar 25',
      time: '10:15 AM UTC'
    }
  ];
  editFormData = {
    startDate: '20/07/25',
    endDate: '',
    priority: ''
  };
  isToolbarVisible = false;
  selectedStyle = 'title';
  priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];

  // Evidence-related properties
  evidenceItems: EvidenceItem[] = [
    {
      id: 'ev-001',
      transactionId: 'TXN-245678',
      name: 'Flight_Invoice_March2025.pdf',
      type: 'document',
      status: 'completed',
      size: '1.2 MB',
      uploadDate: new Date('2024-03-21'),
      description: 'Flight invoice for business class upgrade',
      tags: ['invoice', 'flight', 'business-class'],
      uploadedBy: 'Michael Johnson',
      fileUrl: '/assets/documents/flight-invoice.pdf'
    },
    {
      id: 'ev-002',
      transactionId: 'TXN-245678',
      name: 'Manager_Approval_Email.jpeg',
      type: 'screenshot',
      status: 'completed',
      size: '350 KB',
      uploadDate: new Date('2024-03-22'),
      description: 'Screenshot of manager approval email',
      tags: ['approval', 'email', 'screenshot'],
      uploadedBy: 'Sarah Williams',
      fileUrl: '/assets/documents/approval-email.jpeg'
    },
    {
      id: 'ev-003',
      transactionId: 'TXN-240321',
      name: 'Expense_Report_TXN240321.xlsx',
      type: 'document',
      status: 'completed',
      size: '350 KB',
      uploadDate: new Date('2024-02-18'),
      description: 'Expense report for transaction TXN240321',
      tags: ['expense', 'report', 'xlsx'],
      uploadedBy: 'Michael Johnson',
      fileUrl: '/assets/documents/expense-report.xlsx'
    },
    {
      id: 'ev-004',
      transactionId: 'TXN-248110',
      name: 'CreditCard_Statement_JaneSmith.pdf',
      type: 'document',
      status: 'completed',
      size: '2.4 MB',
      uploadDate: new Date('2024-03-22'),
      description: 'Credit card statement for Jane Smith',
      tags: ['credit-card', 'statement', 'pdf'],
      uploadedBy: 'David Brown',
      fileUrl: '/assets/documents/credit-card-statement.pdf'
    },
    {
      id: 'ev-005',
      transactionId: 'TXN-251900',
      name: 'Approval_Email_Upgrade_Travel.pdf',
      type: 'document',
      status: 'completed',
      size: '320 KB',
      uploadDate: new Date('2024-03-11'),
      description: 'Approval email for travel upgrade',
      tags: ['approval', 'travel', 'upgrade'],
      uploadedBy: 'Michael Johnson',
      fileUrl: '/assets/documents/approval-email.pdf'
    },
    {
      id: 'ev-006',
      transactionId: 'TXN-259832',
      name: 'Hotel_Receipt_TXN259832.jpeg',
      type: 'receipt',
      status: 'completed',
      size: '500 KB',
      uploadDate: new Date('2024-03-14'),
      description: 'Hotel receipt for transaction TXN259832',
      tags: ['hotel', 'receipt', 'jpeg'],
      uploadedBy: 'Michael Johnson',
      fileUrl: '/assets/documents/hotel-receipt.jpeg'
    },
    {
      id: 'ev-007',
      transactionId: 'TXN-260778',
      name: 'Uber_Bill_TXN260778.pdf',
      type: 'receipt',
      status: 'completed',
      size: '150 KB',
      uploadDate: new Date('2024-03-14'),
      description: 'Uber bill for transaction TXN260778',
      tags: ['uber', 'bill', 'transport'],
      uploadedBy: 'Sarah Williams',
      fileUrl: '/assets/documents/uber-bill.pdf'
    },
    {
      id: 'ev-008',
      transactionId: 'TXN-265450',
      name: 'Manager_Justification_Form.pdf',
      type: 'document',
      status: 'completed',
      size: '1.1 MB',
      uploadDate: new Date('2024-03-22'),
      description: 'Manager justification form',
      tags: ['justification', 'form', 'manager'],
      uploadedBy: 'Michael Johnson',
      fileUrl: '/assets/documents/justification-form.pdf'
    },
    {
      id: 'ev-009',
      transactionId: 'TXN-270011',
      name: 'Manager_Justification_Form.pdf',
      type: 'document',
      status: 'completed',
      size: '780 KB',
      uploadDate: new Date('2024-03-14'),
      description: 'Manager justification form',
      tags: ['justification', 'form', 'manager'],
      uploadedBy: 'Emily Carter',
      fileUrl: '/assets/documents/justification-form-2.pdf'
    }
  ];

  filteredEvidenceItems: EvidenceItem[] = [];
  selectedStatus: string = '';
  selectedType: string = '';
  startDate: string = '';
  endDate: string = '';

  alert: TransactionAlert = {
    id: 'ALRT-000001',
    riskAmount: 1500,
    assignedTo: 'Michael Johnson',
    dueDate: '25 Apr 2025',
    priority: 'High',
    currentRiskScore: 85,
    isDuplicateTransaction: true,
    testsFailedCount: 2,
    testsFailedList: ['Personal Expense Claimed', 'Weekend Transaction'],

    transactionDetails: {
      module: 'T&E',
      submodule: 'Expenses',
      phase: 2,
      riskAmount: 1500,
      transactionId: 'TXN-245678',
      reportNumber: 'REP-90876',
      transactionDate: '15 Mar 2024',
      lineItemDescription: 'Business-Class Flight Upgrade',
      paymentType: 'Corporate Credit Card',
      billingCurrency: 'USD',
      billingAmount: 1500,
      approvedBy: 'John Doe',
      approvedOn: '18 Mar 2024',
      paymentDate: '20 Mar 2024',
      paymentStatus: 'Paid'
    },
    entityDetails: {
      entitiesInvolved: ['Jane Smith', 'Luxury Airlines Inc.']
    },
    patternDescription: 'High-value transaction processed through emergency exception route without supporting evidence.'
  };

  // Entity Transactions data
  entityTransactions: EntityTransaction[] = [
    {
      transactionId: 'TXN-245678',
      riskScore: 85,
      riskAmount: 1500,
      testsFailedCount: 12,
      module: 'T&E',
      alertId: 'ALRT-100234',
      assignedTo: 'Sarah Williams'
    },
    {
      transactionId: 'TXN-240321',
      riskScore: 78,
      riskAmount: 1200,
      testsFailedCount: 8,
      module: 'T&E',
      alertId: 'ALRT-100876',
      assignedTo: 'Emily Carter'
    },
    {
      transactionId: 'TXN-251900',
      riskScore: 88,
      riskAmount: 4500,
      testsFailedCount: 21,
      module: 'T&E'
    },
    {
      transactionId: 'TXN-259832',
      riskScore: 75,
      riskAmount: 900,
      testsFailedCount: 4,
      module: 'T&E',
      alertId: 'ALRT-121010',
      assignedTo: 'Emily Carter'
    },
    {
      transactionId: 'TXN-260778',
      riskScore: 79,
      riskAmount: 1300,
      testsFailedCount: 6,
      module: 'T&E'
    },
    {
      transactionId: 'TXN-265450',
      riskScore: 92,
      riskAmount: 5000,
      testsFailedCount: 30,
      module: 'T&E'
    },
    {
      transactionId: 'TXN-270011',
      riskScore: 63,
      riskAmount: 700,
      testsFailedCount: 5,
      module: 'T&E'
    }
  ];

  // Associated Alerts data (similar structure but could have different data)
  associatedAlerts: AssociatedAlert[] = [
    {
      transactionId: 'TXN-100234',
      riskScore: 78,
      riskAmount: 1200,
      testsFailedCount: 1,
      module: 'Transaction',
      alertId: 'ALRT-100234',
      assignedTo: 'Sarah Williams',
      status: 'Resolved'
    },
    {
      transactionId: 'TXN-100876',
      riskScore: 82,
      riskAmount: 3500,
      testsFailedCount: 3,
      module: 'Multi-Transaction',
      alertId: 'ALRT-100876',
      assignedTo: 'David Brown',
      status: 'Escalated'
    },
    {
      transactionId: 'TXN-011542',
      riskScore: 85,
      riskAmount: 2000,
      testsFailedCount: 5,
      module: 'Entity',
      alertId: 'ALRT-011542',
      assignedTo: 'Michael Johnson',
      status: 'In Progress'
    },
    {
      transactionId: 'TXN-110987',
      riskScore: 90,
      riskAmount: 5000,
      testsFailedCount: 4,
      module: 'Multi-Transaction',
      alertId: 'ALRT-110987',
      assignedTo: 'Sarah Williams',
      status: 'Escalated'
    },
    {
      transactionId: 'TXN-121010',
      riskScore: 70,
      riskAmount: 800,
      testsFailedCount: 1,
      module: 'Transaction',
      alertId: 'ALRT-121010',
      assignedTo: 'Emily Carter',
      status: 'Resolved'
    },
    {
      transactionId: 'TXN-112567',
      riskScore: 88,
      riskAmount: 4500,
      testsFailedCount: 2,
      module: 'Multi-Transaction',
      alertId: 'ALRT-112567',
      assignedTo: 'David Brown',
      status: 'In Progress'
    },
    {
      transactionId: 'TXN-130320',
      riskScore: 92,
      riskAmount: 6700,
      testsFailedCount: 7,
      module: 'Entity',
      alertId: 'ALRT-130320',
      assignedTo: 'Michael Johnson',
      status: 'Escalated'
    },
    {
      transactionId: 'TXN-143456',
      riskScore: 75,
      riskAmount: 1500,
      testsFailedCount: 1,
      module: 'Transaction',
      alertId: 'ALRT-143456',
      assignedTo: 'Sarah Williams',
      status: 'Resolved'
    }
  ];

  activeTab: string = 'details';
  activeIcon: string = 'questionnaire';
  selectedAuditor: string = 'L1 Auditor';

  auditData: AuditData = {
    assignedTo: 'Michael Johnson',
    dueDate: '25 Apr 2025',
    priority: 'High',
    patternDetected: 'High-value transaction processed through emergency exception route without supporting evidence.',
    riskAssessment: {
      currentRiskScore: 85,
      testsFailedCount: 2,
      duplicateTransaction: true,
      personalExpenseClaimed: true,
      weekendTransaction: true
    },
    transactionDetails: {
      module: 'T&E',
      submodule: 'Expenses',
      phase: 2,
      riskAmount: 1500,
      transactionId: 'TXN-245678',
      reportNumber: 'REP-90876',
      transactionDate: '15 Mar 2024',
      lineItemDescription: 'Business-Class Flight Upgrade',
      paymentType: 'Corporate Credit Card',
      billingCurrency: 'USD',
      billingAmount: 1500,
      approvedBy: 'John Doe',
      approvedOn: '18 Mar 2024',
      paymentDate: '20 Mar 2024',
      paymentStatus: 'Paid'
    },
    transactionIdUnderReview: 'ALRT-000001',
    entitiesInvolved: 'Jane Smith, Luxury Airlines Inc.',
    testsFailedList: ['Personal Expense Claimed', 'Weekend Transaction'],
    identificationMethod: ''
  };

  isEntitylevel: boolean = false;
  isTransactionLevel: boolean = false;
  isMultiTransactionLevel: boolean = false;
  id: any;
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.id = this.route.snapshot.paramMap.get('type');
    console.log('Alert type:', this.id);
    this.id = this.route.snapshot.paramMap.get('type');
    console.log('Alert type:', this.id);
    if (this.id == "Entity") {
      this.isEntitylevel = true;
      this.isTransactionLevel = false;
      this.isMultiTransactionLevel = false;
    }
    if (this.id == "Transaction") {
      this.isEntitylevel = false;
      this.isTransactionLevel = true;
      this.isMultiTransactionLevel = false;
    }
    if (this.id == "Multi-Transaction") {
      this.isEntitylevel = false;
      this.isTransactionLevel = false;
      this.isMultiTransactionLevel = true;
    }
  }
  currentPage = 1;

  // Method to set current page
  setPage(page: number) {
    this.currentPage = page;
  }

  // Method to get current transaction
  get currentTransaction() {
    return this.transactions[this.currentPage - 1];
  }
  transactions: any[] = [
    { id: 'TXN-000001', amount: '$1,500', approvedBy: 'John Doe', status: 'Paid', date: 'Aug 14, 2025' },
    { id: 'TXN-000002', amount: '$2,200', approvedBy: 'Sarah Connor', status: 'In Progress', date: 'Aug 15, 2025' },
    { id: 'TXN-000003', amount: '$3,900', approvedBy: 'Michael Scott', status: 'Pending', date: 'Aug 16, 2025' }
  ];

  sections = [
    {
      id: 1,
      title: 'Initial Analysis & Validation',
      questions: [
        { text: 'List the Transaction ID(s) under review.', answer: 'ALRT-000001' },
        { text: 'Which entities are involved?', answer: 'Jane Smith, Luxury Airlines Inc.' },
        { text: 'List the tests failed.', answer: 'Personal Expense Claimed, Weekend Transaction' },
        { text: 'How was the transaction(s) identified?', answer: 'Risk Scoring & Judgmental Selection by RCM' }
      ]
    },
    {
      id: 2,
      title: 'Investigation & Findings',
      questions: [
        { text: 'Describe how the investigation was conducted.', answer: 'Reviewed supporting documents and policy compliance.' },
        { text: 'What evidence supports the findings?', answer: 'Expense receipts, employee emails, and manager approvals.' },
        { text: 'Were any exceptions noted?', answer: 'Yes, two transactions exceeded the approved limit.' }
      ]
    },
    {
      id: 3,
      title: 'Auditor Observations',
      questions: [
        { text: 'Summarize key audit observations.', answer: 'Expense submitted without valid business justification.' },
        { text: 'Highlight any red flags detected.', answer: 'Frequent weekend claims and duplicate expense entries.' },
        { text: 'Indicate actions taken by the auditor.', answer: 'Flagged transactions and notified finance department.' }
      ]
    },
    {
      id: 4,
      title: 'Final Recommendation',
      questions: [
        { text: 'Provide final recommendation.', answer: 'Expense to be disallowed and reported for review.' }
      ]
    }
  ];

  openSection: number | null = 1;

  toggleSection(id: number) {
    this.openSection = this.openSection === id ? null : id;
  }

  selectPage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  ngOnInit(): void {
    this.loadAuditData();
    this.filteredEvidenceItems = [...this.evidenceItems];
    this.currentRole = this.authService.currentUserValue;
    console.log('Transaction Alert Component initialized', this.currentRole.role);
    if (this.currentRole.role == 'L1 User') {
      this.disableEdit = true;
    }
  }

  onEscalate(): void {
    alert('Alert escalated successfully!');
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Resolved':
        return 'resolved';
      case 'Escalated':
        return 'escalated';
      case 'In Progress':
        return 'in-progress';
      default:
        return '';
    }
  }
  onResolve(): void {
    alert('Alert resolved successfully!');
  }
  goBack() {
    // Navigate back to the alerts list page
    this.router.navigate(['/alert']); // change '/alerts' to your actual route
  }
  setActiveIcon(iconName: string): void {
    this.activeIcon = iconName;
    console.log(`Active icon changed to: ${iconName}`);

    // Here you could add logic to load different data based on the icon
    switch (iconName) {
      case 'questionnaire':
        this.loadQuestionnaireData();
        break;
      case 'documents':
        this.loadDocumentsData();
        break;
      case 'search':
        this.loadSearchData();
        break;
      case 'notes':
        this.loadNotesData();
        break;
    }
  }

  /**
   * Sets the active tab in the navigation
   * @param tabName - The name of the tab to activate
   */
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    console.log(`Active tab changed to: ${tabName}`);

    // Here you could add logic to load different data based on the tab
    switch (tabName) {
      case 'details':
        this.loadDetailsTab();
        break;
      case 'transactions':
        this.loadTransactionsTab();
        break;
      case 'alerts':
        this.loadAlertsTab();
        break;
      case 'evidence':
        this.loadEvidenceTab();
        break;
    }
  }

  /**
   * Handles auditor selection change
   * @param event - The select change event
   */
  onAuditorChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedAuditor = target.value;
    console.log(`Auditor changed to: ${this.selectedAuditor}`);

    // Here you could add logic to handle auditor change
    this.handleAuditorChange(this.selectedAuditor);
  }

  /**
   * Handles identification method selection
   * @param method - The selected identification method
   */
  onIdentificationMethodChange(method: 'risk-scoring' | 'judgmental'): void {
    this.auditData.identificationMethod = method;
    console.log(`Identification method changed to: ${method}`);

    // Here you could add logic to save the selection
    this.saveIdentificationMethod(method);
  }

  /**
   * Gets the priority color class based on priority level
   * @returns CSS class name for priority styling
   */
  getPriorityClass(): string {
    switch (this.auditData.priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }

  /**
   * Formats date values for display
   * @param dateString - The date string to format
   * @returns Formatted date string
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Handles edit button click
   */
  onEditClick(): void {
    console.log('Edit button clicked');
    // Here you could add logic to enter edit mode
    this.enterEditMode();
  }

  /**
   * Handles action button clicks
   * @param action - The action type
   */
  onActionClick(action: string): void {
    console.log(`Action clicked: ${action}`);

    switch (action) {
      case 'copy':
        this.copyAuditDetails();
        break;
      case 'export':
        this.exportAuditDetails();
        break;
      case 'search':
        this.searchRelatedItems();
        break;
      case 'refresh':
        this.refreshAuditData();
        break;
    }
  }

  // Private methods for handling various operations

  private loadAuditData(): void {
    // Simulate loading audit data from a service
    console.log('Loading audit data...');
    // In a real application, this would be an HTTP call to get audit data
  }

  private loadQuestionnaireData(): void {
    console.log('Loading questionnaire data...');
    // Load questionnaire specific data
  }

  private loadDocumentsData(): void {
    console.log('Loading documents data...');
    // Load documents specific data
  }

  private loadSearchData(): void {
    console.log('Loading search data...');
    // Load search specific data
  }

  private loadNotesData(): void {
    console.log('Loading notes data...');
    // Load notes specific data
  }

  private loadDetailsTab(): void {
    console.log('Loading details tab data...');
    // Load details specific data
  }

  private loadTransactionsTab(): void {
    console.log('Loading transactions tab data...');
    // Load transaction specific data
  }

  private loadAlertsTab(): void {
    console.log('Loading alerts tab data...');
    // Load alerts specific data
  }

  private loadEvidenceTab(): void {
    console.log('Loading evidence tab data...');
    // Load evidence specific data
    this.filteredEvidenceItems = [...this.evidenceItems];
  }

  // Evidence-related methods
  addEvidence(): void {
    this.uploadedFiles = [];
    this.showUploadEvidencePopup = true;
  }

  exportEvidence(): void {
    console.log('Exporting evidence...');
    // Implementation for exporting evidence as PDF or Excel
  }

  getCompletedEvidenceCount(): number {
    return this.evidenceItems.filter(item => item.status === 'completed').length;
  }

  getPendingEvidenceCount(): number {
    return this.evidenceItems.filter(item => item.status === 'pending').length;
  }

  getRejectedEvidenceCount(): number {
    return this.evidenceItems.filter(item => item.status === 'rejected').length;
  }

  filterEvidence(): void {
    this.filteredEvidenceItems = this.evidenceItems.filter(item => {
      const statusMatch = !this.selectedStatus || item.status === this.selectedStatus;
      const typeMatch = !this.selectedType || item.type === this.selectedType;

      let dateMatch = true;
      if (this.startDate && this.endDate) {
        const itemDate = new Date(item.uploadDate);
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        dateMatch = itemDate >= startDate && itemDate <= endDate;
      }

      return statusMatch && typeMatch && dateMatch;
    });
  }

  getEvidenceIcon(type: string): string {
    switch (type) {
      case 'document':
        return 'bi bi-file-earmark-text';
      case 'screenshot':
        return 'bi bi-image';
      case 'email':
        return 'bi bi-envelope';
      case 'receipt':
        return 'bi bi-receipt';
      default:
        return 'bi bi-file-earmark';
    }
  }

  previewEvidence(evidence: EvidenceItem): void {
    console.log('Previewing evidence:', evidence.name);
    // Implementation for previewing evidence
  }

  downloadEvidence(evidence: EvidenceItem): void {
    console.log('Downloading evidence:', evidence.name);
    // Implementation for downloading evidence
  }

  editEvidence(evidence: EvidenceItem): void {
    console.log('Editing evidence:', evidence.name);
    // Implementation for editing evidence
  }

  deleteEvidence(evidence: EvidenceItem): void {
    console.log('Deleting evidence:', evidence.name);
    // Implementation for deleting evidence
    const index = this.evidenceItems.findIndex(item => item.id === evidence.id);
    if (index > -1) {
      this.evidenceItems.splice(index, 1);
      this.filterEvidence();
    }
  }

  showActions(evidence: EvidenceItem): void {
    console.log('Showing actions for evidence:', evidence.name);
    // Implementation for showing actions menu
  }

  toggleEvidenceMenu(evidence: EvidenceItem, event: MouseEvent): void {
    event.stopPropagation();
    this.openEvidenceMenuId = this.openEvidenceMenuId === evidence.id ? null : evidence.id;
  }

  closeEvidenceMenu(): void {
    this.openEvidenceMenuId = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.closeEvidenceMenu();
  }

  copyEvidenceLink(evidence: EvidenceItem): void {
    const linkToCopy = evidence.fileUrl || '';
    if (!linkToCopy) {
      console.warn('No file URL available to copy for', evidence.name);
      return;
    }
    if (navigator && 'clipboard' in navigator) {
      (navigator as any).clipboard.writeText(linkToCopy)
        .then(() => console.log('Evidence link copied to clipboard'))
        .catch(() => this.fallbackCopyTextToClipboard(linkToCopy));
    } else {
      this.fallbackCopyTextToClipboard(linkToCopy);
    }
  }

  private fallbackCopyTextToClipboard(text: string): void {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Evidence link copied (fallback)');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }

  // Evidence add flow - chooser overlay
  onEvidenceOverlayClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('popup-overlay')) {
      this.closeAllEvidencePopups();
    }
  }

  cancelUploadEvidence(): void {
    this.showUploadEvidencePopup = false;
    this.uploadedFiles = [];
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) { return; }
    this.uploadedFiles = Array.from(input.files);
  }

  onEvidenceDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onEvidenceDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onEvidenceDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (!files || !files.length) { return; }
    this.uploadedFiles = Array.from(files);
  }

  removeSelectedFile(index: number): void {
    if (index < 0 || index >= this.uploadedFiles.length) { return; }
    const next = [...this.uploadedFiles];
    next.splice(index, 1);
    this.uploadedFiles = next;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
    return `${value} ${sizes[i]}`;
  }

  confirmUploadEvidence(): void {
    if (!this.uploadedFiles.length) {
      this.cancelUploadEvidence();
      return;
    }
    const now = new Date();
    for (const file of this.uploadedFiles) {
      const newItem: EvidenceItem = {
        id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        transactionId: this.alert.transactionDetails.transactionId,
        name: file.name,
        type: 'document',
        status: 'completed',
        size: this.formatFileSize(file.size),
        uploadDate: now,
        description: '',
        tags: [],
        uploadedBy: 'You',
        fileUrl: ''
      };
      this.evidenceItems.unshift(newItem);
    }
    this.filterEvidence();
    this.cancelUploadEvidence();
  }

  cancelRequestEvidence(): void {
    this.showRequestEvidencePopup = false;
  }

  submitRequestEvidence(): void {
    // Placeholder for backend call to send request
    console.log('Requesting evidence from', this.requestEmail, 'due by', this.requestDueDate);
    this.cancelRequestEvidence();
  }

  cancelLinkEvidence(): void {
    this.showLinkEvidencePopup = false;
  }

  saveLinkEvidence(): void {
    if (!this.linkUrl.trim()) { return; }
    const name = this.linkName.trim() || this.linkUrl.split('/').pop() || 'Linked Evidence';
    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      transactionId: this.alert.transactionDetails.transactionId,
      name,
      type: 'document',
      status: 'completed',
      size: '-',
      uploadDate: new Date(),
      description: 'Linked evidence',
      tags: ['link'],
      uploadedBy: 'You',
      fileUrl: this.linkUrl.trim()
    };
    this.evidenceItems.unshift(newItem);
    this.filterEvidence();
    this.cancelLinkEvidence();
  }

  closeAllEvidencePopups(): void {
    this.showUploadEvidencePopup = false;
    this.showRequestEvidencePopup = false;
    this.showLinkEvidencePopup = false;
  }

  renameEvidence(evidence: EvidenceItem): void {
    this.renameTarget = evidence;
    this.renameFormName = evidence.name;
    this.showRenamePopup = true;
  }

  confirmRename(): void {
    if (!this.renameTarget) { return; }
    const trimmed = (this.renameFormName || '').trim();
    if (!trimmed) { return; }
    this.renameTarget.name = trimmed;
    // If filtered list is in use, trigger change detection refresh
    this.filterEvidence();
    this.closeRenamePopup();
  }

  cancelRename(): void {
    this.closeRenamePopup();
  }

  closeRenamePopup(): void {
    this.showRenamePopup = false;
    this.renameTarget = null;
    this.renameFormName = '';
  }

  onRenameOverlayClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('popup-overlay')) {
      this.closeRenamePopup();
    }
  }

  onRenameKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.renameFormName.trim()) {
      event.preventDefault();
      this.confirmRename();
    }
  }

  private handleAuditorChange(auditor: string): void {
    // Handle auditor change logic
    console.log(`Handling auditor change to: ${auditor}`);
    // Could trigger different UI states or data loading
  }

  private saveIdentificationMethod(method: string): void {
    // Save the identification method to backend
    console.log(`Saving identification method: ${method}`);
    // In real app, this would be an HTTP call
  }

  private enterEditMode(): void {
    // Enter edit mode for the audit details
    console.log('Entering edit mode...');
  }

  private copyAuditDetails(): void {
    // Copy audit details to clipboard
    console.log('Copying audit details...');
  }

  private exportAuditDetails(): void {
    // Export audit details as PDF or Excel
    console.log('Exporting audit details...');
  }

  private searchRelatedItems(): void {
    // Search for related audit items
    console.log('Searching related items...');
  }

  private refreshAuditData(): void {
    // Refresh the current audit data
    console.log('Refreshing audit data...');
    this.loadAuditData();
  }

  /**
   * Utility method to check if an icon is active
   * @param iconName - The icon name to check
   * @returns Boolean indicating if icon is active
   */
  isIconActive(iconName: string): boolean {
    return this.activeIcon === iconName;
  }

  /**
   * Utility method to check if a tab is active
   * @param tabName - The tab name to check
   * @returns Boolean indicating if tab is active
   */
  isTabActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  /**
   * Gets the tests failed as a formatted list
   * @returns Array of failed tests
   */
  getTestsFailedList(): string[] {
    return this.auditData.testsFailedList;
  }

  /**
   * Checks if identification method is selected
   * @param method - The method to check
   * @returns Boolean indicating if method is selected
   */
  isIdentificationMethodSelected(method: string): boolean {
    return this.auditData.identificationMethod === method;
  }
  removeAssignedAuditor(auditor: Auditor): void {
    auditor.assigned = undefined;
    auditor.selected = false;
  }

  onSaveEdit(): void {
    console.log('Saving alert details:', {
      auditors: this.auditors,
      formData: this.editFormData
    });
    this.showEditPopup = false;
    // Implement your save logic here

    // Close popup after save
    this.closeEditPopup();
  }

  onCancelEdit(): void {
    // Reset form data if needed
    this.closeEditPopup();
    this.showEditPopup = false;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
  }

  // Close popup when clicking outside
  // onPopupOverlayClick(event: Event): void {
  //   if (event.target === event.currentTarget) {
  //     this.closeEditPopup();
  //   }
  // }











  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getRiskScoreClass(score: number): string {
    if (score >= 90) return 'risk-high';
    if (score >= 70) return 'risk-medium';
    return 'risk-low';
  }

  onEdit(): void {
    this.showEditPopup = true;
  }

  onPopupOverlayClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('popup-overlay')) {
      this.showEditPopup = false;
    }
  }

  onAuditorToggle(auditor: Auditor): void {
    auditor.selected = !auditor.selected;
    if (!auditor.selected) {
      auditor.assigned = undefined;
    }
    console.log(`Auditor ${auditor.name} selection changed:`, auditor.selected);
  }

  // Optional: Add method to handle table actions
  onTableAction(action: string, item: EntityTransaction | AssociatedAlert): void {
    switch (action) {
      case 'add':
        console.log('Add action for:', item);
        break;
      case 'delete':
        console.log('Delete action for:', item);
        break;
      case 'more':
        console.log('More actions for:', item);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  // Optional: Method to filter or sort data
  filterTransactions(searchTerm: string): void {
    // Implement filtering logic for entity transactions
    console.log('Filtering transactions with term:', searchTerm);
  }

  filterAlerts(searchTerm: string): void {
    // Implement filtering logic for associated alerts
    console.log('Filtering alerts with term:', searchTerm);
  }



  toggleToolbar() {
    this.isToolbarVisible = !this.isToolbarVisible;
  }

  selectStyle(style: string) {
    this.selectedStyle = style;
    // Apply the selected style to the text
    this.applyTextStyle(style);
  }

  applyFormatting(format: string) {
    document.execCommand(format, false);
  }

  applyTextStyle(style: string) {
    // Logic to apply different text styles
    console.log(`Applying ${style} style`);

    // You can extend this method to apply actual styling
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // Apply styling based on the selected style
      switch (style) {
        case 'title':
          document.execCommand('fontSize', false, '7');
          break;
        case 'heading':
          document.execCommand('fontSize', false, '5');
          break;
        case 'subheading':
          document.execCommand('fontSize', false, '4');
          break;
        case 'body':
          document.execCommand('fontSize', false, '3');
          break;
        // Add list formatting for bulleted, dashed, numbered
      }
    }
  }

  // Navigate to OCR view
  navigateToOcrView(evidence: EvidenceItem): void {
    this.router.navigate(['/ocr-view'], {
      queryParams: {
        transactionId: evidence.transactionId,
        documentName: evidence.name
      }
    });
  }
}
