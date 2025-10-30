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
  standalone:true,
  imports: [CommonModule,MatTableModule, MappingdetailsComponent],
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
   constructor(private route: Router, private authService: AuthService, private dialog: MatDialog) {
    this.sub = this.authService.sidebarValue$.subscribe(val => {
      this.isSidebarPinned = val;
    });
  }

  data: StagedData[] = [
    { submodule: 'Invoices', recordCount: 1250, excludeCount: 109, status: 'Completed' },
    { submodule: 'Payments', recordCount: 1450, excludeCount: 97, status: 'Completed' },
    { submodule: 'Purchase Order', recordCount: 2505, excludeCount: 145, status: 'Completed' }
  ];
  
goToMapping(submodule: string) {
  // const formatted = submodule.toLowerCase().replace(/\s+/g, '-');
  // console.log('Navigating to:', `/mappingdetails/${formatted}`);
  // this.route.navigate(['/mappingdetails', formatted]);
  this.showDetailsScreen = true;
  this.authService.backDataTab.next(true);
}
 handleChildEvent(result: any) {
  this.showDetailsScreen = false;
  this.authService.backDataTab.next(false);
 }
}
