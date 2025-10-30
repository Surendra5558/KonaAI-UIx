import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PreviewDocumentPopupData {
  isOpen: boolean;
  documentId?: number;
  documentName?: string;
  documentUrl?: string;
  documentType?: string;
  isLoading: boolean;
}

export interface PreviewDocumentConfirmedPayload {
  documentId: number;
  documentName: string;
  documentUrl: string;
  documentType: string;
}

@Injectable({ providedIn: 'root' })
export class PreviewDocumentPopupService {
  private popupSubject = new BehaviorSubject<PreviewDocumentPopupData>({
    isOpen: false,
    documentId: undefined,
    documentName: undefined,
    documentUrl: undefined,
    documentType: undefined,
    isLoading: false
  });

  popup$ = this.popupSubject.asObservable();

  private confirmedSubject = new Subject<PreviewDocumentConfirmedPayload>();
  confirmed$ = this.confirmedSubject.asObservable();

  open(documentId: number, documentName: string, documentUrl: string, documentType: string) {
    this.popupSubject.next({
      isOpen: true,
      documentId,
      documentName,
      documentUrl,
      documentType,
      isLoading: false
    });
  }

  close() {
    this.popupSubject.next({
      isOpen: false,
      documentId: undefined,
      documentName: undefined,
      documentUrl: undefined,
      documentType: undefined,
      isLoading: false
    });
  }

  update<K extends keyof PreviewDocumentPopupData>(key: K, value: PreviewDocumentPopupData[K]) {
    const current = this.popupSubject.value;
    this.popupSubject.next({
      ...current,
      [key]: value
    });
  }

  confirm(payload: PreviewDocumentConfirmedPayload) {
    this.confirmedSubject.next(payload);
  }

  setLoading(isLoading: boolean) {
    this.update('isLoading', isLoading);
  }
}
