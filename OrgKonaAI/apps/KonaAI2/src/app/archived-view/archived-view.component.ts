import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface IssueRecord {
  docId: string;
  issueDescription: string;
  recordCount: number;
  impact: 'High' | 'Medium' | 'Low';
  possibleFix: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface ResolvedRecord {
  xblnr: string;
  mandt: string;
  bukrs: string;
  lifnr: string;
  umskS: string;
  umskZ: string;
  fixType: 'Archived' | 'Delete' | 'Ignore';
}

@Component({
  selector: 'app-archived-view',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './archived-view.component.html',
  styleUrls: ['./archived-view.component.scss']
})
export class ArchivedViewComponent implements OnInit {
  activeTab: 'Open' | 'Resolved' = 'Open';
  searchQuery: string = '';
  selectedFilter: string = '';
  activeFilter: string = 'important';
  // Sample data matching the image
   // ---------------- OPEN TAB DATA ----------------
  issueRecords: IssueRecord[] = [
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 10630, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 10290, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 10630, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 10290, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 266, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 54453, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { docId: 'BSAK-44', issueDescription: 'Missing Key Fields', recordCount: 10234, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
  ];
  filteredRecords: IssueRecord[] = [];

  // ---------------- RESOLVED TAB DATA ----------------
  resolvedRecords: ResolvedRecord[] = [
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Archived' },
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Delete' },
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Archived' },
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Ignore' },
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Ignore' },
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Archived' },
    { xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umskS: 'UMSK10', umskZ: 'UMSKZ9', fixType: 'Delete' },
  ];
  
  // Filter counts
  importantCount = 1;
  criticalCount = 16;
  impactsReportingCount = 17;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.filteredRecords = [...this.issueRecords];
    this.route.queryParams.subscribe(params => {
    if (params['activeTab']) {
      this.activeTab = params['activeTab'];
    }
  });
  }

  setActiveTab(tab: 'Open' | 'Resolved'): void {
    this.activeTab = tab;
  }
setActiveFilter(filter: string) {
  this.activeFilter = filter;
}
  onSearchChange(): void {
    console.log('Search input:', this.searchQuery);
    this.filterRecords();
  }

  onBackClick(){
    this.router.navigate(['/archive']);
  }

  selectFilter(filter: string): void {
    this.selectedFilter = this.selectedFilter === filter ? '' : filter;
    this.filterRecords();
  }

  private filterRecords(): void {
    this.filteredRecords = this.issueRecords.filter(record => {
      const matchesSearch = this.searchQuery ? 
        record.docId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        record.issueDescription.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        record.possibleFix.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchesFilter = this.selectedFilter ? 
        (this.selectedFilter === 'Important' && record.impact === 'High') ||
        (this.selectedFilter === 'Critical' && record.impact === 'High') ||
        (this.selectedFilter === 'Impacts Reporting' && record.recordCount > 50000)
        : true;

      return matchesSearch && matchesFilter;
    });
  }

  getImpactClass(impact: string): string {
    switch (impact) {
      case 'High': return 'impact-high';
      case 'Medium': return 'impact-medium';
      case 'Low': return 'impact-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }

  getFixTypeClass(type: string): string {
    switch (type) {
      case 'Archived': return 'fix-archived';
      case 'Delete': return 'fix-delete';
      case 'Ignore': return 'fix-ignore';
      default: return '';
    }
  }
  
  formatNumber(num: number): string {
    return num.toLocaleString();
  }
  reportView(){
    this.router.navigate(['/archive/report']);
  }
}