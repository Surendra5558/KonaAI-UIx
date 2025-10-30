import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { DataStagingComponent } from "../data-staging/data-staging.component";
import { DatamappingComponent } from "../datamapping/datamapping.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IntegrationPopupComponent } from '../integration-popup/integration-popup.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DataValidationComponent } from '../data-validations/data-validation.component';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { DataStagingHolisticComponent } from '../data-staging-holistic/data-staging-holistic.component';
import { DeletePopupComponent, DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';
import { TopBarComponent } from '../TopBar/top-bar.component';
import { DataQualityComponent } from "../data-quality/data-quality.component";

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  route: string;
}

interface DataFile {
  id?: string;
  submodule: string;
  sourceSystem: string;
  fileName: string;
  uploadedOn: Date;
  modifiedOn: Date;
  status: 'success' | 'error' | 'warning';
}

interface SelectedFile {
  file: File;
  name: string;
  size: string;
  type: string;
}

@Component({
  selector: 'app-data-import',
  standalone: true,
  imports: [CommonModule, FormsModule, IntegrationPopupComponent, TopBarComponent, MatDialogModule, MatButtonModule, DataStagingComponent, DatamappingComponent, DataValidationComponent, DataStagingHolisticComponent, DeletePopupComponent, DataQualityComponent],
  templateUrl: './data_import.component.html',
  styleUrls: ['./data_import.component.scss']
})
export class DataImportComponent implements OnInit, OnDestroy {
  showStepsConfirmationModal: boolean = false;
  isStepsExecuting: boolean = false;
  showDeletePopup = false;
  deleteData: DeletePopupData = {
    title: 'Delete File',
    message: 'Are you sure you want to delete',
    itemName: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };
  // Steps execution output events
  @Output() stepsExecutionStarted = new EventEmitter<void>();
  @Output() stepsExecutionCompleted = new EventEmitter<boolean>();
  @Output() stepsExecutionCancelled = new EventEmitter<void>();

  // Keyboard event listener reference
  private stepsKeydownListener: (event: KeyboardEvent) => void;

  showPrivilegedModal: boolean = false;
  showHolisticView: boolean = false;
  privilegedData: any = {
    "fileInfo": {
      "title": "Privileged & Confidential- Appendix_Updated.xlsx Preview",
      "sourceTemplate": "Template A",
      "classification": "PRIVILEGED & CONFIDENTIAL",
      "lastUpdated": "2025-08-11T14:30:00Z"
    },
    "tableData": [
      {
        "id": "1234",
        "firstName": "Carla",
        "lastName": "Bator",
        "mobile": "9876543210",
        "city": "Miami",
        "state": "Florida",
        "zipcode": "12345",
        "dob": "09/07/1994",
        "status": "Active",
        "sensitive": true
      },
      {
        "id": "2341",
        "firstName": "Ryan",
        "lastName": "Rosser",
        "mobile": "9876543211",
        "city": "Cary",
        "state": "NC",
        "zipcode": "23452",
        "dob": "10/01/1972",
        "status": "Inactive",
        "sensitive": true
      },
      {
        "id": "5234",
        "firstName": "Jaylon",
        "lastName": "Siphron",
        "mobile": "9176543210",
        "city": "Houston",
        "state": "Texas",
        "zipcode": "45678",
        "dob": "15/08/1983",
        "status": "Hold",
        "sensitive": false
      },
      {
        "id": "4632",
        "firstName": "Ann",
        "lastName": "Philips",
        "mobile": "9876443210",
        "city": "Chicago",
        "state": "Illinois",
        "zipcode": "46573",
        "dob": "09/10/1991",
        "status": "Active",
        "sensitive": true
      },
      {
        "id": "2354",
        "firstName": "Cristofer",
        "lastName": "Press",
        "mobile": "9876543214",
        "city": "NY City",
        "state": "NY",
        "zipcode": "12325",
        "dob": "01/12/1972",
        "status": "Inactive",
        "sensitive": true
      },
      {
        "id": "6544",
        "firstName": "Nolan",
        "lastName": "Curtis",
        "mobile": "9875543210",
        "city": "Phoenix",
        "state": "Arizona",
        "zipcode": "78394",
        "dob": "11/08/1963",
        "status": "Hold",
        "sensitive": false
      },
      {
        "id": "2464",
        "firstName": "Randy",
        "lastName": "Stanton",
        "mobile": "9276543210",
        "city": "Miami",
        "state": "Florida",
        "zipcode": "65783",
        "dob": "01/12/1960",
        "status": "Active",
        "sensitive": true
      },
      {
        "id": "6747",
        "firstName": "Anika",
        "lastName": "Culhane",
        "mobile": "6876543210",
        "city": "Cary",
        "state": "NC",
        "zipcode": "65739",
        "dob": "09/10/1963",
        "status": "Inactive",
        "sensitive": true
      },
      {
        "id": "2342",
        "firstName": "Randy",
        "lastName": "Dias",
        "mobile": "9856543210",
        "city": "Houston",
        "state": "Texas",
        "zipcode": "34551",
        "dob": "15/08/1972",
        "status": "Hold",
        "sensitive": false
      },
      {
        "id": "7456",
        "firstName": "Charlie",
        "lastName": "Workman",
        "mobile": "9271543210",
        "city": "Chicago",
        "state": "Illinois",
        "zipcode": "67392",
        "dob": "01/12/1991",
        "status": "Active",
        "sensitive": true
      }
    ],
    "metadata": {
      "totalRecords": 10,
      "confidentialityLevel": "HIGH",
      "accessRestriction": "Authorized Personnel Only",
      "dataClassification": "PII (Personally Identifiable Information)",
      "complianceNotes": "GDPR, CCPA, HIPAA Applicable"
    }
  };
  privilegedDataSections: any[] = [];
  searchQuery = '';
  successCount = 0;
  errorCount = 0;
  warningCount = 0;
  showUploadModal = false;
  dragOver = false;
  selectedFiles: SelectedFile[] = [];
  // Integration Modal Properties
  showIntegrationPopup = false;
  showPassword = false;
  isTestingConnection = false;
  showFailedAlert: boolean = false;
  failedCount: number = 0;
  completedCount: number = 5;
  pendingCount: number = 0;
  filteredFiles: any[] = [];
   page = 1;
  pageSize = 5;
  connectionForm = {
    name: '',
    hostUrl: '',
    port: '',
    userId: '',
    password: ''
  };


  // Process steps array
  processSteps: ProcessStep[] = [
    {
      id: 'import',
      title: 'Data Import',
      description: 'Import Your Data Here',
      icon: 'import',
      isActive: true,
      route: '/data'
    },
    {
      id: 'quality',
      title: 'Data Quality',
      description: 'Reviews The Data',
      icon: 'quality',
      isActive: false,
      route: '/data-quality'
    },
    {
      id: 'staging',
      title: 'Data Staging',
      description: 'Ensures Data Accuracy',
      icon: 'staging',
      isActive: false,
      route: '/data'
    },
    {
      id: 'validation',
      title: 'Data Validation',
      description: 'Validate Records',
      icon: 'validation',
      isActive: false,
      route: '/data'
    },
    {
      id: 'mapping',
      title: 'Data Mapping',
      description: 'Prepares Data For Use',
      icon: 'mapping',
      isActive: false,
      route: '/data'
    }
  ];

  // Data files array
  dataFiles: DataFile[] = [];
  isDataManager: boolean = false;
  activateTab: string = 'projects';

  get canExecuteAllSteps(): boolean {
    return this.dataFiles.length > 0 &&
      this.failedCount === 0 &&
      this.pendingCount === 0;
  }
  connectionStatus: { type: 'success' | 'error', message: string } | null = null;

  // Toast Properties
  showToast = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';
  projectName: string | null = ''
  private sub!: Subscription;
  isImport: boolean = false;
  isQuality: boolean = false;
  isValidation: boolean = false;
  isStagging: boolean = false;
  isMapping: boolean = false;
  stage: string = '';
  isSidebarPinned: boolean = false;
  isHide = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private route: ActivatedRoute, private authService: AuthService, private dialog: MatDialog) {
    this.sub = this.authService.sharedValue$.subscribe(val => {
      this.projectName = val;
    });
    this.sub = this.authService.sidebarValue$.subscribe(val => {
      this.isSidebarPinned = val;
    });
    this.isImport = true;
    this.stepsKeydownListener = this.onStepsKeyDown.bind(this);
    this.projectName = this.route.snapshot.paramMap.get('name');
    this.authService.backDataTab$.subscribe(res => {
      this.isHide = res;
    })
  }

  goToStep(step: any) {
    this.showHolisticView = false;
    let steps = step?.id ? step.id : step;

    if (steps == "import") {
      this.isImport = true;
      this.isQuality = false;
      this.isValidation = false;
      this.isStagging = false;
      this.isMapping = false;
    }
    if (step.id == "quality") {
      this.isImport = false;
      this.isQuality = true;
      this.isValidation = false;
      this.isStagging = false;
      this.isMapping = false;
      // Navigate to data quality component
      // this.router.navigate(['/data-quality'], {
      //   queryParams: { projectName: this.projectName }
      // });
      // return; // Exit early to prevent further processing
    }
    if (step.id == "staging") {
      this.isStagging = true;
      this.isValidation = false;
      this.isImport = false;
      this.isMapping = false;
      this.isQuality = false;
    }
    if (step.id == "validation") {
      this.isValidation = true;
      this.isImport = false;
      this.isMapping = false;
      this.isQuality = false;
      this.isStagging = false;
    }
    if (steps == "mapping") {
      this.isMapping = true;
      this.isImport = false;
      this.isQuality = false;
      this.isStagging = false;
      this.isValidation = false;
    }

    this.processSteps.forEach(s => s.isActive = false);
    step.isActive = true;
  }

  activateSection(section: string) {
    // Reset all sections first
    this.isImport = false;
    this.isQuality = false;
    this.isValidation = false;
    this.isStagging = false;
    this.isMapping = false;

    // Activate the specified section
    switch (section) {
      case 'import':
        this.isImport = true;
        break;
      case 'quality':
        this.isQuality = true;
        break;
      case 'staging':
        this.isStagging = true;
        break;
      case 'validation':
        this.isValidation = true;
        break;
      case 'mapping':
        this.isMapping = true;
        break;
      default:
        this.isImport = true; // Default to import
        break;
    }

    // Update process steps active state
    this.processSteps.forEach(step => {
      step.isActive = step.id === section;
    });
  }

  ngOnInit() {
    // Get project name and section from query parameters if available
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }

      // Handle section parameter to automatically activate specific sections
      if (params['section']) {
        this.activateSection(params['section']);
      }
    });
    const currentUser = this.authService.currentUserValue;
    this.isDataManager = currentUser?.role === 'Data Manager';

    // Initialize with empty data or load from service
    this.updateStatusCounts();
  }

  onBackClick(): void {
    if (this.isDataManager) {
      this.router.navigate(['/projectsDashboard', true]);
      this.authService.setShowDashboards('false');
      return
    } else {
      this.router.navigate(['/projectsDashboard']);
      this.authService.setShowDashboards('false');
      console.log('Back button clicked');
    }

  }

  get totalPages(): number {
    return Math.ceil(this.filteredFiles.length / this.pageSize);
  }

  get pagedFiles() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredFiles.slice(startIndex, endIndex);
  }

  onPageChange(direction: 'next' | 'prev') {
    if (direction === 'next' && this.page < this.totalPages) {
      this.page++;
    } else if (direction === 'prev' && this.page > 1) {
      this.page--;
    }
  }

getPages(): (number | string)[] { // <--- 💡 The fix: Explicitly define the return type
    const total = this.totalPages;
    // The finalSet array now correctly supports both number and string types
    const finalSet: (number | string)[] = [1]; 
    if (total >= 2) finalSet.push(2);
    if (total >= 3) finalSet.push(3);
    // This line caused the error, but is now fixed by the type definition above
    if (total > 4) finalSet.push('...'); 
    if (total > 3) finalSet.push(total);
    return Array.from(new Set(finalSet));
}

  // You'll also need a method to handle clicking a numbered page
  goToPage(p: number | string): void {
    if (typeof p === 'number') {
      this.page = p;
    }
  }

  onHolisticViewClick(): void {
    this.showHolisticView = false;
    if (this.isStagging) {
      this.stage = 'staging';
    }
    if (this.isImport) {
      this.stage = 'import';
    }
    if (this.isValidation) {
      this.stage = 'validation';
    }
    if (this.isMapping) {
      this.stage = 'mapping';
    }
    if (this.isQuality) {
      this.stage = 'quality'
    }
    else {
      console.log('Holistic View clicked but not in Data Staging step.');
    }
    this.showHolisticView = true;
  }

  onUploadFileClick(): void {
    // Handle file upload - Show modal
    this.showUploadModal = true;
  }

  openIntegrationPopup(): void {
    this.showIntegrationPopup = true;
    const dialogRef = this.dialog.open(IntegrationPopupComponent, {
      width: '450px',
      disableClose: true, // optional
      data: {} // if you want to pass data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form Data from Popup:', result);
        // call API or process data here
      }
    });
  }

  closeIntegrationPopup(): void {
    this.showIntegrationPopup = false;
  }


  onFileUploadClick(): void {
    // Handle file upload from empty state - Show modal
    this.showUploadModal = true;
  }


  onSearchChange(): void {
    // Handle search functionality
    this.updateFilteredFiles();
    console.log('Search query:', this.searchQuery);
  }

  private getConnectorLabel(connectorValue: string): string {
    const connectorLabels: { [key: string]: string } = {
      'sap': 'SAP',
      'oracle': 'Oracle',
      'mysql': 'MySQL',
      'postgresql': 'PostgreSQL',
      'mongodb': 'MongoDB',
      'salesforce': 'Salesforce',
      'snowflake': 'Snowflake',
      'bigquery': 'BigQuery',
      'redshift': 'AWS Redshift',
      'azure-sql': 'Azure SQL',
      'databricks': 'Databricks',
      'tableau': 'Tableau',
      'power-bi': 'Power BI',
      'rest-api': 'REST API',
      'graphql': 'GraphQL',
      'csv': 'CSV File',
      'excel': 'Excel File',
      'json': 'JSON File',
      'xml': 'XML File',
      'ftp': 'FTP Server',
      'sftp': 'SFTP Server',
      'aws-s3': 'AWS S3',
      'azure-blob': 'Azure Blob Storage',
      'google-cloud': 'Google Cloud Storage',
      'kafka': 'Apache Kafka',
      'rabbitmq': 'RabbitMQ',
      'elasticsearch': 'Elasticsearch',
      'redis': 'Redis',
      'cassandra': 'Cassandra',
      'other': 'Other'
    };

    return connectorLabels[connectorValue] || connectorValue;
  }
  onTabChanged(tab: string) {
    console.log(tab)
    this.activateTab = tab;
    if (tab === 'organisation') {
      this.authService.setShowOrganisationValue('true');
    }
    else if (tab === 'projects') {
      this.authService.setShowOrganisationValue('false');
    }
  }
  // Modal Methods
  onCloseModal(): void {
    this.showUploadModal = false;
    this.selectedFiles = [];
    this.dragOver = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }
  onExecuteAllSteps(): void {
    this.showStepsConfirmationModal = true;
    // Add body class to prevent scrolling
    document.body.classList.add('steps-modal-open');
  }
  onBrowseClick(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.csv,.txt,.xls,.xlsx';
    fileInput.style.display = 'none';

    fileInput.onchange = (event: any) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.handleFiles(Array.from(files));
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  private handleFiles(files: File[]): void {
    const supportedExtensions = ['.csv', '.txt', '.xls', '.xlsx'];

    files.forEach(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (supportedExtensions.includes(extension)) {
        const selectedFile: SelectedFile = {
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          type: extension
        };

        // Check if file already exists
        if (!this.selectedFiles.some(f => f.name === file.name)) {
          this.selectedFiles.push(selectedFile);
        }
      } else {
        alert(`File type ${extension} is not supported. Please upload csv, txt, or excel files.`);
      }
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  private onStepsKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showStepsConfirmationModal && !this.isStepsExecuting) {
      this.closeStepsConfirmationModal();
    }
  }
  onSaveFiles(): void {
    if (this.selectedFiles.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    this.selectedFiles.forEach(selectedFile => {
      const dataFile: DataFile = {
        submodule: 'Manual Upload',
        sourceSystem: 'Local Device',
        fileName: selectedFile.name,
        uploadedOn: new Date(),
        modifiedOn: new Date(),
        status: 'success'
      };
      this.dataFiles.push(dataFile);
    });

    // ✅ Immediately refresh filtered list for table
    this.updateFilteredFiles();

    // Update status counts so they match new data
    this.updateStatusCounts();

    this.onCloseModal();

    console.log(`Successfully uploaded ${this.selectedFiles.length} file(s)`);
  }

  onCancelUpload(): void {
    this.onCloseModal();
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return 'csv';
      case 'txt':
        return 'txt';
      case 'xls':
      case 'xlsx':
        return 'excel';
      default:
        return 'file';
    }
  }

  private updateStatusCounts(): void {
    this.completedCount = this.dataFiles.filter(file => file.status === 'success').length;
    this.failedCount = this.dataFiles.filter(file => file.status === 'error').length;
    this.pendingCount = this.dataFiles.filter(file => file.status === 'warning').length;

    this.showFailedAlert = this.failedCount > 0;
    this.successCount = this.dataFiles.filter(f => f.status === 'success').length;
    this.errorCount = this.dataFiles.filter(f => f.status === 'error').length;
    this.warningCount = this.dataFiles.filter(f => f.status === 'warning').length;
  }

  // Method to add sample data for testing
  addSampleData(): void {
    this.dataFiles = [
      {
        submodule: 'Purchase Orders',
        sourceSystem: 'SAP ERP',
        fileName: 'po_data_2024.xlsx',
        uploadedOn: new Date('2024-01-15'),
        modifiedOn: new Date('2024-01-16'),
        status: 'success'
      },
      {
        submodule: 'Invoices',
        sourceSystem: 'Oracle Financials',
        fileName: 'invoices_q1.csv',
        uploadedOn: new Date('2024-01-10'),
        modifiedOn: new Date('2024-01-12'),
        status: 'error'
      }
    ];
    this.updateStatusCounts();
  }
  onCloseFailedAlert(): void {
    this.showFailedAlert = false;
  }


  onViewFile(fileId: string): void {
    console.log('onViewFile called with fileId:', fileId);
    console.log('showPrivilegedModal before:', this.showPrivilegedModal);

    this.showPrivilegedModal = true;
    document.body.classList.add('steps-modal-open');

    console.log('showPrivilegedModal after:', this.showPrivilegedModal);
  }

  closePrivilegedModal(): void {
    this.showPrivilegedModal = false;
    document.body.classList.remove('steps-modal-open');
  }
  onDeleteFile(fileId: string): void {
    const fileToDelete = this.dataFiles.find(f => f.id === fileId);
    if (!fileToDelete) return;

    this.deleteData = {
      ...this.deleteData,
      itemName: fileToDelete.fileName
    };
    this.showDeletePopup = true;
  }
  handleDeleteResult(result: DeletePopupResult): void {
    this.showDeletePopup = false;

    if (result.confirmed && result.data?.itemName) {
      this.deleteFileConfirmed(result.data.itemName);
    }
  }
  private deleteFileConfirmed(fileName: string): void {
    this.dataFiles = this.dataFiles.filter(f => f.fileName !== fileName);

    this.updateStatusCounts();
    this.updateFilteredFiles();

    console.log(`File "${fileName}" deleted successfully`);
  }
  private updateFilteredFiles(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredFiles = [...this.dataFiles];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredFiles = this.dataFiles.filter(file =>
        file.fileName.toLowerCase().includes(query) ||
        file.submodule.toLowerCase().includes(query) ||
        file.sourceSystem.toLowerCase().includes(query) ||
        file.status.toLowerCase().includes(query)
      );
    }
  }
  closeStepsConfirmationModal(): void {
    if (this.isStepsExecuting) {
      return; // Prevent closing while executing steps
    }

    this.showStepsConfirmationModal = false;
    // Remove body class to allow scrolling
    document.body.classList.remove('steps-modal-open');

    // Emit steps execution cancellation event
    this.stepsExecutionCancelled.emit();
  }
  async confirmStepsExecution(): Promise<void> {
    if (this.isStepsExecuting) {
      return; // Prevent multiple steps executions
    }
    this.isStepsExecuting = false;

  }
  ngOnDestroy(): void {
    // Remove body class if component is destroyed while steps modal is open
    document.body.classList.remove('steps-modal-open');

    // Remove keyboard event listener for steps modal
    document.removeEventListener('keydown', this.stepsKeydownListener);

    // Reset execution state
    this.resetStepsExecutionState();
    if (isPlatformBrowser(this.platformId)) {
      // safe to use document here
      const modalEl = document.getElementById('paymentsModal');
      if (modalEl) {
        // your logic...
      }
    }

  }
  resetStepsExecutionState(): void {
    this.isStepsExecuting = false;
    this.showStepsConfirmationModal = false;
    document.body.classList.remove('steps-modal-open');
  }

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortData(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredFiles.sort((a: any, b: any) => {
      let valA = a[column];
      let valB = b[column];

      // Convert to string if value is not number/date for comparison
      if (valA instanceof Date && valB instanceof Date) {
        valA = valA.getTime();
        valB = valB.getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

}
