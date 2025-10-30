import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DataQualityIssue {
  id: string;
  description: string;
  recordCount: number;
  impact: 'High' | 'Medium' | 'Low';
  possibleFix: string;
  status: 'Pending' | 'Resolved' | 'In Progress';
}

export interface ResolvedDataQualityIssue {
  id: string;
  xblnr: string;
  mandt: string;
  bukrs: string;
  lifnr: string;
  umsks: string;
  umskz: string;
  status: 'Archived' | 'Deleted';
  resolutionDate: Date;
  resolvedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataQualityService {
  private openIssuesSubject = new BehaviorSubject<DataQualityIssue[]>([]);
  private resolvedIssuesSubject = new BehaviorSubject<ResolvedDataQualityIssue[]>([]);

  public openIssues$ = this.openIssuesSubject.asObservable();
  public resolvedIssues$ = this.resolvedIssuesSubject.asObservable();

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleOpenIssues: DataQualityIssue[] = [
      {
        id: 'BSAK-44',
        description: 'Missing Key Fields',
        recordCount: 10290,
        impact: 'Medium',
        possibleFix: 'Fix or Re-extract',
        status: 'Pending'
      },
      {
        id: 'BSAK-45',
        description: 'Data Format Issues',
        recordCount: 286,
        impact: 'High',
        possibleFix: 'Data Transformation',
        status: 'Pending'
      },
      {
        id: 'BSAK-46',
        description: 'Duplicate Records',
        recordCount: 53002,
        impact: 'Medium',
        possibleFix: 'Deduplication Process',
        status: 'Pending'
      },
      {
        id: 'BSAK-47',
        description: 'Invalid Data Types',
        recordCount: 10630,
        impact: 'Medium',
        possibleFix: 'Data Validation',
        status: 'Pending'
      },
      {
        id: 'BSAK-48',
        description: 'Missing Required Fields',
        recordCount: 10290,
        impact: 'High',
        possibleFix: 'Data Enrichment',
        status: 'Pending'
      }
    ];

    const sampleResolvedIssues: ResolvedDataQualityIssue[] = [
      {
        id: 'ROW-001',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Archived',
        resolutionDate: new Date('2024-01-10'),
        resolvedBy: 'System Admin'
      },
      {
        id: 'ROW-002',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Archived',
        resolutionDate: new Date('2024-01-15'),
        resolvedBy: 'Data Team'
      },
      {
        id: 'ROW-003',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Archived',
        resolutionDate: new Date('2024-01-20'),
        resolvedBy: 'Data Engineer'
      },
      {
        id: 'ROW-004',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Archived',
        resolutionDate: new Date('2024-01-25'),
        resolvedBy: 'Business Analyst'
      },
      {
        id: 'ROW-005',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Archived',
        resolutionDate: new Date('2024-01-30'),
        resolvedBy: 'Data Team'
      },
      {
        id: 'ROW-006',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Deleted',
        resolutionDate: new Date('2024-02-01'),
        resolvedBy: 'System Admin'
      },
      {
        id: 'ROW-007',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Deleted',
        resolutionDate: new Date('2024-02-05'),
        resolvedBy: 'Data Team'
      },
      {
        id: 'ROW-008',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Deleted',
        resolutionDate: new Date('2024-02-10'),
        resolvedBy: 'Data Engineer'
      },
      {
        id: 'ROW-009',
        xblnr: '1234',
        mandt: '1982',
        bukrs: 'BR10',
        lifnr: '19616',
        umsks: 'UMSK10',
        umskz: 'UMSKZ9',
        status: 'Archived',
        resolutionDate: new Date('2024-02-15'),
        resolvedBy: 'Business Analyst'
      }
    ];

    this.openIssuesSubject.next(sampleOpenIssues);
    this.resolvedIssuesSubject.next(sampleResolvedIssues);
  }

  getOpenIssues(): DataQualityIssue[] {
    return this.openIssuesSubject.value;
  }

  getResolvedIssues(): ResolvedDataQualityIssue[] {
    return this.resolvedIssuesSubject.value;
  }

  resolveIssues(issueIds: string[], resolution: 'archive' | 'ignore' | 'delete', resolvedBy: string = 'Current User') {
    const openIssues = this.getOpenIssues();
    const resolvedIssues = this.getResolvedIssues();
    
    // Find issues to resolve
    const issuesToResolve = openIssues.filter(issue => issueIds.includes(issue.id));
    
    // Remove from open issues
    const remainingOpenIssues = openIssues.filter(issue => !issueIds.includes(issue.id));
    
    // Add to resolved issues
    const newResolvedIssues: ResolvedDataQualityIssue[] = issuesToResolve.map(issue => ({
      id: issue.id,
      xblnr: issue.id, // Using ID as XBLNR for now
      mandt: '100', // Default client
      bukrs: '1000', // Default company code
      lifnr: '12345', // Default vendor
      umsks: '10', // Default special G/L indicator
      umskz: '1', // Default special G/L transaction type
      status: this.mapResolutionToStatus(resolution),
      resolutionDate: new Date(),
      resolvedBy: resolvedBy
    }));

    // Update both subjects
    this.openIssuesSubject.next(remainingOpenIssues);
    this.resolvedIssuesSubject.next([...resolvedIssues, ...newResolvedIssues]);
  }

  private mapResolutionToStatus(resolution: 'archive' | 'ignore' | 'delete'): 'Archived' | 'Deleted' {
    switch (resolution) {
      case 'archive':
        return 'Archived';
      case 'ignore':
        return 'Archived'; // Map ignore to archived
      case 'delete':
        return 'Deleted';
      default:
        return 'Archived';
    }
  }

  addOpenIssue(issue: DataQualityIssue) {
    const currentIssues = this.getOpenIssues();
    this.openIssuesSubject.next([...currentIssues, issue]);
  }

  removeResolvedIssue(issueId: string) {
    const currentResolvedIssues = this.getResolvedIssues();
    const remainingResolvedIssues = currentResolvedIssues.filter(issue => issue.id !== issueId);
    this.resolvedIssuesSubject.next(remainingResolvedIssues);
  }
}
