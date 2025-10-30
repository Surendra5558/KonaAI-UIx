// vm-details.component.ts
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

// Angular Material modules
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-vm-details',
    templateUrl: './vm-details.component.html',
    styleUrls: ['./vm-details.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatButtonModule,
        MatSortModule
    ],
    standalone: true,

})
export class VmDetailsComponent implements OnInit {

    showBanner = true;
    toastTimeout: any;
    selectedCount = 0;
    searchText = '';
    displayedColumns = ['select', 'XBLNR', 'MANDT', 'BUKRS', 'LIFNR', 'UMSKS', 'UMSKZ', 'Status'];
    @Input() parentData!: string;
    @Output() dataToParent = new EventEmitter<string>();
    selectedRows: any[] = [];

    dataSource = [
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Failed' },
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Passed' },
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Failed' },
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Passed' },
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Failed' },
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Passed' },
        { XBLNR: '1234', MANDT: '1982', BUKRS: 'BR10', LIFNR: '19616', UMSKS: 'UMSK10', UMSKZ: 'UMSKZ9', Status: 'Failed' }
        // ...
    ];
    showToast: boolean = false;

    constructor(private router: Router) {
        console.log(this.parentData)
    }
    ngOnInit(): void {
        console.log(this.parentData)
    }

    toggleRowSelection(row: any, event: any) {
        if (event.checked) {
            this.selectedRows.push(row);
        } else {
            this.selectedRows = this.selectedRows.filter(r => r !== row);
        }
        this.selectedCount = this.selectedRows.length;
    }
    goBack() {
        this.dataToParent.emit('Message from Child ✅');
    }
    reExtract() {
        this.selectedRows.forEach(row => row.Status = 'Re-Executing');

        this.showToast = true;
        this.toastTimeout = setTimeout(() => {
            this.showToast = false;
        }, 5000);
        this.selectedRows = [];
        this.selectedCount = 0;
    }

    closeToast() {
        this.showToast = false;
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
    }

    closePopup() {
         this.selectedRows = [];
        this.selectedCount = 0;
 
    }   
}
