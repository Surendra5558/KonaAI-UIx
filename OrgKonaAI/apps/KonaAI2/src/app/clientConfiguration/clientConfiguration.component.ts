import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface SourceSystemMapping {
  sourceSystem: string;
  fieldMapping: string;
  status: 'Configured' | 'Not Configured';
}


@Component({
  selector: 'app-clientConfiguration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientConfiguration.component.html',
  styleUrls: ['./clientConfiguration.component.scss']
})
export class ClientConfigurationComponent {
  enabledModules = [
    { name: 'P2P', enabled: true },
    { name: 'O2C', enabled: true },
    { name: 'T&E', enabled: true },
    { name: 'Procurement', enabled: false },
    { name: 'Risk Management', enabled: false }
  ];

  riskAreas: string[] = [];
  selectedRiskArea = '';

  sourceSystemMappings: SourceSystemMapping[] = [
    {
      sourceSystem: 'SAP ERP',
      fieldMapping: 'Vendor Master ← Client.Vendor',
      status: 'Configured'
    },
    {
      sourceSystem: 'Oracle Financials',
      fieldMapping: 'GL Accounts ← Chart of Accounts',
      status: 'Configured'
    }
  ];

  onSaveChanges() {
    console.log('Saving changes...');
    // Implement save logic here
  }

  onReset() {
    console.log('Resetting changes...');
    // Implement reset logic here
  }

  onRiskAreaChange(event: any) {
    this.selectedRiskArea = event.target.value;
  }
}