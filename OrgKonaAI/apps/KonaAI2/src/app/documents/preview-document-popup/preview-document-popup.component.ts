import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewDocumentPopupService, PreviewDocumentPopupData } from '../preview-document-popup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preview-document-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-document-popup.component.html',
  styleUrls: ['./preview-document-popup.component.scss']
})
export class PreviewDocumentPopupComponent implements OnInit, OnDestroy {
  popupData: PreviewDocumentPopupData = {
    isOpen: false,
    documentId: undefined,
    documentName: undefined,
    documentUrl: undefined,
    documentType: undefined,
    isLoading: false
  };

  private subscription: Subscription = new Subscription();

  constructor(private previewDocumentPopupService: PreviewDocumentPopupService) {}

  ngOnInit() {
    this.subscription.add(
      this.previewDocumentPopupService.popup$.subscribe(data => {
        this.popupData = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.previewDocumentPopupService.close();
  }

  download() {
    // Implement download functionality
    console.log('Download requested for:', this.popupData.documentName);
  }

  getFileIcon(documentType: string): string {
    switch (documentType?.toLowerCase()) {
      case 'pdf':
        return 'bi-file-earmark-pdf';
      case 'docx':
      case 'doc':
        return 'bi-file-earmark-word';
      case 'xlsx':
      case 'xls':
      case 'excel':
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

  getFileTypeColor(documentType: string): string {
    switch (documentType?.toLowerCase()) {
      case 'pdf':
        return '#dc2626';
      case 'docx':
      case 'doc':
        return '#2563eb';
      case 'xlsx':
      case 'xls':
      case 'excel':
        return '#16a34a';
      case 'pptx':
      case 'ppt':
        return '#ea580c';
      default:
        return '#6b7280';
    }
  }
}
