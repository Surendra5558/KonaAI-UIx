import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AuditFile {
  submodule: string;
  fileName: string;
  sourceSystem: string;
  recordCount: string;
  uploadedOn: string;
  modifiedOn: string;
  status: string;
}

@Component({
  selector: 'app-holistic-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './holistic-view.component.html',
  styleUrls: ['./holistic-view.component.scss']
})
export class HolisticViewComponent implements OnInit {

  summary = [
    { title: 'Payments', files: 1, success: 1, fail: 0, pending: 0 },
    { title: 'Invoices', files: 1, success: 1, fail: 0, pending: 0 },
    { title: 'Purchase Orders', files: 3, success: 3, fail: 0, pending: 0 }
  ];

  files: AuditFile[] = [
    { submodule: 'Invoices', fileName: 'invoice_jan2025.csv', sourceSystem: 'SAP', recordCount: '53,002', uploadedOn: '10 Jun 2025', modifiedOn: '12 Jun 2025', status: 'Completed' },
    { submodule: 'Payments', fileName: 'payments_batch1.csv', sourceSystem: 'Oracle', recordCount: '53,002', uploadedOn: '12 Jun 2025', modifiedOn: '13 Jun 2025', status: 'Completed' },
    { submodule: 'PO', fileName: 'po_q1.csv', sourceSystem: 'SAP', recordCount: '53,002', uploadedOn: '13 Jun 2025', modifiedOn: '13 Jun 2025', status: 'Completed' },
    { submodule: 'PO', fileName: 'po_q2.csv', sourceSystem: 'Oracle', recordCount: '53,002', uploadedOn: '13 Jun 2025', modifiedOn: '13 Jun 2025', status: 'Completed' },
    { submodule: 'PO', fileName: 'po_vendor.csv', sourceSystem: 'Oracle', recordCount: '53,002', uploadedOn: '13 Jun 2025', modifiedOn: '13 Jun 2025', status: 'Completed' },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void { }
  onBackClick(){
    this.router.navigate(['/data']);
  }
}
