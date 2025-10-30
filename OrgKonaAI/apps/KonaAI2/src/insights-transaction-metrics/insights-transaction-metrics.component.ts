
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';



declare const Chart: any;

interface Transaction {
  lineNo: number;
  vendorId: string;
  vendorName: string;
  riskRanking: number;
  riskScore: number;
  amount: number;
  p2pcipy111: number;
  p2pcipy112: number;
  p2pcipy113: number;
  riskBand: 'Low' | 'Medium' | 'High';
}

@Component({
  selector: 'app-insights-transaction-metrics',
  standalone: true,
  imports: [FormsModule, CommonModule, MatTableModule,
    MatIconModule],
  templateUrl: './insights-transaction-metrics.component.html',
  styleUrl: './insights-transaction-metrics.component.scss'
})
export class InsightsTransactionMetricsComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  searchText = '';
  showChart = false;
  chart: any;
  selectedTransaction?: Transaction;
  
  displayedColumns: string[] = [
    'lineNo', 
    'vendorId', 
    'vendorName', 
    'riskRanking', 
    'riskScore', 
    'p2pcipy111', 
    'p2pcipy112', 
    'p2pcipy113'
  ];

  transactions: Transaction[] = [
    { lineNo: 1941, vendorId: '0001003812', vendorName: 'MOBIL PNG GAS HOLDINGS PTY LTD', riskRanking: 1, riskScore: 127.03, amount: 0.21, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'High' },
    { lineNo: 1710, vendorId: '0000003640', vendorName: 'Gerlach LLC', riskRanking: 2, riskScore: 99.57, amount: 0.35, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'High' },
    { lineNo: 1924, vendorId: '0040070379', vendorName: 'Emmerich and Sons', riskRanking: 3, riskScore: 90.33, amount: 0.28, p2pcipy111: 0.0, p2pcipy112: 9.7, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1890, vendorId: '0040019213', vendorName: 'Hammes, Leannon and...', riskRanking: 4, riskScore: 89.66, amount: 0.22, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1274, vendorId: '0040032677', vendorName: 'Goldner, Cummerate and...', riskRanking: 5, riskScore: 80.26, amount: 0.23, p2pcipy111: 7.0, p2pcipy112: 7.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1275, vendorId: '0040049955', vendorName: 'Harber Group', riskRanking: 6, riskScore: 80.26, amount: 0.26, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1269, vendorId: '0040060477', vendorName: 'Dach, Pollich and Kozey...', riskRanking: 7, riskScore: 80.26, amount: 0.18, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1940, vendorId: '0040074551', vendorName: "O'Connell-Lind ANPG C...", riskRanking: 8, riskScore: 79.62, amount: 0.19, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1922, vendorId: '0040034463', vendorName: 'Lakin-Emser Custom...', riskRanking: 9, riskScore: 78.76, amount: 0.20, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 1450, vendorId: '0040038637', vendorName: 'Schimmel-Reilly Custom...', riskRanking: 10, riskScore: 78.09, amount: 0.20, p2pcipy111: 9.09, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    // Low risk transactions
    { lineNo: 515, vendorId: '0040042657', vendorName: 'Lind-Grembiece...', riskRanking: 12, riskScore: 9.5, amount: 0.12, p2pcipy111: 0.0, p2pcipy112: 7.03, p2pcipy113: 0.0, riskBand: 'Low' },
    { lineNo: 511, vendorId: '0040020347', vendorName: 'ENERGY IMPORT BANK...', riskRanking: 13, riskScore: 4.0, amount: 0.50, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Low' },
    { lineNo: 1268, vendorId: '0040046521', vendorName: 'Lubowitz, Little and Moo...', riskRanking: 14, riskScore: 5.1, amount: 0.08, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Low' },
    // Additional sample data to match the chart
    { lineNo: 516, vendorId: '0040042658', vendorName: 'Sample Corp A', riskRanking: 15, riskScore: 3.2, amount: 0.09, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Low' },
    { lineNo: 517, vendorId: '0040042659', vendorName: 'Sample Corp B', riskRanking: 16, riskScore: 6.8, amount: 0.11, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Low' },
    { lineNo: 518, vendorId: '0040042660', vendorName: 'Sample Corp C', riskRanking: 17, riskScore: 15.3, amount: 0.14, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Low' },
    { lineNo: 519, vendorId: '0040042661', vendorName: 'Medium Risk Corp A', riskRanking: 18, riskScore: 65.2, amount: 0.25, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 520, vendorId: '0040042662', vendorName: 'Medium Risk Corp B', riskRanking: 19, riskScore: 58.7, amount: 0.32, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'Medium' },
    { lineNo: 521, vendorId: '0040042663', vendorName: 'High Risk Corp', riskRanking: 20, riskScore: 105.8, amount: 0.45, p2pcipy111: 0.0, p2pcipy112: 0.0, p2pcipy113: 0.0, riskBand: 'High' }
  ];

  async ngAfterViewInit() {
    // Load Chart.js dynamically
    if (typeof Chart === 'undefined') {
      await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js');
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  get filteredTransactions() {
    if (!this.searchText.trim()) {
      return this.transactions;
    }
    
    const searchLower = this.searchText.toLowerCase();
    return this.transactions.filter(transaction => 
      Object.values(transaction).some(value => 
        value.toString().toLowerCase().includes(searchLower)
      )
    );
  }

  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      setTimeout(() => {
        this.buildChart();
      }, 100);
    }
  }

  onRowClick(transaction: Transaction) {
    this.selectedTransaction = transaction;
    if (this.chart && this.showChart) {
      this.updateChartSelection();
    }
  }

  private buildChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;
    
    const lowRisk = this.transactions.filter(t => t.riskBand === 'Low');
    const mediumRisk = this.transactions.filter(t => t.riskBand === 'Medium');
    const highRisk = this.transactions.filter(t => t.riskBand === 'High');

    const createDataset = (data: Transaction[], label: string, color: string) => ({
      label,
      data: data.map(t => ({ x: t.amount, y: t.riskScore, transaction: t })),
      backgroundColor: color,
      borderColor: color,
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false
    });

    const crosshairPlugin = {
      id: 'crosshairPlugin',
      afterDatasetsDraw: (chart: any) => {
        if (!this.selectedTransaction) return;
        const { ctx, scales: { x, y } } = chart;
        const px = x.getPixelForValue(this.selectedTransaction.amount);
        const py = y.getPixelForValue(this.selectedTransaction.riskScore);
        
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(px, y.top);
        ctx.lineTo(px, y.bottom);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(x.left, py);
        ctx.lineTo(x.right, py);
        ctx.stroke();
        
        ctx.restore();
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          createDataset(lowRisk, 'Low Risk', '#22c55e'),
          createDataset(mediumRisk, 'Medium Risk', '#f59e0b'),
          createDataset(highRisk, 'High Risk', '#ef4444')
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                const transaction = context[0].raw.transaction;
                return `Transaction Line No. ${transaction.lineNo}`;
              },
              label: (context: any) => {
                const transaction = context[0].raw.transaction;
                return [
                  `Vendor: ${transaction.vendorName}`,
                  `Risk Score: ${transaction.riskScore}`,
                  `Amount: $${(transaction.amount * 1000).toFixed(0)}M`,
                  `Risk Ranking: ${transaction.riskRanking}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Amount $',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              callback: (value: any) => value + 'B',
              font: {
                size: 12
              }
            },
            grid: {
              color: '#f1f5f9'
            },
            min: 0.05,
            max: 0.8
          },
          y: {
            title: {
              display: true,
              text: 'Risk Score',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              font: {
                size: 12
              }
            },
            grid: {
              color: '#f1f5f9'
            },
            min: 0,
            max: 140
          }
        },
        onClick: (event: any, elements: any) => {
          if (elements.length > 0) {
            const dataIndex = elements[0].index;
            const datasetIndex = elements[0].datasetIndex;
            const transaction = this.chart.data.datasets[datasetIndex].data[dataIndex].transaction;
            this.selectedTransaction = transaction;
            this.chart.update();
          }
        }
      },
      plugins: [crosshairPlugin]
    });
  }

  private updateChartSelection() {
    if (this.chart) {
      this.chart.update();
    }
  }
}