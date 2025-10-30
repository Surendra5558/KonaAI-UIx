import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataQualityService, DataQualityIssue, ResolvedDataQualityIssue } from '../data-quality.service';

interface TableRow {
  id: string;
  description: string;
  recordCount: number;
  impact: 'High' | 'Medium' | 'Low';
  possibleFix: string;
  status: 'Pending' | 'Resolved' | 'Archived' | 'Deleted';
  selected?: boolean;
}

@Component({
  selector: 'app-data-quality-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-quality-detail.component.html',
  styleUrl: './data-quality-detail.component.scss'
})
export class DataQualityDetailComponent implements OnInit {
  issueId: string = '';

  // UI state for tabs and categories
  activeMainTab: string = 'Open';
  activeCategory: 'Important' | 'Critical' | 'Impacts Reporting' = 'Impacts Reporting';
  @Output() backtoIntial = new EventEmitter<any>();

  dataQualityIssues: DataQualityIssue[] = [];
  resolvedIssues: ResolvedDataQualityIssue[] = [];
  filteredOpenIssues: DataQualityIssue[] = [];
  filteredResolvedIssues: ResolvedDataQualityIssue[] = [];
  
  // Dynamic table data
  tableRows: TableRow[] = [
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 10630, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 10290, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 286, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 53002, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 10630, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 10290, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 266, impact: 'High', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 54453, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 10234, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' },
    { id: 'BSAK-44', description: 'Missing Key Fields', recordCount: 234, impact: 'Medium', possibleFix: 'Fix or Re-extract', status: 'Pending' }
  ];
  
  // Search functionality
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataQualityService: DataQualityService
  ) {}

  ngOnInit() {
    this.issueId = this.route.snapshot.paramMap.get('id') || '';
    
    // Subscribe to open issues from the service
    this.dataQualityService.openIssues$.subscribe(issues => {
      this.dataQualityIssues = issues;
      this.filterAndPaginateData();
    });

    // Subscribe to resolved issues from the service
    this.dataQualityService.resolvedIssues$.subscribe(issues => {
      this.resolvedIssues = issues;
      this.filterAndPaginateData();
    });
  }

  goBack() {
    this.router.navigate(['/data/Q1%2024%20Procurement%20Audit']);
   
  }

  // Handlers for UI state
  setMainTab(tab: string) {
    this.activeMainTab = tab;
    this.currentPage = 1; // Reset to first page when switching tabs
    this.filterAndPaginateData();
  }

  setCategory(category: 'Important' | 'Critical' | 'Impacts Reporting') {
    this.activeCategory = category;
    this.currentPage = 1; // Reset to first page when changing category
    this.filterAndPaginateData();
  }

  // Search functionality
  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPage = 1; // Reset to first page when searching
    this.filterAndPaginateData();
  }

  // Filter and paginate data based on current state
  filterAndPaginateData() {
    if (this.activeMainTab === 'Open') {
      let dataToFilter = this.dataQualityIssues;

      // Apply category filter (for Open tab only)
      if (this.activeCategory === 'Important') {
        dataToFilter = dataToFilter.filter(issue => issue.impact === 'High');
      } else if (this.activeCategory === 'Critical') {
        dataToFilter = dataToFilter.filter(issue => issue.impact === 'High' || issue.impact === 'Medium');
      } else if (this.activeCategory === 'Impacts Reporting') {
        dataToFilter = dataToFilter; // Show all for Impacts Reporting
      }

      // Apply search filter
      if (this.searchTerm.trim()) {
        dataToFilter = dataToFilter.filter(issue => 
          issue.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          issue.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          issue.possibleFix.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      this.filteredOpenIssues = dataToFilter;
    } else {
      // Resolved tab
      let dataToFilter = this.resolvedIssues;

      // Apply search filter
      if (this.searchTerm.trim()) {
        dataToFilter = dataToFilter.filter(issue => 
          issue.xblnr.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          issue.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          issue.mandt.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      this.filteredResolvedIssues = dataToFilter;
    }
  }

  // Get filtered table rows based on current state
  get filteredTableRows(): TableRow[] {
    let rows = this.tableRows;

    // Apply category filter
    if (this.activeCategory === 'Important') {
      rows = rows.filter(row => row.impact === 'High');
    } else if (this.activeCategory === 'Critical') {
      rows = rows.filter(row => row.impact === 'High' || row.impact === 'Medium');
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      rows = rows.filter(row => 
        row.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        row.possibleFix.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return rows;
  }

  // Pagination methods for table rows
  get paginatedTableRows() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTableRows.slice(startIndex, endIndex);
  }

  get totalTablePages() {
    return Math.ceil(this.filteredTableRows.length / this.itemsPerPage);
  }

  // Pagination methods
  get paginatedIssues() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    if (this.activeMainTab === 'Open') {
      return this.filteredOpenIssues.slice(startIndex, endIndex);
    } else {
      return this.filteredResolvedIssues.slice(startIndex, endIndex);
    }
  }

  get totalPages() {
    if (this.activeMainTab === 'Open') {
      return Math.ceil(this.filteredOpenIssues.length / this.itemsPerPage);
    } else {
      return Math.ceil(this.filteredResolvedIssues.length / this.itemsPerPage);
    }
  }

  get pageNumbers() {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (this.currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset to first page
    this.filterAndPaginateData();
  }

  openReport(issue: DataQualityIssue | ResolvedDataQualityIssue) {
    this.router.navigate(['/data-quality-report', issue.id]);
  }

  navigateToReport(issueId: string) {
    this.router.navigate(['/data-quality-report', issueId]);
  }

  // Action methods for resolved issues
  restoreIssue(issue: DataQualityIssue | ResolvedDataQualityIssue) {
    // Check if this is a resolved issue
    if ('resolutionDate' in issue) {
      const resolvedIssue = issue as ResolvedDataQualityIssue;
      // Convert resolved issue back to open issue
      const openIssue: DataQualityIssue = {
        id: resolvedIssue.id,
        description: `Restored from ${resolvedIssue.status} - XBLNR: ${resolvedIssue.xblnr}`,
        recordCount: 1, // Default record count for restored issues
        impact: 'Medium', // Default impact for restored issues
        possibleFix: 'Review and validate restored data',
        status: 'Pending'
      };
      
      this.dataQualityService.addOpenIssue(openIssue);
      this.dataQualityService.removeResolvedIssue(resolvedIssue.id);
    }
  }

  deleteIssue(issue: DataQualityIssue | ResolvedDataQualityIssue) {
    // Check if this is a resolved issue
    if ('resolutionDate' in issue) {
      const resolvedIssue = issue as ResolvedDataQualityIssue;
      if (confirm(`Are you sure you want to permanently delete issue ${resolvedIssue.id}?`)) {
        this.dataQualityService.removeResolvedIssue(resolvedIssue.id);
      }
    }
  }

  // Helper methods for template
  getImportantCount(): number {
    return this.dataQualityIssues.filter(issue => issue.impact === 'High').length;
  }

  getCriticalCount(): number {
    return this.dataQualityIssues.filter(issue => issue.impact === 'High' || issue.impact === 'Medium').length;
  }

  getTotalCount(): number {
    return this.dataQualityIssues.length;
  }

  getMath(): any {
    return Math;
  }

  // Helper method to get current filtered issues length
  getCurrentFilteredIssuesLength(): number {
    if (this.activeMainTab === 'Open') {
      return this.filteredOpenIssues.length;
    } else {
      return this.filteredResolvedIssues.length;
    }
  }

  // Format number with commas
  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
