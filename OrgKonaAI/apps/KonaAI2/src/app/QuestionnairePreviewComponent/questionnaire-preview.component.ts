import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Question {
  id: string | number;
  rowId: string;
  text: string;
  description?: string | null;
  type: string;
  options: string[];
  isMandatory?: boolean;
  linkedQuestion?: number | null;
  onAction?: string[];
  childQuestions?: Question[];
  selectedOption?: string;
  hasChild?: boolean;
  showChildren?: boolean;
  filteredChildren?: Question[];
}

interface Section {
  num: number;
  title: string;
  questions: Question[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-questionnaire-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire-preview.component.html',
  styleUrls: ['./questionnaire-preview.component.scss']
})
export class QuestionnairePreviewComponent implements OnInit {
  sections: Section[] = [];
  questionnaireName: string = 'Untitled';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const responseFromBackend = this.getBackendResponse();
    this.loadPreviewData(responseFromBackend);
  }

  loadPreviewData(response: any) {
    this.questionnaireName = response.name || 'Untitled';

    this.sections = response.sections.map((sec: any, index: number) => {
      const allQuestions: Question[] = sec.questions.map((q: any) => ({
        ...q,
        type: q.renderType ? this.mapRenderType(q.renderType) : (q.options?.length ? 'Multiple Choice' : 'Short Answer'),
        childQuestions: [],
        selectedOption: '',
        hasChild: false,
        showChildren: false
      }));

      const parentQuestions: Question[] = allQuestions.filter((q: Question) => !q.linkedQuestion);
      const childQuestions: Question[] = allQuestions.filter((q: Question) => q.linkedQuestion !== null && q.linkedQuestion !== undefined);

      childQuestions.forEach((child: Question) => {
        const parent: Question | undefined = parentQuestions.find(p => p.id === child.linkedQuestion);
        if (parent) {
          parent.childQuestions = parent.childQuestions || [];
          parent.childQuestions.push({
            ...child,
            options: child.options || [],
            onAction: child.onAction || []
          });
          parent.hasChild = true;
        }
      });

      return {
        num: index + 1,
        title: sec.title,
        isOpen: index === 0,
        questions: parentQuestions
      };
    });
  }

  mapRenderType(renderType: string): string {
    switch (renderType) {
      case 'TextBox': return 'Short Answer';
      case 'TextArea': return 'Long Answer';
      case 'Dropdown': return 'Dropdown';
      case 'Radio': return 'Multiple Choice';
      case 'Checkbox': return 'Check Boxes';
      default: return 'Short Answer';
    }
  }

  toggleSection(section: Section) {
    section.isOpen = !section.isOpen;
  }

  onBackClick() {
    this.router.navigate(['/organisation/questionnaire']);
  }

  /** 
   * Show related child questions inline based on selected option
   */
  onOptionSelect(parentQuestion: Question, selectedOption: string) {
    parentQuestion.selectedOption = selectedOption?.toString().trim() || '';
    parentQuestion.showChildren = true;

    if (!parentQuestion.childQuestions || parentQuestion.childQuestions.length === 0) {
      parentQuestion.filteredChildren = [];
      return;
    }

    parentQuestion.filteredChildren = parentQuestion.childQuestions.filter((child: Question) => {
      if (!child.onAction || child.onAction.length === 0) return false;
      try {
        const parsedRules = JSON.parse(child.onAction[0]);
        return parsedRules.some((rule: any) => {
          const operator = (rule.Operator || '').toLowerCase();
          const value = (rule.Value || '').trim();
          if (operator.includes('equals') || operator.includes('is')) return selectedOption === value;
          if (operator.includes('not')) return selectedOption !== value;
          return false;
        });
      } catch {
        return false;
      }
    });
  }

  /**
   * Helper method to safely check if a question has visible children
   */
  hasChildren(q: Question): boolean {
    return !!q.showChildren && Array.isArray(q.filteredChildren) && q.filteredChildren.length > 0;
  }

  // Example backend response (mock)
  getBackendResponse() {
    return {
      "questionnaireRowId": "9b00911c-1124-47ad-9aa8-455409977f24",
      "name": "Reshma Questionnaire",
      "sections": [
        {
          "title": "Section 1",
          "questions": [
            {
              "id": 3,
              "rowId": "86870d2e-a995-4f40-90a2-39385013c3b7",
              "text": "Enter your full name",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 4,
              "rowId": "ae844362-77f0-4e9b-be6d-b3aafa01116b",
              "text": "Enter your address",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": null,
              "onAction": []
            }
          ]
        },
        {
          "title": "Section 2",
          "questions": [
            {
              "id": 6,
              "rowId": "9494a998-7bd1-497f-82da-61160d74f4e2",
              "text": "Select your gender",
              "renderType": "Radio",
              "options": [
                "Male", "Female", "Other"
              ],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 7,
              "rowId": "0f110183-fc24-445d-aa26-7db7aa7a5f48",
              "text": "Select your hobbies",
              "renderType": "Checkbox",
              "options": [
                "Sports", "Music", "Reading", "Travel"
              ],
              "linkedQuestion": null,
              "onAction": []
            }
          ]
        },
        {
          "title": "Section 3",
          "questions": [
            {
              "id": 5,
              "rowId": "3b2f606f-337a-4474-ac19-36db0c8e6518",
              "text": "What is your country?",
              "renderType": "Radio",
              "options": [
                "India", "USA", "UK", "Other"
              ],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 8,
              "rowId": "9a9110b0-b754-49d8-b6b6-c7a01518dab5",
              "text": "Select your date of birth",
              "renderType": "date",
              "options": [],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 9,
              "rowId": "14a7ec94-db03-4bac-a8e3-97af0579a8f9",
              "text": "Select preferred time for call",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": null,
              "onAction": []
            }
          ]
        },
        {
          "title": "Section 4",
          "questions": [
            {
              "id": 10,
              "rowId": "ab32536a-a64d-4cd6-ac74-eef6f84a3140",
              "text": "Enter your email address",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 10002,
              "rowId": "36c1ddab-af54-4ff9-ad96-160a68f80dce",
              "text": "string",
              "renderType": "Textbox",
              "options": [
                "string"
              ],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 10003,
              "rowId": "018b2cdc-c735-4fb9-a957-6b2ae7392b11",
              "text": "Testing inserting question",
              "renderType": "Checkbox",
              "options": [
                "True",
                "False",
                "N/A"
              ],
              "linkedQuestion": null,
              "onAction": []
            }
          ]
        },
        {
          "title": "Section 5",
          "questions": [
            {
              "id": 10004,
              "rowId": "333d5ba4-16a1-446f-92f3-b37460419c2c",
              "text": "Child Testing Question",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": 10003,
              "onAction": [
                "[{\"Combination\":\"\",\"Operator\":\"is\",\"Value\":\"True\"},{\"Combination\":\"AND\",\"Operator\":\"is not\",\"Value\":\"False\"},{\"Combination\":\"AND\",\"Operator\":\"equals\",\"Value\":\"N/A\"}]"
              ]
            },
            {
              "id": 10005,
              "rowId": "61709e77-75b6-4fd8-918f-10fae11c092c",
              "text": "Parent Question",
              "renderType": "Radio",
              "options": [
                "True",
                "False",
                "N/A"
              ],
              "linkedQuestion": null,
              "onAction": []
            },
            {
              "id": 10006,
              "rowId": "fb166501-b689-41df-9cea-11d62c307f74",
              "text": "Child Question related to True",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": 10005,
              "onAction": [
                "[{\"Combination\":\"\",\"Operator\":\"equals\",\"Value\":\"True\"},{\"Combination\":\"AND\",\"Operator\":\"not equals\",\"Value\":\"False\"}]"
              ]
            },
            {
              "id": 10007,
              "rowId": "38a16d31-7c21-4382-93e9-edebb3e0c7a7",
              "text": "Child Question 2",
              "renderType": "Textbox",
              "options": [],
              "linkedQuestion": 10005,
              "onAction": [
                "[{\"Combination\":\"\",\"Operator\":\"equals\",\"Value\":\"N/A\"}]"
              ]
            },
            {
              "id": 10008,
              "rowId": "1daefa87-089b-4b72-9066-f39669d0002b",
              "text": "Parent Questions Bank",
              "renderType": "Multiple Choice",
              "options": [
                "True",
                "False",
                "N/A"
              ],
              "linkedQuestion": null,
              "onAction": []
            }
          ]
        }
      ]
    }
  }

}
