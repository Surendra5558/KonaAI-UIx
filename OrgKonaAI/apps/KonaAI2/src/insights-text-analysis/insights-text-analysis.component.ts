import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insights-text-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insights-text-analysis.component.html',
  styleUrl: './insights-text-analysis.component.scss'
})
export class InsightsTextAnalysisComponent {
mode: 'count' | 'amount' = 'count';
selectedKeyword: string | null = null;
 
  keywords = [
    { word: 'fund', count: 20, amount: 2000000, color: '#F04438' },
    { word: 'quarterly', count: 15, amount: 1500000, color: '#F04438' },
    { word: 'advance', count: 32, amount: 9553149, color: '#2E90FA' },
    { word: 'repayment', count: 29, amount: 7577561, color: '#12B76A' },
    { word: 'invoice', count: 10, amount: 800000, color: '#344054' },
    { word: 'transfer', count: 8, amount: 600000, color: '#344054' },
    { word: 'loan', count: 22, amount: 2500000, color: '#F04438' },
    { word: 'hotel', count: 7, amount: 400000, color: '#344054' },
    { word: 'draw', count: 28, amount: 4273365, color: '#2E90FA' },
    { word: 'step', count: 12, amount: 700000, color: '#FDB022' },
    { word: 'amount', count: 9, amount: 500000, color: '#344054' }
  ];
 
  summary = [
    { keyword: 'advance', count: 32, failed: 24, total: 9553149, flagged: 8597834 },
    { keyword: 'repayment', count: 29, failed: 13, total: 7577561, flagged: 6819805 },
    { keyword: 'draw', count: 28, failed: 29, total: 4273365, flagged: 3846029 },
    { keyword: 'fund quarterly', count: 22, failed: 28, total: 3925592, flagged: 3532033 },
    { keyword: 'loan', count: 22, failed: 22, total: 2500000, flagged: 2250000 },
  ];
 
  selectKeyword(word: string) {
    this.selectedKeyword = this.selectedKeyword === word ? null : word;
  }
}