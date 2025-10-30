import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ExportPopupData {
  isOpen: boolean;
  fileName: string;
  moduleType: string;
  isLoading?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExportPopupService {
  private exportPopupSubject = new BehaviorSubject<ExportPopupData>({
    isOpen: false,
    fileName: '',
    moduleType: ''
  });

  exportPopup$ = this.exportPopupSubject.asObservable();

  openExportPopup(moduleType: string = 'P2P') {
    const defaultFileName = `DQCReport_${moduleType}_All_${this.getCurrentDate()}`;
    this.exportPopupSubject.next({
      isOpen: true,
      fileName: defaultFileName,
      moduleType: moduleType
    });
  }

  closeExportPopup() {
    this.exportPopupSubject.next({
      isOpen: false,
      fileName: '',
      moduleType: ''
    });
  }

  updateFileName(fileName: string) {
    const currentValue = this.exportPopupSubject.value;
    this.exportPopupSubject.next({
      ...currentValue,
      fileName: fileName
    });
  }

  confirmExport() {
    const currentValue = this.exportPopupSubject.value;
    
    // Set loading state
    this.exportPopupSubject.next({
      ...currentValue,
      isLoading: true
    });
    
    // Simulate export process
    setTimeout(() => {
      // Here you can add the actual export logic
      console.log('Exporting file:', currentValue.fileName);
      
      // Close the popup after export
      this.closeExportPopup();
    }, 1000);
    
    // Return the export data for further processing
    return currentValue;
  }

  private getCurrentDate(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  }
}
