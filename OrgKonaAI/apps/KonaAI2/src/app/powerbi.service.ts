 import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
// @ts-ignore
import * as pbi from 'powerbi-client';

@Injectable({
  providedIn: 'root'
})
export class PowerbiService {
  private http = inject(HttpClient);
  private readonly service: pbi.service.Service;

  // Shared state for Power BI pages and active page across components
  private pagesSubject = new BehaviorSubject<any[]>([]);
  private activePageNameSubject = new BehaviorSubject<string>('');
  private selectedPageSubject = new Subject<string>();

  pages$ = this.pagesSubject.asObservable();
  activePageName$ = this.activePageNameSubject.asObservable();
  selectedPage$ = this.selectedPageSubject.asObservable();

  constructor() {
    this.service = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
  }

  getEmbedInfo(): Observable<any> {
    return this.http.get('http://127.0.0.1:5000/getembedinfo'); // Flask endpoint
  }

  destroy(embed: pbi.Embed): void {
    this.service.reset(embed.element);
  }

  // Methods to communicate pages/active page
  setPages(pages: any[]): void {
    this.pagesSubject.next(pages || []);
  }

  setActivePageName(pageName: string | null | undefined): void {
    this.activePageNameSubject.next(pageName || '');
  }

  selectPage(pageName: string): void {
    if (pageName) {
      this.selectedPageSubject.next(pageName);
    }
  }
}
