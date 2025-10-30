import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddDocumentPopupData, AddDocumentPopupService, FileType, ModuleType } from '../add-document-popup.service';

@Component({
  selector: 'app-add-document-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-document-popup.component.html',
  styleUrls: ['./add-document-popup.component.scss']
})
export class AddDocumentPopupComponent implements OnInit, OnDestroy {
  data: AddDocumentPopupData = {
    isOpen: false,
    module: 'All',
    type: 'PDF',
    dateModified: '',
    nextUpdateDue: '',
    comment: '',
    file: null,
    isLoading: false,
    exclusionDataObject: '',
    exclusionBaseField: '',
    mode: 'create',
    docId: undefined,
    selectedModules: []
  };

  private sub = new Subscription();

  fileTypes: FileType[] = ['PDF', 'DOCX', 'Excel', 'Other'];
  modules: ModuleType[] = ['All', 'P2P', 'T&E', 'O2C'];

  constructor(
    public popup: AddDocumentPopupService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.sub.add(this.popup.popup$.subscribe(d => this.data = d));
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', this.onKeyDown);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.onKeyDown);
    }
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.data.isOpen) {
      this.onCancel();
    }
  };

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onCancel() { this.popup.close(); }
  onSave() { this.popup.confirm(); }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file) this.popup.update('file', file);
  }

  trackByValue(_: number, v: string) { return v; }
}


