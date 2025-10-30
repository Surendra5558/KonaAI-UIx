import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioManagerComponent } from '../scenario-manager/scenario-manager.component';

interface Condition {
  logicOperator: string;
  field: string;
  operator: string;
  value: string;
}

interface Questionnaire {
  id: number;
  name: string;
}

interface Parameter {
  column: string;
  condition: string;
  value: string;
}

interface ScenarioData {
  name: string;
  comments: string;
  automate: boolean;
  frequency: string;
  excludeTransactionsWithAlerts: boolean;
  generateAlerts: boolean;
  generateAlertsAutomatically: boolean;
}

interface TestBlock {
  selectedTest: string;
  parameters: Parameter[];
  isParametersEnabled: boolean;
}

@Component({
  selector: 'app-edit-scenario',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-scenario.component.html',
  styleUrls: ['./edit-scenario.component.scss']
})

export class EditScenarioComponent implements OnInit {
  questionnaires: Questionnaire[] = [
    { id: 1, name: 'Fraud Investigation Checklist' },
    { id: 2, name: 'Vendor Risk Assessment' },
    { id: 3, name: 'Employee Expense Review' },
    { id: 4, name: 'Transaction Anomaly Analysis' },
    { id: 5, name: 'Incident Investigation Form' },
    { id: 6, name: 'Policy Violation Review' }
  ];

  showPopup = false;

  alertType = '';
  topTransactions: number | null = null;
  investigationDays: number | null = null;
  priority = '';
  alertId = 'Auto-generated';
  riskScore = 'Auto-generated';
  riskAmount = 'Auto-generated';
  isShowResults: boolean = false;
  // Form data - will be set based on mode
  scenarioName: string = '';
  comments: string = '';
  automateScenario: boolean = false;
  triggerSchedule: string = '';
  // Component state
  Scenario: string | null = 'Create';
  button: string = 'Create';
  isEditMode: boolean = false;
  // Tab management
  activeTab: string = 'data';
  testBlocks: TestBlock[] = [];

  // Scenario data
  scenarioData: ScenarioData = {
    name: '',
    comments: '',
    automate: false,
    frequency: 'monthly',
    excludeTransactionsWithAlerts: false,
    generateAlerts: false,
    generateAlertsAutomatically: false
  };

  // Conditions - will be initialized based on mode
  conditions: Condition[] = [];

  // Default data for edit mode
  private defaultEditData = {
    scenarioName: 'High-Value Vendor Spend',
    comments: 'Vendors with cumulative monthly spending above ₹10,00,000',
    automateScenario: false,
    triggerSchedule: 'monthly',
    conditions: [
      {
        logicOperator: '',
        field: 'invoiceAmount',
        operator: 'greater than',
        value: '₹1,00,000'
      },
      {
        logicOperator: 'and',
        field: 'invoiceAmount',
        operator: 'equal to',
        value: 'NO'
      }
    ]
  };
  openPopupAlertAutomation() {
    this.showPopup = true;
  }

  closePopupAlertAutomation() {
    this.showPopup = false;
  }
  // Auditors selection
  auditors = {
    l1: false,
    l2: false,
    l3: false
  };

  // Placeholder disable states for assign buttons
  l1AssignDisabled = true;
  l2AssignDisabled = true;
  l3AssignDisabled = true;
  onAuditorChange(level: string) {
    if (level === 'l1') {
      this.l1AssignDisabled = !this.auditors.l1;
    } else if (level === 'l2') {
      this.l2AssignDisabled = !this.auditors.l2;
    } else if (level === 'l3') {
      this.l3AssignDisabled = !this.auditors.l3;
    }
  }

  saveAlertAutomation() {
    alert('Alert generated successfully!');
    this.closePopup();
  }
  // Control flags
  excludeTransactionsWithAlerts: boolean = false;
  generateAlerts: boolean = false;
  results = [
    {
      systemInvoiceNo: 'SYS-65000061304',
      vendorNumber: '00000001612',
      vendorName: 'MOBIL PNG GAS HOLDI...',
      systemInvoiceLineNo: '001',
      physicalInvoiceNo: '440003',
      systemInvoiceDate: '2021-09-09',
      tag: 'Flagged for Review',
      selected: false,
      alerts: 1
    },
    {
      systemInvoiceNo: 'SYS-65000061304',
      vendorNumber: '00000001612',
      vendorName: 'Gerlach LLC',
      systemInvoiceLineNo: '001',
      physicalInvoiceNo: '440003',
      systemInvoiceDate: '2021-09-09',
      tag: 'Flagged for Review',
      selected: false,
      alerts: 1
    },
    {
      systemInvoiceNo: 'SYS-65000061304',
      vendorNumber: '00000001612',
      vendorName: 'Emmerich and Sons',
      systemInvoiceLineNo: '001',
      physicalInvoiceNo: '440003',
      systemInvoiceDate: '2021-09-09',
      tag: 'Flagged for Review',
      selected: false,
      alerts: 1
    },
    {
      systemInvoiceNo: 'SYS-65000061304',
      vendorNumber: '00000001612',
      vendorName: 'Hammes',
      systemInvoiceLineNo: '001',
      physicalInvoiceNo: '440003',
      systemInvoiceDate: '2021-09-09',
      tag: 'Flagged for Review',
      selected: false,
      alerts: 1
    }
  ];
  allSelected = false;
  isShowScenarioManager: boolean = false;
  toggleSelectAll() {
    this.results.forEach(r => r.selected = this.allSelected);
  }
  showGenerateAlertsPopup = false;
  generateAlertsAutomatically: boolean = false;

  onToggleChange(event: any) {
    if (event.target.checked) {
      this.showPopup = true;
    } else {
      this.showPopup = false;
    }
  }

  closePopup() {
    this.showPopup = false;
  }

  constructor(private router: Router, private route: ActivatedRoute) { }
  // For Tests tab
  selectedTest: string = '';
  parameters: Parameter[] = [];
  isParametersEnabled: boolean = false;

  ngOnInit(): void {
    this.initializeComponent();
    this.addTest();
    // Check route parameter to determine mode
    const name = this.route.snapshot.paramMap.get('name');
    this.isEditMode = name === 'Edit';
    if (this.isEditMode) {
      this.Scenario = 'Edit';
      this.button = 'Save';
      this.loadEditModeData();
    } else {
      this.Scenario = 'Create';
      this.button = 'Create';
      this.loadCreateModeData();
    }
    this.isShowResults = false;
  }

  /**
   * Load data for create mode (empty fields)
   */
  private loadCreateModeData(): void {
    this.scenarioName = '';
    this.comments = '';
    this.automateScenario = false;
    this.triggerSchedule = '';
    this.excludeTransactionsWithAlerts = false;
    this.generateAlerts = false;
    this.generateAlertsAutomatically = false;
    
    // Initialize with one empty condition
    this.conditions = [
      {
        logicOperator: '',
        field: '',
        operator: '',
        value: ''
      }
    ];

    // Update scenario data object
    this.scenarioData = {
      name: '',
      comments: '',
      automate: false,
      frequency: '',
      excludeTransactionsWithAlerts: false,
      generateAlerts: false,
      generateAlertsAutomatically: false
    };
  }

  /**
   * Load data for edit mode (populated fields)
   */
  private loadEditModeData(): void {
    // Load default edit data (in real app, this would come from a service)
    this.scenarioName = this.defaultEditData.scenarioName;
    this.comments = this.defaultEditData.comments;
    this.automateScenario = this.defaultEditData.automateScenario;
    this.triggerSchedule = this.defaultEditData.triggerSchedule;
    this.excludeTransactionsWithAlerts = false;
    this.generateAlerts = false;
    this.generateAlertsAutomatically = false;
    
    // Load conditions
    this.conditions = [...this.defaultEditData.conditions];

    // Update scenario data object
    this.scenarioData = {
      name: this.scenarioName,
      comments: this.comments,
      automate: this.automateScenario,
      frequency: this.triggerSchedule,
      excludeTransactionsWithAlerts: this.excludeTransactionsWithAlerts,
      generateAlerts: this.generateAlerts,
      generateAlertsAutomatically: this.generateAlertsAutomatically
    };
  }

  // Header actions
  goBack(): void {
    console.log('Going back...');
    this.router.navigate(['/insights', 'ScenarioManager']);
  }

  preview(): void {
    console.log('Preview scenario...');
  }

  save(): void {
    const actionText = this.isEditMode ? 'Updating' : 'Creating';
    console.log(`${actionText} scenario...`, {
      scenarioName: this.scenarioName,
      comments: this.comments,
      automateScenario: this.automateScenario,
      triggerSchedule: this.triggerSchedule,
      conditions: this.conditions,
      excludeTransactionsWithAlerts: this.excludeTransactionsWithAlerts,
      generateAlerts: this.generateAlerts
    });
    
    // Here you would typically call different services based on mode
    if (this.isEditMode) {
      // Call update service
      alert('Scenario updated successfully!');
    } else {
      // Call create service
      alert('Scenario created successfully!');
    }
  }

  // Tab management
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Condition management
  addCondition(): void {
    const newCondition: Condition = {
      logicOperator: this.conditions.length > 0 ? 'and' : '',
      field: '',
      operator: '',
      value: ''
    };
    this.conditions.push(newCondition);
  }

  removeCondition(index: number): void {
    if (this.conditions.length > 1) {
      this.conditions.splice(index, 1);
    }
  }

  getPlaceholder(field: string): string {
    const placeholders: { [key: string]: string } = {
      'invoiceAmount': '₹1,00,000',
      'vendorName': 'Enter vendor name',
      'category': 'Enter category'
    };
    return placeholders[field] || 'Enter value';
  }

  // Utility methods
  onAutomateScenarioChange(): void {
    if (!this.automateScenario) {
      this.triggerSchedule = '';
    }
  }

  validateForm(): boolean {
    const hasValidName = !!this.scenarioName.trim();
    const hasValidConditions = this.conditions.some(c => c.field && c.operator && c.value);
    return hasValidName && hasValidConditions;
  }

  resetForm(): void {
    if (this.isEditMode) {
      this.loadEditModeData();
    } else {
      this.loadCreateModeData();
    }
  }

  // Tests tab methods
  private initializeComponent(): void {
    this.updateParametersState();
  }

  previewScenario(): void {
    console.log('Preview scenario:', this.scenarioData);
  }

  saveScenario(): void {
    const scenarioPayload = {
      ...this.scenarioData,
      conditions: this.conditions,
      parameters: this.parameters,
      selectedTest: this.selectedTest
    };
    console.log('Saving scenario:', scenarioPayload);
  }

  // Tab Management
  switchTab(tabName: string): void {
    this.activeTab = tabName;
    console.log('Switched to tab:', tabName);
  }

  // Scenario Details
  onAutomateChange(): void {
    if (!this.scenarioData.automate) {
      this.scenarioData.frequency = 'monthly';
    }
  }

  // Tests Tab - Test Management
  onTestSelectionChange(blockIndex: number): void {
    const block = this.testBlocks[blockIndex];
    block.isParametersEnabled = !!block.selectedTest;

    if (block.selectedTest) {
      block.parameters = [];
    }
  }

  private updateParametersState(): void {
    this.isParametersEnabled = !!this.selectedTest;
  }

  addParameter(blockIndex: number): void {
    const block = this.testBlocks[blockIndex];
    if (!block.parameters) block.parameters = [];

    block.parameters.push({
      column: '',
      condition: '',
      value: ''
    });
  }

  removeParameter(blockIndex: number, paramIndex: number): void {
    this.testBlocks[blockIndex].parameters.splice(paramIndex, 1);
  }

  removeTest(blockIndex: number): void {
    this.testBlocks.splice(blockIndex, 1);
  }

  addTest(): void {
    this.testBlocks.push({
      selectedTest: '',
      isParametersEnabled: true,
      parameters: []
    });
  }

  private resetTestForm(): void {
    this.selectedTest = '';
    this.parameters = [];
    this.updateParametersState();
  }

  // Results
  getResults(): void {
    if (this.activeTab === 'data') {
      this.getDataResults();
      this.isShowResults = true;

    } else {
      this.getTestResults();
    }
  }

  private getDataResults(): void {
    const validConditions = this.conditions.filter(c =>
      c.field && c.operator && c.value
    );

    const dataPayload = {
      scenarioName: this.scenarioName,
      comments: this.comments,
      conditions: validConditions,
      excludeTransactionsWithAlerts: this.excludeTransactionsWithAlerts,
      generateAlerts: this.generateAlerts
    };

    console.log('Getting data results:', dataPayload);
    alert(`Getting results for ${validConditions.length} conditions...`);
  }

  private getTestResults(): void {
    const validParameters = this.parameters.filter((p: Parameter) =>
      p.column && p.condition && p.value
    );

    const testPayload = {
      scenarioName: this.scenarioName,
      comments: this.comments,
      selectedTest: this.selectedTest,
      parameters: validParameters,
      excludeTransactionsWithAlerts: this.excludeTransactionsWithAlerts,
      generateAlertsAutomatically: this.generateAlertsAutomatically
    };

    console.log('Getting test results:', testPayload);

    if (!this.selectedTest) {
      alert('Please select a test type first.');
      return;
    }

    alert(`Getting results for ${this.getTestDisplayName(this.selectedTest)} with ${validParameters.length} parameters...`);
  }

  // Utility Methods
  getTestDisplayName(testCode: string): string {
    const testNames: { [key: string]: string } = {
      'PMTONINT': 'PMTONINT - Payments made to officers',
      'DUPVEND': 'DUPVEND - Duplicate vendor analysis',
      'BENFORD': 'BENFORD - Benford\'s law analysis'
    };
    return testNames[testCode] || testCode;
  }

  isFormValid(): boolean {
    if (this.activeTab === 'data') {
      return this.conditions.every(c => c.field && c.operator && c.value);
    } else {
      return !!this.selectedTest;
    }
  }

  // Event Handlers
  onConditionChange(index: number, field: keyof Condition, value: any): void {
    this.conditions[index][field] = value;
  }

  onParameterChange(index: number, field: keyof Parameter, value: any): void {
    this.parameters[index][field] = value;
  }

  // Validation Methods
  validateCondition(condition: Condition): boolean {
    return !!(condition.field && condition.operator && condition.value);
  }

  validateParameter(parameter: Parameter): boolean {
    return !!(parameter.column && parameter.condition && parameter.value);
  }

  validateAllConditions(): boolean {
    return this.conditions.every(condition => this.validateCondition(condition));
  }

  validateAllParameters(): boolean {
    return this.parameters.length === 0 || this.parameters.every(parameter => this.validateParameter(parameter));
  }

  // Data Export/Import Methods
  exportScenarioData(): any {
    return {
      basic: {
        scenarioName: this.scenarioName,
        comments: this.comments,
        automateScenario: this.automateScenario,
        triggerSchedule: this.triggerSchedule
      },
      data: {
        conditions: this.conditions,
        excludeTransactionsWithAlerts: this.excludeTransactionsWithAlerts,
        generateAlerts: this.generateAlerts
      },
      tests: {
        selectedTest: this.selectedTest,
        parameters: this.parameters,
        generateAlertsAutomatically: this.generateAlertsAutomatically
      },
      activeTab: this.activeTab
    };
  }

  importScenarioData(data: any): void {
    if (data.basic) {
      this.scenarioName = data.basic.scenarioName || this.scenarioName;
      this.comments = data.basic.comments || this.comments;
      this.automateScenario = data.basic.automateScenario || false;
      this.triggerSchedule = data.basic.triggerSchedule || '';
    }

    if (data.data) {
      this.conditions = data.data.conditions || this.conditions;
      this.excludeTransactionsWithAlerts = data.data.excludeTransactionsWithAlerts || false;
      this.generateAlerts = data.data.generateAlerts || false;
    }

    if (data.tests) {
      this.selectedTest = data.tests.selectedTest || '';
      this.parameters = data.tests.parameters || [];
      this.generateAlertsAutomatically = data.tests.generateAlertsAutomatically || false;
    }

    if (data.activeTab) {
      this.activeTab = data.activeTab;
    }

    this.updateParametersState();
  }

  // Reset Methods
  resetToDefaults(): void {
    if (this.isEditMode) {
      this.loadEditModeData();
    } else {
      this.loadCreateModeData();
    }
    this.resetTestForm();
    this.activeTab = 'data';
  }

  isDataTabValid(): boolean {
    return this.conditions.every(c => c.field && c.operator && c.value);
  }

  isTestTabValid(): boolean {
    if (!this.selectedTest) return false;
    return this.parameters.length === 0 ||
      this.parameters.every(p => p.column && p.condition && p.value);
  }

  // Utility Methods for UI State
  canAddCondition(): boolean {
    return this.conditions.length < 10;
  }

  getConditionSummary(): string {
    const validConditions = this.conditions.filter(c =>
      c.field && c.operator && c.value
    );
    return `${validConditions.length} condition(s) configured`;
  }

  getParameterSummary(): string {
    const validParameters = this.parameters.filter(p =>
      p.column && p.condition && p.value
    );
    return `${validParameters.length} parameter(s) configured`;
  }

  // Methods for handling form state changes
  onFormChange(): void {
    console.log('Form data changed');
  }

  hasUnsavedChanges(): boolean {
    return true;
  }

  ngOnDestroy(): void {
    if (this.hasUnsavedChanges()) {
      console.log('Component destroyed with unsaved changes');
    }
  }
}
