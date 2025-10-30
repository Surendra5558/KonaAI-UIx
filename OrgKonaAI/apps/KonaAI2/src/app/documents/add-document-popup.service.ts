import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type ModuleType = 'All' | 'P2P' | 'T&E' | 'O2C';
export type FileType = 'PDF' | 'DOCX' | 'Excel' | 'Other';

export interface AddDocumentPopupData {
  isOpen: boolean;
  module: ModuleType;
  type: FileType;
  dateModified: string; // display format
  nextUpdateDue: string; // display format
  comment: string;
  file?: File | null;
  isLoading: boolean;
  exclusionDataObject: string;
  exclusionBaseField: string;
  mode: 'create' | 'edit';
  docId?: number;
  selectedModules: ModuleType[];
  currentFileName?: string;
}

export interface AddDocumentConfirmedPayload {
  module: ModuleType;
  type: FileType;
  dateModified: string;
  nextUpdateDue: string;
  comment: string;
  file?: File | null;
  exclusionDataObject: string;
  exclusionBaseField: string;
  mode: 'create' | 'edit';
  docId?: number;
}

@Injectable({ providedIn: 'root' })
export class AddDocumentPopupService {
  private popupSubject = new BehaviorSubject<AddDocumentPopupData>({
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
    selectedModules: [],
    currentFileName: undefined
  });

  popup$ = this.popupSubject.asObservable();

  private confirmedSubject = new Subject<AddDocumentConfirmedPayload>();
  confirmed$ = this.confirmedSubject.asObservable();

  open(defaults?: Partial<AddDocumentPopupData>, mode: 'create' | 'edit' = 'create', docId?: number) {
    this.popupSubject.next({
      isOpen: true,
      module: (defaults?.module as ModuleType) ?? 'All',
      type: (defaults?.type as FileType) ?? 'PDF',
      dateModified: defaults?.dateModified ?? '',
      nextUpdateDue: defaults?.nextUpdateDue ?? '',
      comment: defaults?.comment ?? '',
      file: defaults?.file ?? null,
      isLoading: false,
      exclusionDataObject: defaults?.exclusionDataObject ?? '',
      exclusionBaseField: defaults?.exclusionBaseField ?? '',
      mode,
      docId,
      selectedModules: defaults?.selectedModules ?? (defaults?.module ? [defaults.module as ModuleType] : []),
      currentFileName: defaults?.currentFileName
    });
  }

  close() {
    this.popupSubject.next({
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
      selectedModules: [],
      currentFileName: undefined
    });
  }

  update<K extends keyof AddDocumentPopupData>(key: K, value: AddDocumentPopupData[K]) {
    const current = this.popupSubject.value;
    this.popupSubject.next({ ...current, [key]: value });
  }

  confirm() {
    const current = this.popupSubject.value;
    if (current.mode === 'create') {
      if (!current.file || !current.nextUpdateDue) return;
    } else {
      if (!current.nextUpdateDue) return;
    }

    this.popupSubject.next({ ...current, isLoading: true });
    setTimeout(() => {
      this.confirmedSubject.next({
        module: current.module,
        type: current.type,
        dateModified: current.dateModified,
        nextUpdateDue: current.nextUpdateDue,
        comment: current.comment,
        file: current.file ?? undefined,
        exclusionDataObject: current.exclusionDataObject,
        exclusionBaseField: current.exclusionBaseField,
        mode: current.mode,
        docId: current.docId
      });
      this.close();
    }, 300);
  }

  toggleModule(module: ModuleType) {
    const cur = this.popupSubject.value;
    const exists = cur.selectedModules.includes(module);
    const selectedModules = exists
      ? cur.selectedModules.filter(m => m !== module)
      : [...cur.selectedModules, module];
    // Keep single module in 'module' field for compatibility
    const nextModule = selectedModules[0] ?? cur.module;
    this.popupSubject.next({ ...cur, selectedModules, module: nextModule });
  }
}


