import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientAdminTabService {
  private activeTabSubject = new BehaviorSubject<string>('projects');
  public activeTab$ = this.activeTabSubject.asObservable();

  constructor() { }

  setActiveTab(tab: string): void {
    // Prevent redundant emissions to avoid recursive update loops
    if (this.activeTabSubject.value !== tab) {
      this.activeTabSubject.next(tab);
    }
  }

  getActiveTab(): string {
    return this.activeTabSubject.value;
  }
}