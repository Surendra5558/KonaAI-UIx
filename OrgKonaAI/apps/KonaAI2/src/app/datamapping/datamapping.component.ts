import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MappingdetailsComponent } from '../mappingdetails/mappingdetails.component';

interface StagedData {
  submodule: string;
  recordCount: number;
  excludeCount: number;
  status: string;
}

@Component({
  selector: 'app-datamapping',
  standalone: true,
  imports: [CommonModule, MatTableModule, MappingdetailsComponent],
  templateUrl: './datamapping.component.html',
  styleUrl: './datamapping.component.scss'
})
export class DatamappingComponent {
  onDownload(_t25: StagedData) {
    throw new Error('Method not implemented.');
  }

  isSidebarPinned: boolean = false;
  showDetailsScreen = false;
  sub: Subscription;
  successCount: number = 3;
  errorCount: number = 0;
  warningCount: number = 0;

  constructor(
    private route: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.sub = this.authService.sidebarValue$.subscribe(val => {
      this.isSidebarPinned = val;
    });
  }

  // --- Sample Data ---
  data: StagedData[] = [
    { submodule: 'Invoices', recordCount: 1250, excludeCount: 109, status: 'Completed' },
    { submodule: 'Payments', recordCount: 1450, excludeCount: 97, status: 'Completed' },
    { submodule: 'Purchase Order', recordCount: 2505, excludeCount: 145, status: 'Completed' },

  ];

  // --- Pagination Logic ---
  page: number = 1;
  pageSize: number = 3;
  totalPages: number = 1;
  paginatedData: StagedData[] = [];

  ngOnInit() {
    this.totalPages = Math.ceil(this.data.length / this.pageSize);
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  onPageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.page > 1) {
      this.page--;
    } else if (direction === 'next' && this.page < this.totalPages) {
      this.page++;
    }
    this.updatePaginatedData();
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.updatePaginatedData();
    }
  }

  goToMapping(submodule: string) {
    this.showDetailsScreen = true;
    this.authService.backDataTab.next(true);
  }

  handleChildEvent(result: any) {
    this.showDetailsScreen = false;
    this.authService.backDataTab.next(false);
  }
}
