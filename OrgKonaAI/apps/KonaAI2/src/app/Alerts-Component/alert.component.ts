import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface Alert {
  id: string;
  riskScore: number;
  riskAmount: string;
  subModule: string;
  type: string;
  txnCount: number;
  createdBy: string;
  createdOn: string;
  dueOn: string;
  assignedTo?: string;
  status: string;
}

@Component({
  selector: 'app-alert',
  standalone:true,
   imports: [
    FormsModule,CommonModule 
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  activeTab = 'My Alerts';
  activeProcessTab = 'P2P'; // Track process tab separately
  assignFilter = 'all';
  sourceData: any = null;
  sourceType: string = '';
  selectedSubModule = '';
  sourceRowIndex: number = -1;
  currentUserRole = 'L1 User';

  subModules = ['Invoices', 'Purchase Orders', 'Payments'];

  alerts: Alert[] = [
    { id: 'ALRT-000002', riskScore: 85, riskAmount: '$15,000', subModule: 'Invoices', type: 'Transaction', txnCount: 1, createdBy: 'John Doe', createdOn: '01 Jan 2025', dueOn: '10 May 2025', assignedTo: 'Sarah Williams', status: 'Resolved' },
    { id: 'ALRT-000004', riskScore: 92, riskAmount: '$250,000', subModule: 'Invoices', type: 'Multi-Transaction', txnCount: 5, createdBy: 'Emma Stone', createdOn: '06 Apr 2025', dueOn: '06 Apr 2025', status: 'In Progress' },
    { id: 'ALRT-000011', riskScore: 78, riskAmount: '$75,000', subModule: 'Purchase Orders', type: 'Entity', txnCount: 3, createdBy: 'John Doe', createdOn: '28 Feb 2025', dueOn: '16 Apr 2025', assignedTo: 'Michael Johnson', status: 'In Progress' },
    { id: 'ALRT-000015', riskScore: 95, riskAmount: '$98,000', subModule: 'Invoices', type: 'Transaction', txnCount: 1, createdBy: 'John Doe', createdOn: '04 Jan 2025', dueOn: '04 Jul 2025', assignedTo: 'Sarah Williams', status: 'Escalated' },
    { id: 'ALRT-000025', riskScore: 72, riskAmount: '$32,000', subModule: 'Payments', type: 'Entity', txnCount: 1, createdBy: 'John Doe', createdOn: '20 Mar 2025', dueOn: '15 May 2025', status: 'In Progress' },
  ];

  // L1 user details - alerts created by or assigned to the current user
  l1UserAlerts: Alert[] = [
    { id: 'ALRT-000002', riskScore: 85, riskAmount: '$15,000', subModule: 'Invoices', type: 'Transaction', txnCount: 1, createdBy: 'John Doe', createdOn: '01 Jan 2025', dueOn: '10 May 2025', assignedTo: 'L1 User', status: 'Resolved' },
    { id: 'ALRT-000011', riskScore: 78, riskAmount: '$75,000', subModule: 'Purchase Orders', type: 'Entity', txnCount: 3, createdBy: 'John Doe', createdOn: '28 Feb 2025', dueOn: '16 Apr 2025', assignedTo: 'L1 User', status: 'In Progress' },
    { id: 'ALRT-000015', riskScore: 95, riskAmount: '$98,000', subModule: 'Invoices', type: 'Transaction', txnCount: 1, createdBy: 'John Doe', createdOn: '04 Jan 2025', dueOn: '04 Jul 2025', assignedTo: '', status: 'Escalated' },
    { id: 'ALRT-000020', riskScore: 88, riskAmount: '$45,000', subModule: 'Purchase Orders', type: 'Transaction', txnCount: 2, createdBy: 'John Doe', createdOn: '15 Mar 2025', dueOn: '30 Apr 2025', assignedTo: '', status: 'In Progress' },
  ];

  // L2 user details - alerts created by or assigned to the current user
  l2UserAlerts: Alert[] = [
    { id: 'ALRT-000003', riskScore: 90, riskAmount: '$120,000', subModule: 'Invoices', type: 'Transaction', txnCount: 1, createdBy: 'John Doe', createdOn: '02 Jan 2025', dueOn: '12 May 2025', assignedTo: 'L2 User', status: 'In Progress' },
    { id: 'ALRT-000012', riskScore: 82, riskAmount: '$85,000', subModule: 'Purchase Orders', type: 'Entity', txnCount: 4, createdBy: 'John Doe', createdOn: '01 Mar 2025', dueOn: '18 Apr 2025', assignedTo: 'L2 User', status: 'In Progress' },
    { id: 'ALRT-000016', riskScore: 88, riskAmount: '$105,000', subModule: 'Invoices', type: 'Transaction', txnCount: 1, createdBy: 'John Doe', createdOn: '05 Jan 2025', dueOn: '05 Jul 2025', assignedTo: '', status: 'Escalated' },
    { id: 'ALRT-000021', riskScore: 75, riskAmount: '$55,000', subModule: 'Payments', type: 'Transaction', txnCount: 2, createdBy: 'John Doe', createdOn: '16 Mar 2025', dueOn: '01 May 2025', assignedTo: '', status: 'In Progress' },
  ];
  
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {

  }

  ngOnInit() {
    // Get current user role from auth service
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUserRole = user.role;
      }
    });

    // Get query parameters from navigation
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.sourceData = JSON.parse(params['data']);
          this.sourceType = params['source'] || '';
          this.sourceRowIndex = parseInt(params['rowIndex']) || -1;
          
          console.log('Received source data for alerts:', this.sourceData);
          console.log('Source type:', this.sourceType);
          console.log('Row index:', this.sourceRowIndex);
          
          // You can use this data to filter or highlight relevant alerts
          this.filterAlertsBySource();
        } catch (error) {
          console.error('Error parsing source data:', error);
        }
      }
    });
  }

  private filterAlertsBySource() {
    if (!this.sourceData) return;
    
    // Example: Filter alerts based on source data
    // This could be enhanced to show only relevant alerts
    if (this.sourceData.type === 'vendor' && this.sourceData.vendorName) {
      console.log(`Filtering alerts for vendor: ${this.sourceData.vendorName}`);
      // You could implement vendor-specific filtering here
    } else if (this.sourceData.type === 'transaction' && this.sourceData.vendorName) {
      console.log(`Filtering alerts for transaction: ${this.sourceData.systemInvoice} - ${this.sourceData.vendorName}`);
      // You could implement transaction-specific filtering here
    }
  }
  
  get filteredAlerts() {
    // Determine which alerts to show based on active alert tab
    let alertsToFilter = this.alerts;
    
    if (this.activeTab === 'My Alerts') {
      alertsToFilter = this.getUserAlerts();
    } else if (this.activeTab === 'All Alerts') {
      alertsToFilter = this.alerts;
    }
    
    // Filter by process tab (P2P, T&E, O2C) if one is selected
    let processFilteredAlerts = alertsToFilter;
    if (this.activeProcessTab) {
      // Map process tabs to their corresponding submodules
      const processSubModules: { [key: string]: string[] } = {
        'P2P': ['Invoices', 'Purchase Orders', 'Payments'],
        'T&E': ['Travel', 'Expenses', 'Reimbursements'],
        'O2C': ['Orders', 'Invoices', 'Collections']
      };
      
      const allowedSubModules = processSubModules[this.activeProcessTab] || [];
      if (allowedSubModules.length > 0) {
        processFilteredAlerts = alertsToFilter.filter(alert => 
          allowedSubModules.includes(alert.subModule)
        );
      }
    }
    
    // Display filtered data - only filter by assignment status
    return processFilteredAlerts.filter(alert => {
      const assignMatch =
        this.assignFilter === 'all' ||
        (this.assignFilter === 'assigned' && !!alert.assignedTo) ||
        (this.assignFilter === 'unassigned' && !alert.assignedTo);
      return assignMatch;
    });
  }

  // Check if user is L1 User
  isL1User(): boolean {
    return this.currentUserRole === 'L1 User';
  }

  // Check if user is L2 User
  isL2User(): boolean {
    return this.currentUserRole === 'L2 User';
  }

  // Check if user is L1 User (for My Alerts tab visibility)
  isLimitedUser(): boolean {
    return this.currentUserRole === 'L1 User';
  }

  // Get alerts based on user role
  getUserAlerts(): Alert[] {
    if (this.currentUserRole === 'L1 User') {
      return this.l1UserAlerts;
    } else if (this.currentUserRole === 'L2 User') {
      return this.l2UserAlerts;
    }
    return this.alerts;
  }

  setTab(tab: string) {
    // Handle alert tabs (My Alerts, All Alerts)
    if (tab === 'My Alerts' || tab === 'All Alerts') {
      this.activeTab = tab;
      console.log(`${tab} tab selected - P2P is the default focus`);
    }
    // Handle process tabs (T&E, P2P, O2C)
    else if (tab === 'T&E' || tab === 'P2P' || tab === 'O2C') {
      this.activeProcessTab = tab;
      console.log(`Process tab ${tab} selected`);
    }
  }
  
  navigateToDetails(e: any) {
    this.router.navigate(['/alert/details', e]);
  }

  navigateToCreateAlert(alertId: string) {
    this.router.navigate(['/createalert'], { queryParams: { alertId: alertId } });
  }
  navigateCreateAlert() {
    this.router.navigate(['/createalert']);
  }
}