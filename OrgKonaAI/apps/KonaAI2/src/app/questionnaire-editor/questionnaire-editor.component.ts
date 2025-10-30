import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { DeletePopupComponent, DeletePopupData, DeletePopupResult } from '../shared/components/delete-popup/delete-popup.component';

interface RuleCondition {
  combination: string;
  operator: string;
  value: string;
}

interface Rule {
  conditions: RuleCondition[];
  thenAction: string;
}

interface Question {
  id: number;
  originalId?: number;
  text: string;
  description: string;
  type: string;
  required: boolean;
  options: string[];
  rules: Rule[];
  answer?: string | string[] | File;
  isLocked?: boolean;
}

interface Section {
  id: number;
  title: string;
  questions: Question[];
  isManual?: boolean;
}

interface SectionSliderItem {
  id: number;
  title: string;
  isOpen: boolean;
  questions: Question[];
  selected?: boolean;
}

@Component({
  selector: 'app-questionnaire-editor',
  imports: [CommonModule, FormsModule, AlertPopupComponent, DeletePopupComponent],
  standalone: true,
  templateUrl: './questionnaire-editor.component.html',
  styleUrls: ['./questionnaire-editor.component.scss']
})
export class QuestionnaireEditorComponent {
  sections: Section[] = [];

  questionnaireName: string = '';
  selectedSectionId = 1;
  nextSectionId = 2;
  nextQuestionId = 1;

  // Pagination variables
  pageSize = 8;
  currentPage = 1;
  paginatedQuestions: any[] = [];

  questionTypes = [
    'Short Answer',
    'Long Answer',
    'List',
    'Multiple Choice',
    'Check Boxes',
    'Dropdown',
    'File Upload',
    'Linear',
    'Date'
  ];

  availableQuestions: { id: number, text: string, type: string, options?: string[], selected?: boolean }[] = [
    { id: 101, text: 'What is your name?', type: 'Short Answer' },
    { id: 102, text: 'Describe yourself briefly', type: 'Long Answer' },
    { id: 103, text: 'List your hobbies', type: 'List' },
    { id: 104, text: 'What is your gender?', type: 'Dropdown', options: ['Male', 'Female', 'Other'] },
    { id: 105, text: 'Which languages do you speak?', type: 'Check Boxes', options: ['English', 'Hindi', 'Telugu'] },
    { id: 106, text: 'Choose your country', type: 'Dropdown', options: ['India', 'USA', 'UK', 'Other'] },
    { id: 107, text: 'Upload your resume', type: 'File Upload' },
    { id: 108, text: 'Rate your experience from 1 to 5', type: 'Linear' },
    { id: 109, text: 'What is your date of birth?', type: 'Date' },
    { id: 110, text: 'What is your favorite color?', type: 'Dropdown', options: ['Red', 'Blue', 'Green', 'Yellow'] },
    { id: 111, text: 'Do you own a vehicle?', type: 'Check Boxes', options: ['Car', 'Bike', 'None'] },
    { id: 112, text: 'How many hours do you work daily?', type: 'Short Answer' },
    { id: 113, text: 'Upload your profile photo', type: 'File Upload' },
    { id: 114, text: 'What is your highest qualification?', type: 'Dropdown', options: ['High School', 'Graduate', 'Post Graduate', 'PhD'] },
    { id: 115, text: 'Do you have previous work experience?', type: 'Dropdown', options: ['Yes', 'No'] },
    { id: 116, text: 'What is your preferred working mode?', type: 'Dropdown', options: ['Office', 'Remote', 'Hybrid'] },
    { id: 117, text: 'Which tools do you use daily?', type: 'Check Boxes', options: ['MS Excel', 'VS Code', 'Jira', 'Slack'] },
    { id: 118, text: 'Share your LinkedIn profile link', type: 'Short Answer' },
    { id: 119, text: 'When can you join us?', type: 'Date' },
    { id: 120, text: 'Provide a short self-introduction video', type: 'File Upload' },
    { id: 121, text: 'Explain how the advancements in artificial intelligence are shaping industries like healthcare, finance, and education in the future', type: 'Long Answer' }
  ];

  searchText: string = '';
  conditionCombinations = ['Or', 'And'];
  conditionOperators = ['Is', 'Is not'];
  showQuestionSlider = false;

  // Section slider
  showSectionSlider = false;
  sectionSearchText = '';
  sectionSliderData: SectionSliderItem[] = [
    {
      id: 1,
      title: 'General case information',
      isOpen: false,
      questions: [
        { id: 1, text: 'List the Transaction ID(s) under review', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 2, text: 'Which entities are involved?', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 3, text: 'How was the transaction(s) identified?', type: 'Multiple Choice', description: '', options: ['Risk Scoring', 'Judgemental Selection by RCM'], rules: [], required: false }
      ]
    },
    {
      id: 2,
      title: 'Financial Information',
      isOpen: false,
      questions: [
        { id: 4, text: 'Enter the total transaction amount', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 5, text: 'Currency type', type: 'Dropdown', description: '', options: ['USD', 'EUR', 'INR', 'Other'], rules: [], required: false }
      ]
    },
    {
      id: 3,
      title: 'Approval Details',
      isOpen: false,
      questions: [
        { id: 6, text: 'Who approved the transaction?', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 7, text: 'Approval date', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 8, text: 'Approval method', type: 'Multiple Choice', description: '', options: ['Email', 'System', 'Manual'], rules: [], required: false }
      ]
    },
    {
      id: 4,
      title: 'Comments & Notes',
      isOpen: false,
      questions: [
        { id: 9, text: 'Additional comments', type: 'Long Answer', description: '', options: [], rules: [], required: false },
        { id: 10, text: 'Describe yourself briefly', type: 'Long Answer', description: '', options: [], rules: [], required: false }
      ]
    },
    {
      id: 5,
      title: 'Attachments',
      isOpen: false,
      questions: [
        { id: 11, text: 'List any attached documents', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 12, text: 'Upload related files', type: 'Short Answer', description: '', options: [], rules: [], required: false },
        { id: 13, text: 'Document type', type: 'Dropdown', description: '', options: ['Invoice', 'PO', 'Agreement', 'Other'], rules: [], required: false }
      ]
    }
  ];

  currentQuestionnaireSections: Section[] = [];
  showAlertPopup = false;
  alertData = { title: 'Success', message: 'Questionnaire saved!', okText: 'OK' };
  showDeletePopup = false;
  deleteData: DeletePopupData = {
    title: 'Confirm Delete',
    message: '',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };
  deleteTarget: { section?: any; question?: any } = {};
  showNameAlert = false;
  alertMessage = '';

  constructor(private router: Router) { }

  get selectedSection(): Section | undefined {
    return this.sections.find(s => s.id === this.selectedSectionId);
  }

  selectSection(id: number) {
    this.selectedSectionId = id;
  }

  addSection() {
    const newSection: Section = {
      id: this.getNextSectionId(),
      title: '',
      questions: [],
      isManual: true
    };
    this.sections.push(newSection);
    this.selectedSectionId = newSection.id;
    this.showSectionSlider = false;
  }

  // Pagination logic
  get totalPages(): number {
    return Math.ceil(this.filteredQuestions.length / this.pageSize);
  }

  get paginationPages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      const showLeft = Math.max(2, current - 1);
      const showRight = Math.min(total - 1, current + 1);

      pages.push(1);
      if (showLeft > 2) pages.push('...');
      for (let i = showLeft; i <= showRight; i++) pages.push(i);
      if (showRight < total - 1) pages.push('...');
      pages.push(total);
    }
    return pages;
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedQuestions = this.filteredQuestions.slice(startIndex, endIndex);
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openQuestionSlider() {
    this.showQuestionSlider = true;
    this.currentPage = 1;
    this.updatePagination();
  }

  closeSlider() {
    this.showQuestionSlider = false;
    this.availableQuestions.forEach(q => (q.selected = false));
  }
  addQuestion(q: { id?: number; text: string; type: string; options?: string[] }, originalId?: number) {
    if (!this.selectedSection) return;

    const newQuestion: Question = {
      id: this.nextQuestionId++,
      originalId: originalId ?? q.id ?? undefined, // safe lookup
      text: q.text,
      description: '',
      type: q.type,
      required: false,
      options: q.options ? [...q.options] : [],
      rules: []
    };

    this.selectedSection.questions.push(newQuestion);
  }

  removeQuestion(section: Section, question: Question) {
    const index = section.questions.indexOf(question);
    if (index >= 0) section.questions.splice(index, 1);
  }

  duplicateQuestion(section: Section, question: Question) {
    const copy: Question = { ...question, id: this.nextQuestionId++ };
    if (section) section.questions.push(copy);
  }

  onBackClick() {
    this.router.navigate(['/questionnaire/list']);
  }

  addOption(question: Question) {
    question.options.push('');
  }

  removeOption(question: Question, idx: number) {
    question.options.splice(idx, 1);
  }

  addRule(question: Question) {
    question.rules.push({
      conditions: [{ combination: '', operator: 'Is', value: '' }],
      thenAction: ''
    });
  }

  addCondition(rule: Rule) {
    rule.conditions.push({ combination: 'Or', operator: 'Is', value: '' });
  }

  onFileSelected(question: Question, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      question.answer = input.files[0];
    }
  }

  removeRule(question: Question, idx: number) {
    question.rules.splice(idx, 1);
  }

 save() {
  // Check for questionnaire name
  if (!this.questionnaireName || !this.questionnaireName.trim()) {
    this.alertMessage = 'Please enter a questionnaire name.';
    this.showNameAlert = true;
    return;
  }

  // Check that all manual sections have valid titles
  const unnamedSection = this.sections.find(
    s => s.isManual && (!s.title || !s.title.trim())
  );

  if (unnamedSection) {
    this.alertMessage = 'Please name all manually created sections before saving.';
    this.showNameAlert = true;
    this.selectedSectionId = unnamedSection.id; // highlight that section
    return;
  }

  // Create clean questionnaire object
  const newQuestionnaire = {
    id: Date.now(),
    name: this.questionnaireName.trim(),
    created: new Date().toLocaleDateString('en-GB'),
    sections: this.sections.map(section => ({
      ...section,
      title: section.title.trim(), // remove any extra spaces
    })),
  };

  // Save to localStorage
  localStorage.setItem('savedQuestionnaire', JSON.stringify(newQuestionnaire));

  // Show success message popup
  this.alertMessage = 'Questionnaire saved successfully!';
  this.showNameAlert = true;
}

  preview() {
    alert('Preview feature coming soon!');
  }

  // Section slider
  openSectionSlider() {
    this.showSectionSlider = true;
    this.sectionSliderData.forEach(s => s.selected = false);
  }

  closeSectionSlider() {
    this.showSectionSlider = false;
  }

  filteredSectionSliderData(): SectionSliderItem[] {
    return this.sectionSliderData.filter(s => s.title.toLowerCase().includes(this.sectionSearchText.toLowerCase()));
  }

  isSectionUsedInSlider(id: number): boolean {
    return this.sections.some(s => s.id === id) ||
      this.currentQuestionnaireSections.some(s => s.id === id);
  }

  getNextSectionId(): number {
    const usedIds = new Set([
      ...this.sections.map(s => s.id),
      ...this.sectionSliderData.map(s => s.id),
      this.nextSectionId
    ]);

    let id = this.nextSectionId;
    while (usedIds.has(id)) {
      id++;
    }
    this.nextSectionId = id + 1;
    return id;
  }

  isQuestionAlreadyUsed(sliderQuestion: Question): boolean {
    return this.sections.some(section =>
      section.questions.some(q =>
        q.id === sliderQuestion.id || q.originalId === sliderQuestion.id
      )
    );
  }

  selectSectionsFromSlider() {
    this.sectionSliderData.forEach(s => {
      if (s.selected && !this.isSectionUsedInSlider(s.id)) {
        const newSection: Section = {
          id: s.id,
          title: s.title,
          questions: s.questions.map(q => ({
            ...q,
            originalId: q.id,   // store original slider question ID
            id: this.nextQuestionId++
          })),
          isManual: false
        };
        this.currentQuestionnaireSections.push(newSection);
        this.sections.push(newSection);
      }
      s.selected = false;
    });

    this.showSectionSlider = false;
  }

  get filteredQuestions() {
    return this.availableQuestions.filter(q =>
      q.text.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectQuestions() {
    if (!this.selectedSection) return;

    this.availableQuestions.forEach(q => {
      if (q.selected && !this.isQuestionUsedInSections(q.id)) {
        this.addQuestion(q, q.id); // now valid
        q.selected = false;
      }
    });

    this.showQuestionSlider = false;
  }

  isQuestionUsedInSections(questionId: number): boolean {
    return this.sections.some(section =>
      section.questions.some(q =>
        q.originalId === questionId || q.id === questionId
      )
    );
  }

  // NEW: handle alert popup result
  handleAlertResult(event: any) {
    this.showAlertPopup = false;
  }

  // Optional: If you want only one section open at a time (accordion style)
  toggleSection(section: SectionSliderItem): void {
    this.sectionSliderData.forEach(s => {
      s.isOpen = s.id === section.id ? !s.isOpen : false;
    });
  }
  deleteSection(section: Section, event: Event) {
    event.stopPropagation();

    const confirmDelete = confirm(`Are you sure you want to delete "${section.title}"?`);
    if (!confirmDelete) return;

    const index = this.sections.findIndex(s => s.id === section.id);
    if (index !== -1) {
      this.sections.splice(index, 1);
      this.currentQuestionnaireSections = this.currentQuestionnaireSections.filter(s => s.id !== section.id);

      // Adjust selectedSectionId
      if (this.selectedSectionId === section.id) {
        if (this.sections[index - 1]) {
          this.selectedSectionId = this.sections[index - 1].id;
        } else if (this.sections[index]) {
          this.selectedSectionId = this.sections[index].id;
        } else {
          this.selectedSectionId = 0;
        }
      }
    }
  }
  // Returns a set of all question IDs (or original IDs) currently used
  getAllUsedQuestionIds(): Set<number> {
    const used = new Set<number>();
    this.sections.forEach(section => {
      section.questions.forEach(q => {
        used.add(q.id);
        if (q.originalId) used.add(q.originalId);
      });
    });
    return used;
  }
  confirmDeleteSection(section: Section) {
    this.deleteData.message = `Are you sure you want to delete the section "${section.title}"?`;
    this.showDeletePopup = true;
    this.deleteTarget = { section };
  }

  confirmDeleteQuestion(section: Section, question: Question) {
    this.deleteData.message = `Are you sure you want to delete the question "${question.text}"?`;
    this.showDeletePopup = true;
    this.deleteTarget = { section, question };
  }

  handleDeleteResult(result: DeletePopupResult) {
    if (result.confirmed) {
      if (this.deleteTarget.question && this.deleteTarget.section) {
        // Delete question
        const idx = this.deleteTarget.section.questions.indexOf(this.deleteTarget.question);
        if (idx !== -1) this.deleteTarget.section.questions.splice(idx, 1);
      } else if (this.deleteTarget.section) {
        // Delete section
        const idx = this.sections.findIndex(s => s.id === this.deleteTarget.section!.id);
        if (idx !== -1) this.sections.splice(idx, 1);
        this.currentQuestionnaireSections = this.currentQuestionnaireSections.filter(
          s => s.id !== this.deleteTarget.section!.id
        );

        // Adjust selectedSectionId
        if (this.selectedSectionId === this.deleteTarget.section!.id) {
          if (this.sections[idx - 1]) {
            this.selectedSectionId = this.sections[idx - 1].id;
          } else if (this.sections[idx]) {
            this.selectedSectionId = this.sections[idx].id;
          } else {
            this.selectedSectionId = 0;
          }
        }
      }
    }
    // Reset deleteTarget & hide popup
    this.deleteTarget = {};
    this.showDeletePopup = false;
  }

  isQuestionDeletable(question: any, section: any): boolean {
    return section.isManual; // Only questions in manual sections can be deleted
  }
}
