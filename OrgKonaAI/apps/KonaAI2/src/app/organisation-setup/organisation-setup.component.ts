import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface NodeItem {
  id: string;
  label: string;
  type: string;
  icon: string;
  color: string;
  children?: NodeItem[];
  disabled?: boolean;
}

@Component({
  selector: 'app-organisation-setup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organisation-setup.component.html',
  styleUrls: ['./organisation-setup.component.scss']
})
export class OrganisationSetupComponent {

  // Track expanded nodes
  expandedNodes = new Set<string>();

  nodes: NodeItem[] = [
    { id: 'audit', label: 'Audit Responsibility', type: 'audit', icon: '👤', color: '#ec4899' },
    { id: 'risk', label: 'Risk Area', type: 'risk', icon: '⚠️', color: '#ef4444' },
    { 
      id: 'module', 
      label: 'Module', 
      type: 'module', 
      icon: '$', 
      color: '#f59e0b',
      children: [
        { id: 'p2p', label: 'P2P', type: 'p2p', icon: '⚙️', color: '#f59e0b' },
        { id: 'o2c', label: 'O2C', type: 'o2c', icon: '⚠️', color: '#f59e0b' },
        { id: 'te', label: 'T&E', type: 't-e', icon: '⚠️', color: '#9ca3af', disabled: true }
      ]
    },
    { id: 'source', label: 'Source System', type: 'source', icon: '🗄️', color: '#8b5cf6' }
  ];

  toggleExpand(nodeId: string) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }

  isExpanded(nodeId: string) {
    return this.expandedNodes.has(nodeId);
  }

  addNode(nodeType: string) {
    const newNodeName = prompt(`Enter name for new ${nodeType} node:`);
    if (newNodeName) {
      console.log(`Node added: ${nodeType} - ${newNodeName}`);
    }
  }

  zoomIn() { console.log('Zoom In'); }
  zoomOut() { console.log('Zoom Out'); }
  fitToView() { console.log('Fit to View'); }
  arrangeNodes() { console.log('Arrange Nodes'); }
  defineDataRenewalFrequency() { console.log('Define Data Renewal'); }
  publish() { console.log('Publish Configuration'); }
}
