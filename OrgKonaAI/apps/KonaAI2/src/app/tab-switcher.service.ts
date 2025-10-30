// tab-state.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabStateService {
  private _selectedTabSubject = new BehaviorSubject<string>('sum');
  selectedTab$: Observable<string> = this._selectedTabSubject.asObservable();
  _selectedClientId = new Subject<number | null>();
  selectedClientId$: Observable<any> = this._selectedClientId.asObservable();

  setTab(tab: string) {
    this._selectedTabSubject.next(tab);
  }

  get currentTab(): string {
    return this._selectedTabSubject.value;
  }
  setClientId(id: any) {
   this._selectedClientId.next(id);
  }
  selectClientId() {
    return this._selectedClientId.asObservable();
  }
}
