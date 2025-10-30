import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddDocumentPopupComponent } from './add-document-popup/add-document-popup.component';
import { AddDocumentPopupService } from './add-document-popup.service';
import { PreviewDocumentPopupService } from './preview-document-popup.service';
import { PreviewDocumentPopupComponent } from './preview-document-popup/preview-document-popup.component';

interface Document {
  id: number;
  module: string;
  name: string;
  size: string;
  dateModified: string;
  nextUpdateDue: string;
  type: string;
  comment: string;
  fileType?: string;
  actionType?: 'menu' | 'upload';
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, AddDocumentPopupComponent, PreviewDocumentPopupComponent],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [
    {
      id: 1,
      module: 'All',
      name: 'Holiday List 2025.xlsx',
      size: '1.2 MB',
      dateModified: '15 Jan 2025',
      nextUpdateDue: '01 Jan 2026',
      type: 'Excel',
      comment: 'Updated List',
      fileType: 'xlsx',
      actionType: 'menu'
    },
    {
      id: 2,
      module: 'P2P',
      name: 'Vendor Risk Assessment Policy.pdf',
      size: '1.2 MB',
      dateModified: '15 Feb 2025',
      nextUpdateDue: '15 Jan 2026',
      type: 'PDF',
      comment: 'Annual review required',
      fileType: 'pdf',
      actionType: 'menu'
    },
    {
      id: 3,
      module: 'P2P',
      name: 'Procurement Standard Operating Procedures.docx',
      size: '1.5 MB',
      dateModified: '20 Dec 2025',
      nextUpdateDue: '20 Dec 2026',
      type: 'DOCX',
      comment: 'New ERP system',
      fileType: 'docx',
      actionType: 'menu'
    },
    {
      id: 4,
      module: 'T&E',
      name: 'Travel & Expense Policy',
      size: '',
      dateModified: '',
      nextUpdateDue: '',
      type: '',
      comment: '',
      fileType: '',
      actionType: 'upload'
    },
    {
      id: 5,
      module: 'O2C',
      name: 'Customer Billing Compliance',
      size: '',
      dateModified: '',
      nextUpdateDue: '',
      type: '',
      comment: '',
      fileType: '',
      actionType: 'upload'
    }
  ];

  filteredDocuments: Document[] = [];
  searchTerm: string = '';
  selectedModule: string = 'All';

  constructor(
    private addDocumentPopup: AddDocumentPopupService, 
    private previewDocumentPopup: PreviewDocumentPopupService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.filteredDocuments = [...this.documents];
    // Global listeners to close kebab menu (browser only)
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.handleGlobalClick);
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  onSearch(): void {
    this.filterDocuments();
  }

  onModuleChange(): void {
    this.filterDocuments();
  }

  filterDocuments(): void {
    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           doc.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesModule = this.selectedModule === 'All' || doc.module === this.selectedModule;
      return matchesSearch && matchesModule;
    });
  }

  uploadDocument(): void {
    this.addDocumentPopup.open();
  }

  ngAfterViewInit(): void {
    this.addDocumentPopup.confirmed$.subscribe(payload => {
      const newId = Math.max(...this.documents.map(d => d.id)) + 1;
      const fileType = (payload.type || '').toLowerCase();
      const newDoc = {
        id: newId,
        module: payload.module,
        name: payload.file ? payload.file.name : 'New Document',
        size: payload.file ? `${(payload.file.size / (1024*1024)).toFixed(1)} MB` : '',
        dateModified: payload.dateModified,
        nextUpdateDue: payload.nextUpdateDue,
        type: payload.type,
        comment: payload.comment,
        fileType,
        actionType: 'menu' as const
      };
      this.documents = [newDoc, ...this.documents];
      this.filterDocuments();
    });
  }

  getUniqueModules(): string[] {
    return ['All', ...new Set(this.documents.map(doc => doc.module))];
  }

  getFileIcon(fileType: string): string {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return 'bi-file-earmark-pdf';
      case 'docx':
      case 'doc':
        return 'bi-file-earmark-word';
      case 'xlsx':
      case 'xls':
        return 'bi-file-earmark-excel';
      case 'pptx':
      case 'ppt':
        return 'bi-file-earmark-ppt';
      case 'txt':
        return 'bi-file-earmark-text';
      default:
        return 'bi-file-earmark';
    }
  }

  getFileTypeColor(fileType: string): string {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return '#dc2626';
      case 'docx':
      case 'doc':
        return '#2563eb';
      case 'xlsx':
      case 'xls':
        return '#16a34a';
      case 'pptx':
      case 'ppt':
        return '#ea580c';
      default:
        return '#6b7280';
    }
  }

  // Kebab menu state and handlers
  openMenuId: number | null = null;

  toggleMenu(event: Event, docId: number): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === docId ? null : docId;
  }

  handleGlobalClick = () => {
    if (this.openMenuId !== null) {
      this.openMenuId = null;
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.openMenuId !== null) {
      this.openMenuId = null;
    }
  };

  onMenuClick(event: Event): void {
    event.stopPropagation();
  }

  onMenuAction(action: 'edit' | 'preview' | 'download' | 'delete', doc: Document): void {
    // Wire actions as needed; close after selection for now
    if (action === 'download') {
      // Placeholder hook for download handling
      console.log('Download requested for', doc.name);
    } else if (action === 'edit') {
      this.addDocumentPopup.open(
        {
          module: doc.module as any,
          type: (doc.type as any) || 'PDF',
          dateModified: doc.dateModified,
          nextUpdateDue: doc.nextUpdateDue,
          comment: doc.comment,
          exclusionDataObject: '',
          exclusionBaseField: '',
          selectedModules: [doc.module as any],
          currentFileName: doc.name
        },
        'edit',
        doc.id
      );
    } else if (action === 'preview') {
      this.previewDocumentPopup.open(
        doc.id,
        doc.name,
        doc.type || 'Document',
        doc.size || 'Unknown size'
      );
    }
    this.openMenuId = null;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.handleGlobalClick);
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }
}
