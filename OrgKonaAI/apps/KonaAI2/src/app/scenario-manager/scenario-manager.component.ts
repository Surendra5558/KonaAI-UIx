import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeletePopupComponent, DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';

interface Scenario {
  id: number;
  scenarioName: string;
  createdBy: string;
  triggerType: string;
  lastExecutedOn: string;
  alerts: number;
  isActive: boolean;
}

interface TestDetail {
  testName: string;
  parameter: string;
  columnId: string;
  condition: string;
  value: string;
}

@Component({
  selector: 'app-scenario-manager',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DeletePopupComponent
  ],
  templateUrl: './scenario-manager.component.html',
  styleUrls: ['./scenario-manager.component.scss']
})
export class ScenarioManagerComponent implements OnInit {
  scenarios: Scenario[] = [
    {
      id: 1,
      scenarioName: 'Duplicate Business Check',
      createdBy: 'Manual - Johnson',
      triggerType: 'Automatic',
      lastExecutedOn: '16 Jun 2021, 5:15 PM',
      alerts: 1,
      isActive: true
    },
    {
      id: 2,
      scenarioName: 'Weekend Transactions',
      createdBy: 'Jane Smith',
      triggerType: 'Manual',
      lastExecutedOn: '16 Jul 2021, 5:50 PM',
      alerts: 3,
      isActive: true
    },
    {
      id: 3,
      scenarioName: 'Frequent Employee Claims',
      createdBy: 'Jane Smith',
      triggerType: 'Manual',
      lastExecutedOn: '',
      alerts: 4,
      isActive: false
    },
    {
      id: 4,
      scenarioName: 'Refund Private Vendor',
      createdBy: 'Jane Smith',
      triggerType: 'Automatic',
      lastExecutedOn: '12 Apr 2021, 3:42 PM',
      alerts: 1,
      isActive: true
    }
  ];
  deleteData: DeletePopupData = {
    title: 'Delete File',
    message: 'Are you sure you want to delete',
    itemName: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };
  filteredScenarios: Scenario[] = [];
  searchTerm: string = '';

  // Modal states
  showDeleteModal: boolean = false;
  showPreviewModal: boolean = false;
  showTriggerModal: boolean = false;
  showEditModal: boolean = false;

  selectedScenario: Scenario | null = null;

  // Preview modal data
  previewData = {
    scenarioName: 'Weekend Transactions',
    dataDetails: {
      database: 'Invoice Amount',
      operations: 'greater than',
      value: '₹1,50,000'
    },
    testDetails: [
      {
        testName: 'PAYTHRESH1-Payment clearance on same date of Physical Deposit',
        parameter: 'Invoice Amount',
        columnId: 'AmtDCB',
        condition: '',
        value: '30'
      },
      {
        testName: 'PAYTHRESH1-Payment clearance on same date of Physical Deposit',
        parameter: 'Invoice Amount',
        columnId: 'AmtDCB',
        condition: '',
        value: '30'
      }
    ]
  };
  showDeletePopup: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredScenarios = [...this.scenarios];
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredScenarios = [...this.scenarios];
    } else {
      this.filteredScenarios = this.scenarios.filter(scenario =>
        scenario.scenarioName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        scenario.createdBy.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        scenario.triggerType.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onNewScenario(): void {
    // Logic for creating new scenario
    console.log('Create new scenario clicked');
  }

  onEditScenario(name: string) {
    this.router.navigate(['/edit-scenario', name]);
  }

  onDeleteScenario(scenario: Scenario): void {
    this.selectedScenario = scenario;
    this.deleteData = {
      ...this.deleteData,
      itemName: scenario.scenarioName
    };
    this.showDeletePopup = true;
  }

  onTriggerScenario(scenario: Scenario): void {
    this.selectedScenario = scenario;
    this.showTriggerModal = true;
  }

  onPreviewScenario(scenario: Scenario): void {
    this.selectedScenario = scenario;
    this.showPreviewModal = true;
  }

  confirmDelete(): void {
    if (this.selectedScenario) {
      this.scenarios = this.scenarios.filter(s => s.id !== this.selectedScenario!.id);
      this.onSearch(); // Refresh filtered list
      this.closeDeleteModal();
    }
  }

  confirmTrigger(): void {
    if (this.selectedScenario) {
      // Logic to trigger scenario
      console.log('Triggering scenario:', this.selectedScenario.scenarioName);
      this.closeTriggerModal();
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedScenario = null;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedScenario = null;
  }

  closeTriggerModal(): void {
    this.showTriggerModal = false;
    this.selectedScenario = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedScenario = null;
  }

  exportReport(): void {
    console.log('Export report clicked');
  }
  handleDeleteResult(result: DeletePopupResult) {
    this.showDeletePopup = false;
    if (result.confirmed && this.selectedScenario) {
      this.scenarios = this.scenarios.filter(s => s.id !== this.selectedScenario!.id);
      this.onSearch(); // refresh filtered list
      this.selectedScenario = null;
    }
  }
}