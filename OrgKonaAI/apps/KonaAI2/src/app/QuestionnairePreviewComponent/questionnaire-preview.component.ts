import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Question {
  id: number;
  text: string;
  description?: string;
  type: string;
  options: string[];
}

interface Section {
  num: number;
  title: string;
  questions: Question[];
  isOpen?: boolean; // Track if section is open
}

@Component({
  selector: 'app-questionnaire-preview',
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire-preview.component.html',
  styleUrls: ['./questionnaire-preview.component.scss']
})
export class QuestionnairePreviewComponent implements OnInit {
  sections: Section[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sections = [
      {
        num: 1,
        title: 'General case information',
        isOpen: true,
        questions: [
          { id: 1, text: 'List the Transaction ID(s) under review', type: 'Short Answer', options: [] },
          { id: 2, text: 'Which entities are involved?', type: 'Short Answer', options: [] },
          { id: 3, text: 'How was the transaction(s) identified?', type: 'Multiple Choice', options: ['Risk Scoring', 'Judgemental Selection by RCM'] }
        ]
      },
      {
        num: 2,
        title: 'Financial Information',
        isOpen: false,
        questions: [
          { id: 4, text: 'Enter the total transaction amount', type: 'Short Answer', options: [] },
          { id: 5, text: 'Currency type', type: 'Dropdown', options: ['USD','EUR','INR','Other'] }
        ]
      },
      {
        num: 3,
        title: 'Approval Details',
        isOpen: false,
        questions: [
          { id: 6, text: 'Who approved the transaction?', type: 'Short Answer', options: [] },
          { id: 7, text: 'Approval date', type: 'Short Answer', options: [] },
          { id: 8, text: 'Approval method', type: 'Multiple Choice', options: ['Email', 'System', 'Manual'] }
        ]
      },
      {
        num: 4,
        title: 'Comments & Notes',
        isOpen: false,
        questions: [
          { id: 9, text: 'Additional comments', type: 'Long Answer', options: [] },
          { id: 10, text: 'Internal notes', type: 'Long Answer', options: [] }
        ]
      },
      {
        num: 5,
        title: 'Attachments',
        isOpen: false,
        questions: [
          { id: 11, text: 'List any attached documents', type: 'Short Answer', options: [] },
          { id: 12, text: 'Upload related files', type: 'Short Answer', options: [] },
          { id: 13, text: 'Document type', type: 'Dropdown', options: ['Invoice','PO','Agreement','Other'] }
        ]
      }
    ];
  }

  toggleSection(section: Section) {
    section.isOpen = !section.isOpen;
  }

  onBackClick() {
    this.router.navigate(['/create']);
  }
}
