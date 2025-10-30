import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectSelectionService {
  private isProjectSelectedSubject = new BehaviorSubject<boolean>(false);
  public isProjectSelected$ = this.isProjectSelectedSubject.asObservable();
  private isProjectBack = new BehaviorSubject<boolean>(false);
  public isProjectBack$ = this.isProjectBack.asObservable();
  private selectedProjectIdSubject = new BehaviorSubject<number | null>(null);
  public selectedProjectId$ = this.selectedProjectIdSubject.asObservable();

  constructor() { }

  setIsProjectBack(isSelected: boolean) {
    this.isProjectBack.next(isSelected);
  }

  setProjectSelected(isSelected: boolean, projectId?: number): void {
    this.isProjectSelectedSubject.next(isSelected);
    this.selectedProjectIdSubject.next(projectId || null);
  }

  getIsProjectSelected(): boolean {
    return this.isProjectSelectedSubject.value;
  }

  getSelectedProjectId(): number | null {
    return this.selectedProjectIdSubject.value;
  }

  clearProjectSelection(): void {
    this.isProjectSelectedSubject.next(false);
    this.selectedProjectIdSubject.next(null);
  }
}
