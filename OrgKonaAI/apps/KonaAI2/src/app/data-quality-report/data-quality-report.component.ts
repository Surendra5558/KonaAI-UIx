import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface ReportRow {
  xblnr: string;
  mandt: string;
  bukrs: string;
  lifnr: string;
  umsks: string;
  umskz: string;
  selected?: boolean;
}

@Component({
  selector: 'app-data-quality-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-quality-report.component.html',
  styleUrl: './data-quality-report.component.scss'
})
export class DataQualityReportComponent implements OnInit {
  issueId: string = '';
  searchQuery: string = '';
  
  // Dynamic table data
  tableRows: ReportRow[] = [
    { xblnr: '1000000001', mandt: '100', bukrs: '1000', lifnr: 'VENDOR001', umsks: 'A', umskz: '1' },
    { xblnr: '1000000002', mandt: '100', bukrs: '1000', lifnr: 'VENDOR002', umsks: 'B', umskz: '2' },
    { xblnr: '1000000003', mandt: '100', bukrs: '1000', lifnr: 'VENDOR003', umsks: 'C', umskz: '3' },
    { xblnr: '1000000004', mandt: '100', bukrs: '1000', lifnr: 'VENDOR004', umsks: 'D', umskz: '4' },
    { xblnr: '1000000005', mandt: '100', bukrs: '1000', lifnr: 'VENDOR005', umsks: 'E', umskz: '5' },
    { xblnr: '1000000006', mandt: '100', bukrs: '1000', lifnr: 'VENDOR006', umsks: 'F', umskz: '6' },
    { xblnr: '1000000007', mandt: '100', bukrs: '1000', lifnr: 'VENDOR007', umsks: 'G', umskz: '7' },
    { xblnr: '1000000008', mandt: '100', bukrs: '1000', lifnr: 'VENDOR008', umsks: 'H', umskz: '8' },
    { xblnr: '1000000009', mandt: '100', bukrs: '1000', lifnr: 'VENDOR009', umsks: 'I', umskz: '9' },
    { xblnr: '1000000010', mandt: '100', bukrs: '1000', lifnr: 'VENDOR010', umsks: 'J', umskz: '10' }
  ];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100];

  // Selection popup
  showSelectionPopup: boolean = false;
  selectedResolution: string = 'archive';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.issueId = this.route.snapshot.paramMap.get('id') || 'BSAK-44';
  }

  goBack() {
    this.router.navigate(['/data-quality-detail', this.issueId]);
  }

  // Get filtered rows based on search
  get filteredRows(): ReportRow[] {
    if (!this.searchQuery.trim()) {
      return this.tableRows;
    }
    
    return this.tableRows.filter(row => 
      row.xblnr.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      row.mandt.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      row.bukrs.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      row.lifnr.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      row.umsks.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      row.umskz.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Pagination methods
  get paginatedRows(): ReportRow[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRows.slice(startIndex, endIndex);
  }

  get totalItems(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pageStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get pageEndIndex(): number {
    return Math.min(this.pageStartIndex + this.itemsPerPage, this.totalItems);
  }

  // Selection methods
  get allSelected(): boolean {
    return this.paginatedRows.length > 0 && this.paginatedRows.every(row => row.selected);
  }

  toggleSelectAll(checked: boolean) {
    this.paginatedRows.forEach(row => row.selected = checked);
  }

  onRowCheckboxChange() {
    const selectedCount = this.paginatedRows.filter(row => row.selected).length;
    if (selectedCount > 0) {
      this.showSelectionPopup = true;
    } else {
      this.showSelectionPopup = false;
    }
  }

  getSelectedCount(): number {
    return this.paginatedRows.filter(row => row.selected).length;
  }

  closeSelectionPopup() {
    this.showSelectionPopup = false;
  }

  applyResolution() {
    const selectedRows = this.tableRows.filter(row => row.selected);
    console.log(`Applying ${this.selectedResolution} to ${selectedRows.length} rows`);
    
    // Here you would typically make an API call to apply the resolution
    // For now, we'll just remove the selected rows from the table
    selectedRows.forEach(row => {
      const index = this.tableRows.indexOf(row);
      if (index > -1) {
        this.tableRows.splice(index, 1);
      }
    });
    
    this.closeSelectionPopup();
  }

  // Pagination navigation
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  setItemsPerPage(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset to first page
  }

  // Page number display logic
  visiblePageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
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
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (this.currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }
}


