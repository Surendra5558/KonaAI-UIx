import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface TableRow {
  id: number;
  xblnr: string;
  mandt: string;
  bukrs: string;
  lifnr: string;
  umsks: string;
  umskz: string;
  selected?: boolean;
}

@Component({
  selector: 'app-archive-report',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './archive-report.component.html',
  styleUrls: ['./archive-report.component.scss']
})

export class ArchiveReportComponent implements OnInit {
  searchQuery: string = '';
  selectedAction: string = '';
  currentPage: number = 1;
  totalItems: number = 2069;
  itemsPerPage: number = 15;
  totalPages: number = Math.ceil(this.totalItems / this.itemsPerPage);

  data: TableRow[] = [
    { id: 1, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: true },
    { id: 2, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: true },
    { id: 3, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: true },
    { id: 4, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: false },
    { id: 5, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: true },
    { id: 6, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: true },
    { id: 7, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: false },
    { id: 8, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: false },
    { id: 9, xblnr: '1234', mandt: '1982', bukrs: 'BR10', lifnr: '19616', umsks: 'UMSK10', umskz: 'UMSKZ9', selected: false }
  ];
  filteredData: TableRow[] = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  get selectedCount(): number {
    return this.data.filter(item => item.selected).length;
  }

  get hasSelectedItems(): boolean {
    return this.selectedCount > 0;
  }

  get isAllSelected(): boolean {
    return this.data.length > 0 && this.data.every(item => item.selected);
  }

  get isIndeterminate(): boolean {
    const selectedCount = this.selectedCount;
    return selectedCount > 0 && selectedCount < this.data.length;
  }

  toggleAll(): void {
    const shouldSelectAll = !this.isAllSelected;
    this.data.forEach(item => item.selected = shouldSelectAll);
  }

  toggleRow(row: TableRow): void {
    row.selected = !row.selected;
  }

  closeSelection(): void {
    this.data.forEach(item => item.selected = false);
  }

  applyAction(): void {
    const selectedItems = this.data.filter(item => item.selected);
    console.log(`Applying ${this.selectedAction} to`, selectedItems);
    // Implement action logic here
    this.router.navigate(['/archive/view'], { queryParams: { activeTab: 'Resolved' } });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    // Implement pagination logic
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  onBackClick(){
    this.router.navigate(['/archive/view']);
  }
  onSearch(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (query) {
      this.filteredData = this.data.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(query)
        )
      );
    } else {
      this.filteredData = [...this.data];
    }
  }
}