import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../auth/auth.service';

interface Transaction {
  systemInvoice: string;
  vendorName: string;
  invoiceType: string;
  invoiceDate: string;
  selected?: boolean;
}

interface Auditor {
  id: string;
  name: string;
}

interface Questionnaire {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-create-alert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-alert.component.html',
  styleUrl: './create-alert.component.scss'
})
export class CreateAlertComponent implements AfterViewInit, OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  @ViewChild('mainContent', { static: false }) mainContent!: ElementRef;
  @ViewChild('sidebar', { static: false }) sidebar!: ElementRef;
  @ViewChild('alertDetailsSection', { static: false }) alertDetailsSection!: ElementRef;
  @ViewChild('assignMembersSection', { static: false }) assignMembersSection!: ElementRef;
  @ViewChild('questionnaireSection', { static: false }) questionnaireSection!: ElementRef;

  activeSection = 'alert-details';
  
  // Step 1 - Alert Details
  selectedTransactions: Transaction[] = [
    {
      systemInvoice: 'SYS-6500000130A',
      vendorName: 'MOBIL PNG GAS HOLDI...',
      invoiceType: 'NE-Vendor Invoice gross',
      invoiceDate: 'Apr 21 Op Su'
    },
    {
      systemInvoice: 'SYS-6500000130A',
      vendorName: 'Cenveon LLC',
      invoiceType: 'NE-Vendor Invoice gross',
      invoiceDate: 'Field Operati'
    },
    {
      systemInvoice: 'SYS-6500000130A',
      vendorName: 'Emmerich and Sons',
      invoiceType: 'NE-Vendor Invoice gross',
      invoiceDate: 'Equipment R'
    },
    {
      systemInvoice: 'SYS-6500000130S',
      vendorName: 'Hammes, Leannon and...',
      invoiceType: 'NE-Vendor Invoice gross',
      invoiceDate: 'Logistics Su'
    },
    {
      systemInvoice: 'SYS-6500000130T',
      vendorName: 'Goldner, Cummerata an...',
      invoiceType: 'NE-Vendor Invoice gross',
      invoiceDate: 'Professional'
    },
    {
      systemInvoice: 'SYS-6500000130S',
      vendorName: 'Dach, Pollich and Kozey...',
      invoiceType: 'NE-Vendor Invoice gross',
      invoiceDate: 'Logistics Su'
    }
  ];

  // Fixed default values to ensure proper validation
  alertType = '';
  startDate = '';
  endDate = '';
  alertId = 'ALRT-000004';
  riskScore = 92.07;
  riskAmount = '$250,000';
  selectPriority = '';
  comments = '';

  // Step 2 - Assign Members - Fixed default values
  availableAuditors: Auditor[] = [
    { id: 'sara-thomas', name: 'Sara Thomas' },
    { id: 'sara-nakamura', name: 'Sara Nakamura' },
    { id: 'sarah-williams', name: 'Sarah Williams' },
    { id: 'sarah-fernandes', name: 'Sarah Fernandes' }
  ];

  l1Auditor = '';
  l1AuditorEnabled = false;
  l2Auditor = '';
  l2AuditorEnabled = false;
  l3Auditor: string[] = [];
  l3AuditorEnabled = false;

  searchTerm = '';
  showDropdown = false;
  patternsDetected = true;
  recommendedAssignment = 'John, who is already investigating the related issue.';

  // Step 3 - Add Questionnaire
  questionnaires: Questionnaire[] = [
    { name: 'Fraud Investigation Checklist', icon: 'visibility' },
    { name: 'Vendor Risk Assessment', icon: 'visibility' },
    { name: 'Employee Expense Review', icon: 'visibility' },
    { name: 'Transaction Anomaly Analysis', icon: 'visibility' },
    { name: 'Incident Investigation Form', icon: 'visibility' },
    { name: 'Policy Violation Review', icon: 'visibility' }
  ];

  l1QuestionnaireFile = '';
  l2QuestionnaireFile = '';
  l3QuestionnaireFile = '';

  // Completion tracking
  alertDetailsComplete = false;
  assignMembersComplete = false;

  ngOnInit() {
    // Get query parameters from navigation
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          const transactionData = JSON.parse(params['data']);
          const source = params['source'];
          const rowIndex = params['rowIndex'];
          
          console.log('Received transaction data:', transactionData);
          console.log('Source:', source);
          console.log('Row index:', rowIndex);
          
          // Pre-populate form with transaction data
          this.prePopulateForm(transactionData, source);
        } catch (error) {
          console.error('Error parsing transaction data:', error);
        }
      }
    });
  }

  private prePopulateForm(transactionData: any, source: string) {
    // Handle both single objects and arrays
    const dataArray = Array.isArray(transactionData) ? transactionData : [transactionData];
    
    if (source === 'entity-profiling') {
      // Pre-populate with vendor data
      if (dataArray.length > 0) {
        const vendorNames = dataArray.map(vendor => vendor.vendorName).join(', ');
        this.comments = `Alert created for vendor(s): ${vendorNames}`;
        
        // Use the highest risk score if multiple vendors
        const maxRiskScore = Math.max(...dataArray.map(vendor => vendor.riskScore || 0));
        if (maxRiskScore > 0) {
          this.riskScore = maxRiskScore;
        }
      }
    } else if (source === 'transaction-details' || source === 'transaction-view') {
      // Pre-populate with transaction data
      if (dataArray.length > 0) {
        const transactionInfo = dataArray.map(transaction => 
          `${transaction.systemInvoice} - ${transaction.vendorName}`
        ).join(', ');
        
        this.comments = `Alert created for transaction(s): ${transactionInfo}`;
        
        // Add descriptions if available
        const descriptions = dataArray
          .filter(transaction => transaction.invoiceDescription)
          .map(transaction => transaction.invoiceDescription);
        
        if (descriptions.length > 0) {
          this.comments += `\nDescription(s): ${descriptions.join(', ')}`;
        }
      }
    }
  }

  ngAfterViewInit() {
    // Set initial active section on view init
    this.updateActiveSection();
    // Check initial completion status
    this.updateCompletionStatus();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSidebarPosition();
  }

  onScroll() {
    this.updateActiveSection();
    this.updateSidebarPosition();
  }

  private updateActiveSection() {
    if (!this.mainContent) return;

    const scrollTop = this.mainContent.nativeElement.scrollTop;
    const sections = [
      { id: 'alert-details', element: this.alertDetailsSection },
      { id: 'assign-members', element: this.assignMembersSection },
      { id: 'questionnaire', element: this.questionnaireSection }
    ];

    let currentSection = 'alert-details';
    
    for (const section of sections) {
      if (section.element && section.element.nativeElement) {
        const offsetTop = section.element.nativeElement.offsetTop - 100; // 100px offset for better UX
        if (scrollTop >= offsetTop) {
          currentSection = section.id;
        }
      }
    }

    if (this.activeSection !== currentSection) {
      this.activeSection = currentSection;
    }
  }

  private updateSidebarPosition() {
    if (window.innerWidth <= 1024) {
      // Mobile/tablet behavior - sidebar stays at top
      return;
    }

    // Desktop behavior - sidebar follows scroll
    if (this.sidebar && this.mainContent) {
      const scrollTop = this.mainContent.nativeElement.scrollTop;
      const maxScroll = this.mainContent.nativeElement.scrollHeight - this.mainContent.nativeElement.clientHeight;
      const scrollPercentage = Math.min(scrollTop / Math.max(maxScroll, 1), 1);
      
      // Adjust sidebar position based on scroll
      const maxTranslateY = 50; // Maximum pixels to translate
      const translateY = scrollPercentage * maxTranslateY;
      
      this.sidebar.nativeElement.style.transform = `translateY(${translateY}px)`;
    }
  }

  private updateCompletionStatus() {
    // Alert Details - Check if ALL required fields are properly filled
    this.alertDetailsComplete = !!(
      this.alertType && 
      this.alertType.trim() !== '' &&
      this.startDate && 
      this.startDate.trim() !== '' &&
      this.endDate && 
      this.endDate.trim() !== '' &&
      this.selectPriority &&
      this.selectPriority.trim() !== ''
    );

    // Assign Members - Check if at least one auditor level is enabled AND has actual auditors assigned
    const hasL1Auditor = this.l1AuditorEnabled && this.l1Auditor && this.l1Auditor.trim() !== '';
    const hasL2Auditor = this.l2AuditorEnabled && this.l2Auditor && this.l2Auditor.trim() !== '';
    const hasL3Auditor = this.l3AuditorEnabled && this.l3Auditor && this.l3Auditor.length > 0;

    this.assignMembersComplete = hasL1Auditor || hasL2Auditor || hasL3Auditor;
  }

  // Add this method to handle form field changes
  onFormFieldChange() {
    this.updateCompletionStatus();
  }

  scrollToSection(sectionId: string) {
    const sectionMap: { [key: string]: ElementRef } = {
      'alert-details': this.alertDetailsSection,
      'assign-members': this.assignMembersSection,
      'questionnaire': this.questionnaireSection
    };

    const section = sectionMap[sectionId];
    if (section && section.nativeElement && this.mainContent) {
      const offsetTop = section.nativeElement.offsetTop - 20; // Small offset from top
      this.mainContent.nativeElement.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  createAlert() {
    // Handle alert creation
    console.log('Creating alert with data:', {
      alertType: this.alertType,
      startDate: this.startDate,
      endDate: this.endDate,
      alertId: this.alertId,
      riskScore: this.riskScore,
      riskAmount: this.riskAmount,
      priority: this.selectPriority,
      comments: this.comments,
      auditors: {
        l1: { enabled: this.l1AuditorEnabled, auditor: this.l1Auditor },
        l2: { enabled: this.l2AuditorEnabled, auditor: this.l2Auditor },
        l3: { enabled: this.l3AuditorEnabled, auditors: this.l3Auditor }
      },
      questionnaires: {
        l1: this.l1QuestionnaireFile,
        l2: this.l2QuestionnaireFile,
        l3: this.l3QuestionnaireFile
      }
    });
    let item = localStorage.getItem('loggedInUser');
    let data = null
    if (item) {
      data = JSON.parse(item);
    }
    if (data.role == 'L1 User') {
     this.router.navigate(['/ProjectWorkflow/1?pfTab=alert']);
    }
    if (data.role == 'L2 User') {
      this.router.navigate(['/alert']);
    }
    // if (data.role == 'Client Admin') {
    //   this.router.navigate(['/projects/alerts']);
    // }
  }

  cancel() {
    // Handle cancel action
    console.log('Alert creation cancelled');
    let item = localStorage.getItem('loggedInUser');
    let data = null
    if (item) {
      data = JSON.parse(item);
    }
     if (data.role == 'Client Admin') {
     this.router.navigate(['/alert']);
    }
    if (data.role == 'L1 User') {
     this.router.navigate(['/ProjectWorkflow/1?pfTab=alert']);
    }
    if (data.role == 'L2 User') {
      this.router.navigate(['/alert']);
    }
    //  if (data.role == 'Client Admin') {
    //   this.router.navigate(['/projects/alerts']);
    // }
  }

  toggleL1Auditor() {
    this.l1AuditorEnabled = !this.l1AuditorEnabled;
    if (!this.l1AuditorEnabled) {
      this.l1Auditor = '';
    }
    this.updateCompletionStatus();
  }

  toggleL2Auditor() {
    this.l2AuditorEnabled = !this.l2AuditorEnabled;
    if (!this.l2AuditorEnabled) {
      this.l2Auditor = '';
    }
    this.updateCompletionStatus();
  }

  toggleL3Auditor() {
    this.l3AuditorEnabled = !this.l3AuditorEnabled;
    if (!this.l3AuditorEnabled) {
      this.l3Auditor = [];
    }
    this.updateCompletionStatus();
  }

  // Add method to handle L1 auditor assignment
  onL1AuditorChange() {
    this.updateCompletionStatus();
  }

  // Add method to handle L2 auditor assignment
  onL2AuditorChange() {
    this.updateCompletionStatus();
  }

  removeL3Auditor(auditor: string) {
    this.l3Auditor = this.l3Auditor.filter(a => a !== auditor);
    this.updateCompletionStatus();
  }

  addL3Auditor(auditor: string) {
    if (!this.l3Auditor.includes(auditor)) {
      this.l3Auditor.push(auditor);
    }
    this.searchTerm = '';
    this.showDropdown = false;
    this.updateCompletionStatus();
  }

  onSearchChange() {
    this.showDropdown = this.searchTerm.length > 0;
  }

  getFilteredAuditors() {
    return this.availableAuditors.filter(auditor => 
      auditor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      !this.l3Auditor.includes(auditor.name)
    );
  }

  onFileSelected(event: any, level: string) {
    const file = event.target.files[0];
    if (file) {
      switch (level) {
        case 'l1':
          this.l1QuestionnaireFile = file.name;
          break;
        case 'l2':
          this.l2QuestionnaireFile = file.name;
          break;
        case 'l3':
          this.l3QuestionnaireFile = file.name;
          break;
      }
    }
  }

  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return this.alertDetailsComplete;
      case 2:
        return this.assignMembersComplete;
      case 3:
        return false; // Can add logic for questionnaire completion if needed
      default:
        return false;
    }
  }

  // Enhanced methods for better step management (similar to project-creation)
  isStepActive(step: number): boolean {
    const sectionMap = ['alert-details', 'assign-members', 'questionnaire'];
    return this.activeSection === sectionMap[step];
  }

  goToStep(step: number): void {
    const sectionIds = ['alert-details', 'assign-members', 'questionnaire'];
    const targetSection = sectionIds[step];
    
    if (targetSection) {
      this.scrollToSection(targetSection);
    }
  }

  // Enhanced completion check methods
  canNavigateToStep(step: number): boolean {
    switch (step) {
      case 0: // Alert Details
        return true;
      case 1: // Assign Members
        return this.isStepCompleted(1);
      case 2: // Questionnaire
        return this.isStepCompleted(1) && this.isStepCompleted(2);
      default:
        return false;
    }
  }
}