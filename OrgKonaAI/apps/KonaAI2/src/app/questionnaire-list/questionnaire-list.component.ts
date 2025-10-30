import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DeletePopupComponent, DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
interface Questionnaire {
  id: number;
  name: string;
  created: string;
}

interface Section {
  id: number;
  name: string;
  description: string;
  created: string;
  sectionQuestions?: Question[];
}

interface Question {
  id: number;
  question: string;
  type: string;
  created: string;
  options?: string[];
  required?: boolean;
  rules?: Rule[];
}

interface Rule {
  conditions: Condition[];
  thenAction: string;
  canAddMore?: boolean;
}

interface Condition {
  combination: string;
  operator: string;
  value: string;
}

@Component({
  selector: 'app-questionnaire-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DeletePopupComponent, DragDropModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './questionnaire-list.component.html',
  styleUrls: ['./questionnaire-list.component.scss']
})
export class QuestionnaireListComponent implements OnInit {
  // Tab management
  activeTab: 'questionnaire' | 'questionBank' | 'sections' = 'questionnaire';

  // Existing questionnaire properties
  questionnaires: Questionnaire[] = [
    { id: 1, name: 'Fraud Investigation Checklist', created: '01 Jan 2025' },
    { id: 2, name: 'Vendor Risk Assessment', created: '01 Jan 2025' },
    { id: 3, name: 'Employee Expense Review', created: '01 Jan 2025' },
    { id: 4, name: 'Incident Investigation Form', created: '01 Jan 2025' },
    { id: 5, name: 'Policy Violation Review', created: '01 Jan 2025' },
    { id: 6, name: 'Untitled', created: '01 Jan 2025' },
    { id: 7, name: 'Transaction Anomaly Analysis', created: '01 Jan 2025' }
  ];

  sections: Section[] = [
    { id: 1, name: 'Initial Analysis', description: 'Capture basic investigation details.', created: '01 Jan 2025' },
    { id: 2, name: 'Transaction Review', description: 'Record transaction-level checks.', created: '01 Jan 2025' },
    { id: 3, name: 'Interview Notes', description: 'Interview findings and follow-ups.', created: '01 Jan 2025' }
  ];

  sectionMenuOpenFor: number | null = null;
  sectionSearchText: string = '';
  showSectionPopup = false;
  selectedSectionForQuestion: Section | null = null;
  addDropdownVisible = false;
  selectedQuestionId: number | null = null;
  sectionName = '';
  sectionDescription: string = '';
  questionDropdowns: { selectedQuestionId: number | null }[] = [];
  selectedQuestionIds: number[] = [];

  // Question Bank data
  questions: Question[] = [
    { id: 1, question: 'What is the total amount involved in the transaction?', type: 'Number', created: '01 Jan 2025' },
    { id: 2, question: 'Was proper authorization obtained before the transaction?', type: 'Yes/No', created: '01 Jan 2025' },
    { id: 3, question: 'Please describe the nature of the incident', type: 'Text', created: '01 Jan 2025' },
    { id: 4, question: 'Select all applicable risk factors', type: 'Multiple Choice', created: '01 Jan 2025' },
    { id: 5, question: 'What is the vendor\'s credit rating?', type: 'Dropdown', created: '01 Jan 2025' },
    { id: 6, question: 'Rate the severity of the policy violation', type: 'Rating', created: '01 Jan 2025' },
    { id: 7, question: 'When did the incident occur?', type: 'Date', created: '01 Jan 2025' },
    { id: 8, question: 'List all parties involved in the transaction', type: 'Text Area', created: '01 Jan 2025' },
    { id: 9, question: 'Is this a recurring expense?', type: 'Yes/No', created: '01 Jan 2025' },
    { id: 10, question: 'Select the transaction category', type: 'Single Choice', created: '01 Jan 2025' }
  ];

  // Existing properties
  menuOpenFor: number | null = null;
  questionMenuOpenFor: number | null = null;
  showRenamePopup: boolean = false;
  renameValue: string = '';
  selectedId: number | null = null;
  searchText: string = '';
  questionSearchText: string = '';
  viewMode: 'grid' | 'list' = 'list';
  showDeletePopup = false;
  showQuestionPopup = false;
  selectedSection: any = { questions: [] }; // temp object to hold new question
  selectedQuestions: Question[] = [];
  questionTypes: string[] = [
    'Text', 'Number', 'Yes/No', 'Multiple Choice',
    'Check Boxes', 'Dropdown', 'Date', 'Rating', 'Radio'
  ];
  conditionCombinations: string[] = ['AND', 'OR'];
  conditionOperators: string[] = ['is', 'is not', 'equals', 'contains'];

  deleteData: DeletePopupData = {
    title: 'Permanently Delete',
    message: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    const savedData = localStorage.getItem('newQuestionnaire');
    if (savedData) {
      const newQ = JSON.parse(savedData);
      this.questionnaires.push({
        id: newQ.id,
        name: newQ.name,
        created: newQ.created
      });
      localStorage.removeItem('newQuestionnaire'); // clear after adding
    }
  }

  // Tab management methods
  setActiveTab(tab: 'questionnaire' | 'questionBank' | 'sections') {
    this.activeTab = tab;
    this.closeMenu();
    this.closeQuestionMenu();
  }

  // Existing questionnaire methods
  openMenu(id: number) {
    this.menuOpenFor = id;
  }

  closeMenu() {
    this.menuOpenFor = null;
  }

  navigateToCreate() {
    if (this.activeTab === 'questionnaire') {
      this.router.navigate(['/create']);
    } else if (this.activeTab === 'questionBank') {
      this.selectedSection = { questions: [this.createEmptyQuestion()] };
      this.showQuestionPopup = true;
    } else if (this.activeTab === 'sections') {
      this.openSectionPopup();
    }
  }

  createEmptyQuestion() {
    return {
      id: Date.now(),
      text: '',
      type: '',
      options: [],
      required: false,
      rules: []
    };
  }

  onRename(id: number) {
    const item = this.questionnaires.find(q => q.id === id);
    if (item) {
      this.renameValue = item.name;
      this.selectedId = id;
      this.showRenamePopup = true;
    }
    this.closeMenu();
  }

  get createButtonLabel(): string {
    if (this.activeTab === 'questionBank') return 'Question';
    if (this.activeTab === 'sections') return 'Section';
    return 'Questionnaire';
  }


  saveRename() {
    if (this.selectedId != null) {
      const q = this.questionnaires.find(q => q.id === this.selectedId);
      if (q) q.name = this.renameValue;
      this.showRenamePopup = false;
      this.selectedId = null;
    }
  }

  cancelRename() {
    this.showRenamePopup = false;
    this.selectedId = null;
  }

  onDelete(id: number) {
    const item = this.questionnaires.find(q => q.id === id);
    if (item) {
      this.selectedId = id;
      this.deleteData = {
        title: 'Permanently Delete',
        message: `Are you sure you want to permanently delete ${item.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      };
      this.showDeletePopup = true;
    }
    this.closeMenu();
  }

  handleDeleteResult(result: DeletePopupResult) {
    if (result.confirmed && this.selectedId != null) {
      if (this.activeTab === 'questionnaire') {
        this.questionnaires = this.questionnaires.filter(q => q.id !== this.selectedId);
      } else {
        this.questions = this.questions.filter(q => q.id !== this.selectedId);
      }
    }

    this.showDeletePopup = false;
    this.selectedId = null;
  }

  getIconSymbol(name: string): string {
    const iconMap: { [key: string]: string } = {
      'Fraud Investigation Checklist': 'checklist',
      'Vendor Risk Assessment': 'warning',
      'Employee Expense Review': 'receipt_long',
      'Transaction Anomaly Analysis': 'monitoring',
      'Incident Investigation Form': 'assignment',
      'Policy Violation Review': 'rule',
      'Untitled': 'insert_drive_file'
    };
    return iconMap[name] || 'insert_drive_file';
  }

  filteredQuestionnaires(): Questionnaire[] {
    if (!this.searchText.trim()) {
      return this.questionnaires;
    }
    const term = this.searchText.toLowerCase();
    return this.questionnaires.filter(q => q.name.toLowerCase().includes(term));
  }

  openPreview() {
    this.router.navigate(['/preview']);
  }

  // Question Bank methods
  closeQuestionMenu() {
    this.questionMenuOpenFor = null;
  }

  filteredQuestions(): Question[] {
    if (!this.questionSearchText.trim()) {
      return this.questions;
    }
    const term = this.questionSearchText.toLowerCase();
    return this.questions.filter(q =>
      q.question.toLowerCase().includes(term) ||
      q.type.toLowerCase().includes(term)
    );
  }

  onEditQuestion(id: number) {
    console.log('Edit question with id:', id);
    this.closeQuestionMenu();
  }

  onDeleteQuestion(id: number) {
    const item = this.questions.find(q => q.id === id);
    if (item) {
      this.selectedId = id;
      this.deleteData = {
        title: 'Permanently Delete',
        message: `Are you sure you want to permanently delete this question: "${item.question.substring(0, 50)}${item.question.length > 50 ? '...' : ''}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      };
      this.showDeletePopup = true;
    }
    this.closeQuestionMenu();
  }

  // Add question popup methods
  addOption(question: any): void {
    if (!question.options) {
      question.options = [];
    }
    question.options.push('');
  }

  removeOption(question: any, index: number) {
    question.options.splice(index, 1);
  }

  duplicateQuestion(section: any, question: any) {
    const clone = JSON.parse(JSON.stringify(question));
    clone.id = Date.now();
    section.questions.push(clone);
  }

  removeQuestion(section: any, question: any) {
    const idx = section.questions.indexOf(question);
    if (idx > -1) section.questions.splice(idx, 1);
  }

  isRuleEnabled(questionOrType: any): boolean {
    // accept either the whole question object or a string
    const raw = typeof questionOrType === 'string'
      ? questionOrType
      : (questionOrType?.RenderType || questionOrType?.renderType || questionOrType?.type || '');

    if (!raw) return false;

    const sanitized = String(raw).toLowerCase().replace(/[\s_-]/g, '');

    const radioAliases = ['radio', 'multiplechoice', 'singlechoice', 'single'];
    const dropdownAliases = ['dropdown', 'select', 'selectone'];

    // Only allow if type is allowed
    const isTypeAllowed = radioAliases.includes(sanitized) || dropdownAliases.includes(sanitized);

    // If question object is passed, check if a rule already exists
    //const hasNoRules = typeof questionOrType === 'object' ? !questionOrType.rules || questionOrType.rules.length === 0 : true;

    return isTypeAllowed;
  }

  removeRule(question: any, ruleIndex: number) {
    question.rules.splice(ruleIndex, 1);
  }
  trackByIndex(index: number, item: any): any {
    return index;
  }
  getAvailableOptions(question: any, rule: any, currentCondition: any): string[] {
    if (!question?.options) return [];

    // Collect all selected option values across ALL rules for this question
    const allSelectedValues = question.rules
      .flatMap((r: any) => r.conditions.map((c: any) => c.value))
      .filter((v: string) => !!v);

    // Filter out those already selected (so they're hidden globally)
    const available = question.options.filter((opt: string) => !allSelectedValues.includes(opt));

    // Ensure we don’t remove the currently selected one from itself
    if (currentCondition.value && !available.includes(currentCondition.value)) {
      available.push(currentCondition.value);
    }

    return available;
  }

  updateAvailableOptions(question: any, rule: any): void {
    const allOptions = question.options || [];

    // Collect all selected values across ALL rules
    const allSelectedValues = question.rules
      .flatMap((r: any) => r.conditions.map((c: any) => c.value))
      .filter(Boolean);

    // Disable "Add Condition" if all options are taken
    rule.canAddMore = allSelectedValues.length < allOptions.length;
  }

  areAllOptionsUsed(question: any): boolean {
    const allUsedValues = question.rules
      .flatMap((r: any) => r.conditions.map((c: any) => c.value))
      .filter((v: any) => v);

    return allUsedValues.length >= question.options.length;
  }

  addRule(question: any) {
    if (!this.isRuleEnabled(question) || this.areAllOptionsUsed(question)) return;

    question.rules.push({
      conditions: [{ operator: 'is', value: '', combination: '' }],
      thenAction: '',
      canAddMore: true
    });

    // Immediately update button availability
    this.updateAvailableOptions(question, question.rules[question.rules.length - 1]);
  }

  //Add Condition button logic
  addCondition(question: any, rule: any): void {
    // Prevent adding if all options are used globally
    if (this.areAllOptionsUsed(question)) return;

    // Optional: also prevent adding if this specific rule already uses all available options
    if (!rule.canAddMore && rule.canAddMore !== undefined) return;

    rule.conditions.push({
      combination: 'AND',
      operator: 'is',
      value: '', // empty value until selected
    });

    // Recalculate rule addMore flag
    this.updateAvailableOptions(question, rule);
  }

  updateOption(question: any, index: number, value: string): void {
    question.options[index] = value;
  }
  saveQuestion() {
    const newQ = this.selectedSection.questions[0];
    if (newQ.text && newQ.type) {
      this.questions.push({
        id: Date.now(),
        question: newQ.text,
        type: newQ.type,
        created: new Date().toDateString()
      });
      this.closeQuestionPopup();
    } else {
      alert('Please enter question text and type');
    }
  }

  closeQuestionPopup() {
    this.showQuestionPopup = false;
  }

  filteredSections(): Section[] {
    if (!this.sectionSearchText.trim()) {
      return this.sections;
    }
    const term = this.sectionSearchText.toLowerCase();
    return this.sections.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  }

  onRenameSection(id: number) {
    const item = this.sections.find(s => s.id === id);
    if (item) {
      this.renameValue = item.name;
      this.selectedId = id;
      this.showRenamePopup = true;
    }
    this.sectionMenuOpenFor = null;
  }

  onDeleteSection(id: number) {
    const item = this.sections.find(s => s.id === id);
    if (item) {
      this.selectedId = id;
      this.deleteData = {
        title: 'Permanently Delete',
        message: `Are you sure you want to permanently delete the section "${item.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      };
      this.showDeletePopup = true;
    }
    this.sectionMenuOpenFor = null;
  }
  closeSectionPopup() {
    this.sectionName = '';
    this.sectionDescription = '';
    this.showSectionPopup = false;
    this.addDropdownVisible = false;
    this.selectedQuestionId = null;
    this.selectedQuestions = [];
    this.selectedQuestionIds = [];
  }

  addQuestionToSection() {
    if (!this.selectedSectionForQuestion || !this.selectedQuestionId) return;

    const selectedQ = this.questions.find(q => q.id === this.selectedQuestionId);
    if (selectedQ) {
      this.selectedSectionForQuestion.sectionQuestions?.push(selectedQ);
      this.selectedQuestionId = null;
      this.addDropdownVisible = false;
    }
  }
  openSectionPopup() {
    this.sectionName = '';
    this.sectionDescription = '';
    this.questionDropdowns = [{ selectedQuestionId: null }];
    this.selectedQuestions = [];
    this.selectedQuestionIds = [];
    this.showSectionPopup = true;
  }

  // Called when "+ Question" is clicked
  addQuestionDropdown() {
    this.questionDropdowns.push({ selectedQuestionId: null });
  }

  // Save section with selected questions
  saveSection() {
    if (!this.sectionName.trim()) {
      alert('Please enter a section name.');
      return;
    }
    if (!this.sectionDescription.trim()) {
      alert('Please enter a section description.');
      return;
    }
    if (this.selectedQuestions.length === 0) {
      alert('Please select at least one question.');
      return;
    }

    const newSection: Section = {
      id: Date.now(),
      name: this.sectionName,
      description: this.sectionDescription,
      created: new Date().toDateString(),
      sectionQuestions: [...this.selectedQuestions]
    };

    this.sections.push(newSection);
    console.log('✅ Saved Section:', newSection);

    // Reset popup
    this.closeSectionPopup();
  }

  // Check if question is already selected
  isQuestionDisabled(questionId: number): boolean {
    return this.selectedQuestions.some(q => q.id === questionId);
  }

  // Add question to selectedQuestions when chosen from dropdown
  addSelectedQuestion() {
    if (!this.selectedQuestionId) return;

    const question = this.questions.find(q => q.id === this.selectedQuestionId);
    if (question && !this.selectedQuestions.some(q => q.id === question.id)) {
      this.selectedQuestions = [...this.selectedQuestions, question]; // new array for change detection
    }

    this.selectedQuestionId = null; // clear dropdown
  }

  // Remove question from selectedQuestions
  removeSelectedQuestion(index: number) {
    this.selectedQuestions = this.selectedQuestions.filter((_, i) => i !== index);
  }
  dropQuestion(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.selectedQuestions, event.previousIndex, event.currentIndex);
  }
  addSelectedQuestions() {
    if (!this.selectedQuestionIds.length) return;

    const newQuestions = this.questions.filter(q =>
      this.selectedQuestionIds.includes(q.id) &&
      !this.selectedQuestions.some(sq => sq.id === q.id)
    );

    this.selectedQuestions = [...this.selectedQuestions, ...newQuestions];

    // Clear selection
    this.selectedQuestionIds = [];
  }
  removeCondition(question: any, rule: any, conditionIndex: number): void {
    // Remove the selected condition
    rule.conditions.splice(conditionIndex, 1);

    // If no conditions left, remove the entire rule from the question
    if (rule.conditions.length === 0) {
      const ruleIndex = question.rules.indexOf(rule);
      if (ruleIndex !== -1) {
        question.rules.splice(ruleIndex, 1);
        // Force Angular to detect the change
        question.rules = [...question.rules];
      }
    }
  }
}
