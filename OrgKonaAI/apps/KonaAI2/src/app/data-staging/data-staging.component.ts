import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArchivePopupComponent, ArchivePopupData, ArchivePopupResult } from '../shared/components/archive-popup/archive-popup.component';

@Component({
  selector: 'app-data-staging',
  standalone: true,
  imports: [CommonModule, FormsModule, ArchivePopupComponent],
  templateUrl: './data-staging.component.html',
  styleUrls: ['./data-staging.component.scss']
})
export class DataStagingComponent {
  popupData: ArchivePopupData = {
    title: 'Archive Data',
    message: 'Do you really want to archive',
    itemName: '',
    confirmText: 'Archive',
    cancelText: 'Cancel'
  };

  showPopup = false;
  successCount = 5;
  errorCount = 2;
  warningCount = 4;

  groupedData = [
    {
      submodule: 'Invoices',
      files: [
        {
          sourceSystem: 'SAP',
          recordCount: 1250,
          fileName: 'invoice_jan2025.csv',
          uploadedOn: new Date('2025-06-10'),
          modifiedOn: new Date('2025-06-12')
        }
      ]
    },
    {
      submodule: 'Payments',
      files: [
        {
          sourceSystem: 'Oracle',
          recordCount: 1450,
          fileName: 'payments_batch1.csv',
          uploadedOn: new Date('2025-06-12'),
          modifiedOn: new Date('2025-06-13')
        }
      ]
    },
    {
      submodule: 'Purchase Order',
      files: [
        {
          sourceSystem: 'SAP',
          recordCount: 875,
          fileName: 'po_q1.csv',
          uploadedOn: new Date('2025-06-13'),
          modifiedOn: new Date('2025-06-13')
        },
        {
          sourceSystem: 'Oracle',
          recordCount: 720,
          fileName: 'po_q2.csv',
          uploadedOn: new Date('2025-06-13'),
          modifiedOn: new Date('2025-06-13')
        },
        {
          sourceSystem: 'Oracle',
          recordCount: 910,
          fileName: 'po_vendor.csv',
          uploadedOn: new Date('2025-06-13'),
          modifiedOn: new Date('2025-06-13')
        }
      ]
    }
  ];

  // 🔹 Flattened file list for the table
  allFiles = this.groupedData.flatMap(group =>
    group.files.map(file => ({
      ...file,
      submodule: group.submodule
    }))
  );

  openArchivePopup(itemName: string) {
    this.popupData = { ...this.popupData, itemName };
    this.showPopup = true;
  }

  handlePopupResult(result: ArchivePopupResult) {
    this.showPopup = false;

    if (result.confirmed) {
      console.log('Archiving:', result.data?.itemName);
      // Call archive API
    } else {
      console.log('Archive cancelled');
    }
  }
}
