import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  imports :[FormsModule,CommonModule],
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent {
  questionnaires = []; // Replace with actual questionnaires loading logic
constructor(private route : Router){

}
  createQuestionnaire() {
    // Add navigation or logic to create a questionnaire
    this.route.navigate(['/questionnaire/new'])
  }
}
