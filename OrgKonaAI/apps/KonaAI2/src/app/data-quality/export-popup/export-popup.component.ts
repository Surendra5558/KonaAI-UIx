import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ExportPopupService, ExportPopupData } from '../export-popup.service';

@Component({
  selector: 'app-export-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent implements OnInit, OnDestroy {
  isOpen = false;
  fileName = '';
  moduleType = '';
  isLoading = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private exportPopupService: ExportPopupService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.subscription = this.exportPopupService.exportPopup$.subscribe(
      (data: ExportPopupData) => {
        this.isOpen = data.isOpen;
        this.fileName = data.fileName;
        this.moduleType = data.moduleType;
        this.isLoading = data.isLoading || false;
      }
    );

    // Add keyboard event listener for Escape key only in browser
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      this.onCancel();
    }
  }

  onFileNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fileName = target.value;
    this.exportPopupService.updateFileName(this.fileName);
  }

  onCancel() {
    this.exportPopupService.closeExportPopup();
  }

  onSave() {
    if (this.fileName.trim()) {
      this.exportPopupService.confirmExport();
    }
  }

  get isFileNameValid(): boolean {
    return this.fileName.trim().length > 0;
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
