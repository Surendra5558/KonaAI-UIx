import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Auditor {
  id: string;
  name: string;
  selected: boolean;
  assigned?: string;
}

@Component({
  selector: 'app-alert-edit',
  templateUrl: './alert-edit.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./alert-edit.component.scss']
})
export class AlertEditComponent implements OnInit {
  auditors: Auditor[] = [
    { id: 'l1', name: 'L1 Auditor', selected: false },
    { id: 'l2', name: 'L2 Auditor', selected: false },
    { id: 'l3', name: 'L3 Auditor', selected: true, assigned: 'Michael Johnson' }
  ];

  startDate: string = '20/07/25';
  endDate: string = '';
  priority: string = '';

  priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];

  constructor() { }

  ngOnInit(): void {
  }

  onAuditorToggle(auditor: Auditor): void {
    auditor.selected = !auditor.selected;
    if (!auditor.selected) {
      auditor.assigned = undefined;
    }
  }

  removeAssignedAuditor(auditor: Auditor): void {
    auditor.assigned = undefined;
    auditor.selected = false;
  }

  onSave(): void {
    console.log('Saving alert details:', {
      auditors: this.auditors,
      startDate: this.startDate,
      endDate: this.endDate,
      priority: this.priority
    });
    // Implement save logic here
  }

  onCancel(): void {
    console.log('Cancelling edit');
    // Implement cancel logic here
  }
}