import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ExportPopupService } from './export-popup.service';
import { ExportPopupComponent } from './export-popup/export-popup.component';
import { ArchivePopupComponent, ArchivePopupData, ArchivePopupResult } from '../shared/components/archive-popup/archive-popup.component';
import { DataStagingHolisticComponent } from '../data-staging-holistic/data-staging-holistic.component';

interface DataQualityIssue {
  id: string;
  description: string;
  recordCount: number;
  impact: 'High' | 'Medium' | 'Low';
  possibleFix: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
}

interface ProjectCard {
  id: string;
  title: string;
  shortTitle: string;
  completedSteps: number;
  totalSteps: number;
  borderColor: string;
  backgroundColor: string;
  progressColor: string;
  icon: string;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  status: 'completed' | 'active' | 'pending';
  backgroundColor: string;
  borderColor: string;
  iconBackground: string;
  iconColor: string;
  titleColor: string;
  descriptionColor: string;
  titleSize: string;
  descriptionSize: string;
  hasCheckmark: boolean;
}

interface DataTableRow {
  id: string;
  submodule: string;
  sourceSystem: string;
  recordCount: number;
  fileName: string;
  uploadedOn: string;
  modifiedOn: string;
  status: 'completed' | 'in-progress' | 'failed';
  statusText: string;
  statusColor: string;
  statusBackground: string;
  statusIcon: string;
  hasExport: boolean;
  hasArchive: boolean;
  hasDetail: boolean;
  detailId: string;
}

interface StatusSummary {
  completed: number;
  failed: number;
  pending: number;
}

@Component({
  selector: 'app-data-quality',
  standalone: true,
  imports: [CommonModule, ExportPopupComponent, ArchivePopupComponent, DataStagingHolisticComponent],
  templateUrl: './data-quality.component.html',
  styleUrls: ['./data-quality.component.scss']
})
export class DataQualityComponent implements OnInit {
  isSidebarPinned: boolean = false;
  activeTab: 'open' | 'resolved' = 'open';
  selectedCategory: string = 'impacts-reporting';
  showPopup = false;
  stage = 'quality';
  popupData: ArchivePopupData = {
    title: 'Archive Data',
    message: 'Do you really want to archive',
    itemName: '',
    confirmText: 'Archive',
    cancelText: 'Cancel'
  };
  // Project Cards Data
  projectCards: ProjectCard[] = [
    {
      id: 'p2p',
      title: 'P2P (Procure to Pay)',
      shortTitle: 'P2P (Procure to Pay)',
      completedSteps: 2,
      totalSteps: 5,
      borderColor: 'border-blue-600',
      backgroundColor: 'bg-blue-50',
      progressColor: 'bg-blue-700',
      icon: 'M6 18L18 6M6 6l12 12'
    },
    {
      id: 'o2c',
      title: 'O2C (Order to Cash)',
      shortTitle: 'O2C (Order to Cash)',
      completedSteps: 0,
      totalSteps: 5,
      borderColor: 'border-gray-300',
      backgroundColor: 'bg-white',
      progressColor: 'bg-blue-700',
      icon: 'M6 18L18 6M6 6l12 12'
    },
    {
      id: 'te',
      title: 'T&E (Travel & Expense)',
      shortTitle: 'T&E (Travel & Expense)',
      completedSteps: 0,
      totalSteps: 5,
      borderColor: 'border-gray-300',
      backgroundColor: 'bg-white',
      progressColor: 'bg-blue-700',
      icon: 'M6 18L18 6M6 6l12 12'
    }
  ];

  // Process Steps Data
  processSteps: ProcessStep[] = [
    {
      id: 'import',
      title: 'Data Import',
      description: 'Import Your Data Here',
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      isActive: false,
      isCompleted: true,
      status: 'completed',
      backgroundColor: 'bg-white',
      borderColor: 'border-r border-gray-200',
      iconBackground: 'bg-gradient-to-b from-[#fdffff] to-[#e9ffef] border-2 border-[#01912a]',
      iconColor: 'text-[#01912a]',
      titleColor: 'text-[#1c1c1c]',
      descriptionColor: 'text-[#1c1c1c]',
      titleSize: 'text-[20px]',
      descriptionSize: 'text-[14px]',
      hasCheckmark: true
    },
    {
      id: 'quality',
      title: 'Data Quality',
      description: 'Reviews The Data',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      isActive: true,
      isCompleted: false,
      status: 'active',
      backgroundColor: 'bg-gradient-to-r from-[#c4dbfa] to-transparent',
      borderColor: '',
      iconBackground: 'bg-[#082d78] shadow-[0px_2.867px_10.033px_0px_#80abe6]',
      iconColor: 'text-white',
      titleColor: 'text-[#082d78]',
      descriptionColor: 'text-[#082d78]',
      titleSize: 'text-[18px]',
      descriptionSize: 'text-[14px]',
      hasCheckmark: false
    },
    {
      id: 'staging',
      title: 'Data Staging',
      description: 'Ensures Data Accuracy',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
      isActive: false,
      isCompleted: false,
      status: 'pending',
      backgroundColor: 'bg-white',
      borderColor: '',
      iconBackground: 'bg-gradient-to-b from-[#dde3e9] from-[27.184%] to-[#fdffff] border-[1.593px] border-[#c9d6e0]',
      iconColor: 'text-[#8597a4]',
      titleColor: 'text-[#65717d]',
      descriptionColor: 'text-[#65717d]',
      titleSize: 'text-[18px]',
      descriptionSize: 'text-[14px]',
      hasCheckmark: false
    },
    {
      id: 'validation',
      title: 'Data Validation',
      description: 'Validate Records',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      isActive: false,
      isCompleted: false,
      status: 'pending',
      backgroundColor: 'bg-white',
      borderColor: '',
      iconBackground: 'bg-gradient-to-b from-[#dde3e9] from-[27.184%] to-[#fdffff] border-[1.593px] border-[#c9d6e0]',
      iconColor: 'text-[#8597a4]',
      titleColor: 'text-[#65717d]',
      descriptionColor: 'text-[#65717d]',
      titleSize: 'text-[18px]',
      descriptionSize: 'text-[14px]',
      hasCheckmark: false
    },
    {
      id: 'mapping',
      title: 'Data Mapping',
      description: 'Prepares Data For Use',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      isActive: false,
      isCompleted: false,
      status: 'pending',
      backgroundColor: 'bg-white',
      borderColor: '',
      iconBackground: 'bg-gradient-to-b from-[#dde3e9] from-[27.184%] to-[#fdffff] border-[1.593px] border-[#c9d6e0]',
      iconColor: 'text-[#8597a4]',
      titleColor: 'text-[#65717d]',
      descriptionColor: 'text-[#65717d]',
      titleSize: 'text-[18px]',
      descriptionSize: 'text-[14px]',
      hasCheckmark: false
    }
  ];

  // Data Table Data
  dataTableRows: DataTableRow[] = [
    {
      id: '1',
      submodule: 'Invoices',
      sourceSystem: 'SAP',
      recordCount: 1250,
      fileName: 'invoice_jan2025.csv',
      uploadedOn: '10 Jun 2025',
      modifiedOn: '12 Jun 2025',
      status: 'in-progress',
      statusText: 'In Progress',
      statusColor: 'text-yellow-800',
      statusBackground: 'bg-yellow-100',
      statusIcon: 'M5 13l4 4L19 7',
      hasExport: true,
      hasArchive: true,
      hasDetail: true,
      detailId: 'BSAK-44'
    },
    {
      id: '2',
      submodule: 'Payments',
      sourceSystem: 'Oracle',
      recordCount: 1450,
      fileName: 'payments_batch1.csv',
      uploadedOn: '12 Jun 2025',
      modifiedOn: '13 Jun 2025',
      status: 'failed',
      statusText: 'Failed',
      statusColor: 'text-red-800',
      statusBackground: 'bg-red-100',
      statusIcon: 'M6 18L18 6M6 6l12 12',
      hasExport: true,
      hasArchive: true,
      hasDetail: true,
      detailId: 'BSAK-45'
    },
    {
      id: '3',
      submodule: 'Purchase Order',
      sourceSystem: 'SAP',
      recordCount: 875,
      fileName: 'po_q1.csv',
      uploadedOn: '13 Jun 2025',
      modifiedOn: '13 Jun 2025',
      status: 'completed',
      statusText: 'Completed',
      statusColor: 'text-green-800',
      statusBackground: 'bg-green-100',
      statusIcon: 'M5 13l4 4L19 7',
      hasExport: true,
      hasArchive: true,
      hasDetail: true,
      detailId: ''
    },
    {
      id: '4',
      submodule: 'Purchase Order',
      sourceSystem: 'Oracle',
      recordCount: 720,
      fileName: 'po_q2.csv',
      uploadedOn: '13 Jun 2025',
      modifiedOn: '13 Jun 2025',
      status: 'completed',
      statusText: 'Completed',
      statusColor: 'text-green-800',
      statusBackground: 'bg-green-100',
      statusIcon: 'M5 13l4 4L19 7',
      hasExport: true,
      hasArchive: true,
      hasDetail: true,
      detailId: ''
    }
  ];

  // Status Summary
  statusSummary: StatusSummary = {
    completed: 3,
    failed: 1,
    pending: 1
  };

  dataQualityIssues: DataQualityIssue[] = [
    {
      id: 'BSAK-44',
      description: 'Missing Key Fields',
      recordCount: 10630,
      impact: 'High',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-45',
      description: 'Missing Key Fields',
      recordCount: 10290,
      impact: 'Medium',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-46',
      description: 'Missing Key Fields',
      recordCount: 286,
      impact: 'High',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-47',
      description: 'Missing Key Fields',
      recordCount: 53002,
      impact: 'Medium',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-48',
      description: 'Missing Key Fields',
      recordCount: 10630,
      impact: 'Medium',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-49',
      description: 'Missing Key Fields',
      recordCount: 10290,
      impact: 'High',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-50',
      description: 'Missing Key Fields',
      recordCount: 266,
      impact: 'High',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-51',
      description: 'Missing Key Fields',
      recordCount: 54453,
      impact: 'Medium',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-52',
      description: 'Missing Key Fields',
      recordCount: 10234,
      impact: 'Medium',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    },
    {
      id: 'BSAK-53',
      description: 'Missing Key Fields',
      recordCount: 234,
      impact: 'Medium',
      possibleFix: 'Fix or Re-extract',
      status: 'Pending'
    }
  ];

  projectName: string = '';
  showHolisticView: boolean = false;
successCount: number = 9;
errorCount: number = 0;
warningCount: number = 6;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private exportPopupService: ExportPopupService,
  ) {}

  ngOnInit() {
    // Get project name from query parameters
    this.route.queryParams.subscribe(params => {
      this.projectName = params['projectName'] || '';
    });
  }

  // Helper methods
  getProgressPercentage(completed: number, total: number): number {
    return total > 0 ? (completed / total) * 100 : 0;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'M5 13l4 4L19 7';
      case 'failed':
        return 'M6 18L18 6M6 6l12 12';
      case 'in-progress':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'in-progress':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  }

  getStatusIconBackground(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  setActiveTab(tab: 'open' | 'resolved') {
    this.activeTab = tab;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Filter issues based on category if needed
  }

  navigateToDetail(issueId: string) {
    this.router.navigate(['/data-quality-detail', issueId]);
  }

  goBack() {
    // Navigate back to data import with project name
    if (this.projectName) {
      this.router.navigate(['/data'], {
        queryParams: { projectName: this.projectName }
      });
    } else {
      this.location.back();
    }
  }

  openExportPopup() {
    this.exportPopupService.openExportPopup('P2P');
  }

  openArchivePopup(itemName: string) {
    this.popupData = { ...this.popupData, itemName };
    this.showPopup = true;
  }
  handlePopupResult(result: ArchivePopupResult) {
    this.showPopup = false;

    if (result.confirmed) {
      console.log('Archiving:', result.data?.itemName);
      // call archive API
    } else {
      console.log('Archive cancelled');
    }
  }

  navigateToDataStaging() {
    // Navigate to data import with staging section active
    if (this.projectName) {
      this.router.navigate(['/data',""], {
        queryParams: { projectName: this.projectName, section: 'staging' }
      });
    } else {
      this.router.navigate(['/data',""], {
        queryParams: { section: 'staging' }
      });
    }
  }

  navigateToDataImport() {
    // Navigate to data import with import section active
    if (this.projectName) {
      this.router.navigate(['/data',""], {
        queryParams: { projectName: this.projectName, section: 'import' }
      });
    } else {
      this.router.navigate(['/data',""], {
        queryParams: { section: 'import' }
      });
    }
  }

  navigateToDataValidation() {
    // Navigate to data import with validation section active
    if (this.projectName) {
      this.router.navigate(['/data',""], {
        queryParams: { projectName: this.projectName, section: 'validation' }
      });
    } else {
      this.router.navigate(['/data',""], {
        queryParams: { section: 'validation' }
      });
    }
  }

  navigateToDataMapping() {
    // Navigate to data import with mapping section active
    if (this.projectName) {
      this.router.navigate(['/data',""], {
        queryParams: { projectName: this.projectName, section: 'mapping' }
      });
    } else {
      this.router.navigate(['/data',""], {
        queryParams: { section: 'mapping' }
      });
    }
  }

  navigateToDataQuality() {
    console.log('Already on Data Quality page');
  }

  getStepNavigationMethod(stepId: string): () => void {
    switch (stepId) {
      case 'import':
        return this.navigateToDataImport.bind(this);
      case 'quality':
        return this.navigateToDataQuality.bind(this);
      case 'staging':
        return this.navigateToDataStaging.bind(this);
      case 'validation':
        return this.navigateToDataValidation.bind(this);
      case 'mapping':
        return this.navigateToDataMapping.bind(this);
      default:
        return () => console.log('Unknown step:', stepId);
    }
  }
  onHolisticViewClick(): void {
    this.showHolisticView = true;
  }
  goToStep(data: any) {
    this.showHolisticView = false;
  }
}
