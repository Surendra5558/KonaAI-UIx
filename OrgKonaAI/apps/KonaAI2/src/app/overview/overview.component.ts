import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectServiceService, Project } from '../project-service.service';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

interface FileFormat {
  extension: string;
  active: boolean;
}

interface KeywordFile {
  name: string;
  size: string;
  icon: string;
}

@Component({
  selector: 'app-overview',
    standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() projectData: any;

activeInsightsMenu: string | null = null;

toggleInsightsMenu(event: MouseEvent, menuId: string) {
  event.stopPropagation(); // prevent body click from closing immediately
  if (this.activeInsightsMenu === menuId) {
    this.activeInsightsMenu = null; // close if already open
  } else {
    this.activeInsightsMenu = menuId; // open selected menu
  }
}

  searchTerm: string = '';
  selectedStatus: string = '';
  statuses: string[] = ['Active', 'Planning', 'Completed'];
   activeTab: string = 'summary';
 

  constructor(
    private projectService: ProjectServiceService,
    private router: Router, private location: Location,
    private route: ActivatedRoute // Added ActivatedRoute
  ) {}

 // overview.component.ts
ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('projectid')); // 👈 make sure this is a number!
  this.projectService.getProjectById(id).subscribe(project => {
    this.projectData = project;
  });
}


  getProjectData(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.projectData = data;
      },
      error: (err) => {
        console.error('Failed to fetch project:', err);
      }
    });
  }

insightsList = [
  {
    key: 'o2c',
    module: 'O2C',
    title: 'O2C_Insights.ppt',
    description: 'Identify revenue risks, assess credit exposure, and monitor customer payment trends. Ensure compliance and improve cash flow visibility with structured insights.'
  },
  {
    key: 'p2p',
    module: 'P2P',
    title: 'P2P_Insights.ppt',
    description: 'Manage procurement risks, monitor supplier performance, and optimize purchase-to-pay cycles with actionable insights.'
  },
  {
    key: 'te',
    module: 'T&E',
    title: 'T&E_Insights.ppt',
    description: 'Analyze travel and expense data for policy compliance, detect anomalies, and improve spend transparency.'
  }
];


  trackByName(index: number, doc: any): string {
  return doc.name;
}

  // Mock data: Replace this with actual service call if needed
  projectDocuments = [
    { modules: 'Design', name: 'ProjectOverview.pdf', size: '1.2 MB', type: 'pdf' },
    { modules: 'Development', name: 'BackendAPIs.xlsx', size: '650 KB', type: 'xlsx' },
    { modules: 'Documentation', name: 'UserGuide.doc', size: '2.5 MB', type: 'doc' },
    { modules: 'QA', name: 'TestCases.txt', size: '500 KB', type: 'txt' }
  ];


  goBack() {
    this.location.back();
  }

  // Optional: handle view button click
  viewDocument(doc: any): void {
    console.log('Viewing document:', doc.name);
    // You can open a modal, redirect, or preview the document here
  }

 previewInsightCard(key: string): void {
    console.log('Previewing insight card:', key);
    this.activeInsightsMenu = key;
    // Logic to preview the insight card (e.g. open dialog or toggle content)
  }

  // Called when user clicks the 'Download' button
  downloadInsightCard(key: string): void {
    console.log('Downloading insight card:', key);
    // Logic to trigger file download or generate a report
  }

  tabs = ['summary', 'documents', 'ocr', 'insights'];
  activeTabIndex = 0;

    setActiveTab(tab: string): void {
    this.activeTab = tab;
      this.activeTabIndex = this.tabs.indexOf(tab);
  }

  goToNextTab() {
  if (this.activeTabIndex < this.tabs.length - 1) {
    this.activeTabIndex++;
    this.activeTab = this.tabs[this.activeTabIndex];
  }
}

  serviceKey = 'SON%_SF@g7da2c-1234-456f-88aa-ce401f234567';
  serviceEndpoint = 'https://api.konai.com/ocr/v1/process';
  automaticOCR = false;
  enhanceResolution = false;
  targetLanguage = 'english';
  
  // Anomaly detection settings
  detectIncompleteData = false;
  identifyFlaggedAnnotations = false;
  classifyOutliers = false;

  // File formats
  fileFormats: FileFormat[] = [
    { extension: 'pdf', active: true },
    { extension: 'xhtml', active: true },
    { extension: 'xml', active: false },
    { extension: 'msg', active: false },
    { extension: 'png', active: false },
    { extension: 'jpeg', active: false },
    { extension: 'tiff', active: false }
  ];

  // Keyword files
  keywordFiles: KeywordFile[] = [
    { name: 'Keywords_List.pdf', size: '365 KB', icon: '📄' }
  ];

  // Methods
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  }

  toggleFormat(format: FileFormat): void {
    format.active = !format.active;
  }

  viewFile(file: KeywordFile): void {
    console.log('Viewing file:', file.name);
  }

  downloadFile(file: KeywordFile): void {
    console.log('Downloading file:', file.name);
  }

  deleteFile(file: KeywordFile): void {
    const index = this.keywordFiles.indexOf(file);
    if (index > -1) {
      this.keywordFiles.splice(index, 1);
    }
  }
}