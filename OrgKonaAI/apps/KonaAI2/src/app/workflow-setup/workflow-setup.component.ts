// workflow-setup.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TestRule {
  id: string;
  description: string;
  status: boolean;
  riskScore: number;
}

@Component({
  selector: 'app-workflow-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-setup.component.html',
  styleUrl: './workflow-setup.component.scss'
})
export class WorkflowSetupComponent implements OnInit {
  activeTab = 'P2P';
  showParametersPopup = false;
  selectedRuleId: string | null = null;
  // Define all available categories
  categories = [
    'Anti Corruption',
    'Fraud Monitoring',
    'DCC Test/Flag',
    'Potential Cost Recovery',
    'High Risk Analysis',
    'Internal Controls',
    'Policy Violation',
    'Statistical Testing'
  ];

  testRulesData: Record<string, TestRule[]> = {
    'Anti Corruption': [
      { id: 'P2PCIPY111', description: 'Payments made to different vendors using the same phone number', status: true, riskScore: 5 },
      { id: 'P2PCIPY112', description: 'Payments made to different vendors using the same bank account', status: true, riskScore: 5 },
      { id: 'P2PCIPY113', description: 'Payments made to different vendors using the same tax ID', status: false, riskScore: 5 },
      { id: 'P2PCIPY114', description: 'Payments made to different vendors using the same email ID', status: false, riskScore: 5 },
      { id: 'P2PCIPY115', description: 'Payments made to different vendors using the same address', status: true, riskScore: 5 },
      { id: 'P2PCIPY116', description: 'Vendors registered with personal email domains (e.g., Gmail, Yahoo, etc.)', status: true, riskScore: 5 },
      { id: 'P2PCIPY141', description: 'Payments made to vendors where the phone number matches an employee\'s', status: true, riskScore: 5 },
      { id: 'P2PCIPY142', description: 'Payments made to vendors where the bank account matches an employee\'s', status: false, riskScore: 5 },
      { id: 'P2PCIPY143', description: 'Payments made to vendors where the tax ID matches an employee\'s', status: true, riskScore: 5 },
      { id: 'P2PCIPY144', description: 'Payments to vendors using an employee\'s personal or emergency contact email', status: true, riskScore: 5 }
    ],
    'Fraud Monitoring': [
      { id: 'FRAUD001', description: 'Duplicate invoice detection', status: true, riskScore: 7 },
      { id: 'FRAUD002', description: 'Unusual payment patterns', status: true, riskScore: 6 },
      { id: 'FRAUD003', description: 'Suspicious vendor registration patterns', status: false, riskScore: 8 },
      { id: 'FRAUD004', description: 'Abnormal transaction amounts', status: true, riskScore: 6 }
    ],
    'DCC Test/Flag': [
      { id: 'DCC001', description: 'Data consistency check for vendor information', status: true, riskScore: 4 },
      { id: 'DCC002', description: 'Flag incomplete transaction records', status: true, riskScore: 3 }
    ],
    'Potential Cost Recovery': [
      { id: 'PCR001', description: 'Identify overpayments to vendors', status: true, riskScore: 7 },
      { id: 'PCR002', description: 'Duplicate payment detection', status: true, riskScore: 8 }
    ],
    'High Risk Analysis': [
      { id: 'HRA001', description: 'High-value transaction monitoring', status: true, riskScore: 9 },
      { id: 'HRA002', description: 'Vendor risk assessment', status: false, riskScore: 7 }
    ],
    'Internal Controls': [
      { id: 'IC001', description: 'Approval workflow compliance', status: true, riskScore: 6 },
      { id: 'IC002', description: 'Segregation of duties verification', status: true, riskScore: 8 }
    ],
    'Policy Violation': [
      { id: 'PV001', description: 'Purchase order limit violations', status: true, riskScore: 5 },
      { id: 'PV002', description: 'Unauthorized vendor payments', status: false, riskScore: 9 }
    ],
    'Statistical Testing': [
      { id: 'ST001', description: 'Benford\'s Law analysis', status: true, riskScore: 4 },
      { id: 'ST002', description: 'Outlier detection in payment amounts', status: true, riskScore: 6 }
    ]
  };
  conditions: {
    logicalOperator?: string;
    column: string;
    operator: string;
    value: string
  }[] = [];
  condition = {
    operator: 'equals'  // default selected value
  };

  operators = [
    { label: 'Equals', value: 'equals' },
    { label: 'Does not equal', value: 'not_equals' },
    { label: 'Less than', value: 'less_than' },
    { label: 'Less than and equal to', value: 'less_than_equal' },
    { label: 'Greater than', value: 'greater_than' },
    { label: 'Greater than and equal to', value: 'greater_than_equal' }
  ];
  currentCategory: string = 'Anti Corruption';
  constructor() { }
  ngOnInit(): void {

  }
  selectCategory(category: string) {
    this.currentCategory = category;
  }

  toggleRule(ruleId: string) {
    const rule = this.testRulesData[this.currentCategory]?.find(r => r.id === ruleId);
    if (rule) {
      rule.status = !rule.status;
    }
  }

  adjustRiskScore(ruleId: string, adjustment: number) {
    const rule = this.testRulesData[this.currentCategory]?.find(r => r.id === ruleId);
    if (rule) {
      const newScore = rule.riskScore + adjustment;
      if (newScore >= 1 && newScore <= 10) {
        rule.riskScore = newScore;
      }
    }
  }
  onRiskScoreChange(rule: any): void {
    // Ensure score is within bounds
    if (rule.riskScore < 1) {
      rule.riskScore = 1;
    } else if (rule.riskScore > 10) {
      rule.riskScore = 10;
    }

    // Optionally, trigger a save or emit event here
    // this.saveRiskScore(rule);
  }

  onStatusChange(rule: TestRule): void {
    console.log(`Status changed for ${rule.id}:`, rule.status);
  }

  // Get current rules for display
  getCurrentRules(): TestRule[] {
    return this.testRulesData[this.currentCategory] || [];
  }

  // Check if category has data
  hasData(category: string): boolean {
    return !!(this.testRulesData[category] && this.testRulesData[category].length > 0);
  }

  closeParameters() {
    this.showParametersPopup = false;
    this.selectedRuleId = null;
  }

  openParameters(ruleId: string) {
    this.selectedRuleId = ruleId;
    this.showParametersPopup = true;

    // Default one row when opening
    this.conditions = [{
      column: 'Vendor_ID',
      operator: 'equals',
      value: ''
    }];
  }

  addCondition() {
    this.conditions.push({
      logicalOperator: 'and',
      column: 'Column_ID',
      operator: 'equals',
      value: ''
    });
  }

  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  saveParameters() {
    console.log("Parameters saved for:", this.selectedRuleId, this.conditions);
    this.closeParameters();
  }
}