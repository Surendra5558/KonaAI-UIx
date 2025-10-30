import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
CommonModule

@Component({
  selector: 'app-data-staging-holistic',
  imports: [CommonModule],
  templateUrl: './data-staging-holistic.component.html',
  styleUrl: './data-staging-holistic.component.scss'
})
export class DataStagingHolisticComponent {
  projectName = '';
  id: string = '';
  @Input() parentData : string='';
  @Output() dataToParent = new EventEmitter<string>();

  // files = [
  //   {
  //     submodule: 'Invoices',
  //     fileName: 'invoice_jan2025.csv',
  //     sourceSystem: 'SAP',
  //     recordCount: 53002,
  //     uploadedOn: '12 Jun 2025',
  //     modifiedOn: '12 Jun 2025',
  //     dataImport: 'Completed',
  //     dataQuality: 'Completed',
  //     dataStaging: 'In Progress',
  //     dataValidation: 'Pending',
  //     dataMapping: 'Pending'
  //   },
  //   {
  //     submodule: 'Payments',
  //     fileName: 'payments_batch1.csv',
  //     sourceSystem: 'Oracle',
  //     recordCount: 53002,
  //     uploadedOn: '12 Jun 2025',
  //     modifiedOn: '13 Jun 2025',
  //     dataImport: 'Completed',
  //     dataQuality: 'Completed',
  //     dataStaging: 'In Progress',
  //     dataValidation: 'Pending',
  //     dataMapping: 'Pending'
  //   },
  //   {
  //     submodule: 'PO',
  //     fileName: 'po_q1.csv',
  //     sourceSystem: 'SAP',
  //     recordCount: 53002,
  //     uploadedOn: '13 Jun 2025',
  //     modifiedOn: '13 Jun 2025',
  //     dataImport: 'Completed',
  //     dataQuality: 'Completed',
  //     dataStaging: 'In Progress',
  //     dataValidation: 'Pending',
  //     dataMapping: 'Pending'
  //   }
  // ];

stagesOrder = ['import', 'quality', 'staging', 'validation', 'mapping'];

files = [
  {
    submodule: 'Invoices',
    fileName: 'invoice_jan2025.csv',
    sourceSystem: 'SAP',
    recordCount: 53002,
    uploadedOn: '12 Jun 2025',
    modifiedOn: '12 Jun 2025'
  },
  {
    submodule: 'Payments',
    fileName: 'payments_batch1.csv',
    sourceSystem: 'Oracle',
    recordCount: 53002,
    uploadedOn: '12 Jun 2025',
    modifiedOn: '13 Jun 2025'
  },
  {
    submodule: 'PO',
    fileName: 'po_q1.csv',
    sourceSystem: 'SAP',
    recordCount: 53002,
    uploadedOn: '13 Jun 2025',
    modifiedOn: '13 Jun 2025'
  }
];
successCount: number=0;
errorCount: number = 9;
warningCount: number = 7;

getStatus(stage: string) {
  const stageIndex = this.stagesOrder.indexOf(stage);
  const currentIndex = this.stagesOrder.indexOf(this.parentData);

  if (stageIndex < currentIndex) return 'Completed';
  if (stageIndex === currentIndex) return 'Completed';
  return 'In Progress';
}

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.projectName = this.route.snapshot.queryParamMap.get('projectName') || '';
    this.id = this.route.snapshot.queryParamMap.get('id') || '';
    console.log(this.parentData)
  }
  activeTab: string = 'p2p';
  summary = [
    { title: 'Payments', files: 10, success: 10, fail: 0, pending: 0 },
    { title: 'Invoices', files: 10, success: 10, fail: 0, pending: 0 },
    { title: 'Purchase Orders', files: 3, success: 3, fail: 0, pending: 0 }
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  goBack() {
    this.dataToParent.emit(this.parentData);
  }
}
