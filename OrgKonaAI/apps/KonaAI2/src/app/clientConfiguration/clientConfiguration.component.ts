import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Connection {
  provider: string;
  connectionName: string;
  createdBy: string;
  createdOn: string;
  status: string;
}

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
    { name: 'T&E', enabled: true }
  ];

  riskAreas= [
    { name: 'Financial', enabled: true },
    { name: 'Operational', enabled: true },
    { name: 'Compilance', enabled: true },
    { name: 'Strategic', enabled: true }
  ];
  selectedRiskArea = '';

  connections: Connection[] = [
    {
      provider: 'Microsoft Azure AD',
      connectionName: 'Azure SSO Integration',
      createdBy: 'Sarah Johnson',
      createdOn: '2024-10-15',
      status: 'Completed'
    },
    {
      provider: 'AWS S3',
      connectionName: 'Document Storage',
      createdBy: 'Michael Chen',
      createdOn: '2024-10-20',
      status: 'Completed'
    },
    {
      provider: 'Slack',
      connectionName: 'Notification Service',
      createdBy: 'Emily Rodriguez',
      createdOn: '2024-10-25',
      status: 'Failed'
    },
    {
      provider: 'SendGrid',
      connectionName: 'Email Notifications',
      createdBy: 'Sarah Johnson',
      createdOn: '2024-10-22',
      status: 'Completed'
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