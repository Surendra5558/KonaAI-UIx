
// insights.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';
import { ChoroplethController, ProjectionScale } from 'chartjs-chart-geo';
import { feature } from 'topojson-client';
//import { InsightsComponent } from '../app/Insights/insights.component';
Chart.register(ChoroplethController, ProjectionScale);

// Define the InvoiceStats interface
interface InvoiceStats {
  total: number;
  flagged: number;
  percentage: number;
}

// Define the VendorData interface
interface VendorData {
  id: string;
  name: string;
  totalAmount: number;
  flaggedAmount: number;
  riskLevel: string;
}

Chart.register(...registerables);

// (routes array moved below the class definition)

@Component({
  selector: 'app-insights-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './insights-overview.component.html',
  styleUrl: './insights-overview.component.scss'
})
export class InsightsOverviewComponent implements OnInit {
  @ViewChild('barChart', { static: false }) barChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('geoChart', { static: false }) geoChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('vendorChart', { static: false }) vendorChart!: ElementRef<HTMLCanvasElement>;

  // View toggles
  leftChartView: 'chart' | 'table' = 'chart';
  rightChartView: 'chart' | 'table' = 'chart';
  vendorView: 'chart' | 'table' = 'table';



   

  // Chart instances
  private barChartInstance: Chart | null = null;
  private geoChartInstance: Chart | null = null;
  private pieChartInstance: Chart | null = null;
    private vendorChartInstance: Chart | null = null;

  selectedCurrency = 'USD';
  reportingCurrency = 'USD';

  // Sample data for the main charts
  invoiceData = [
    { year: 2010, totalAmount: 420000000, flaggedAmount: -850000000, yoyChange: 'N/A' },
    { year: 2012, totalAmount: 720000000, flaggedAmount: 480000000, yoyChange: '+71.4%' },
    { year: 2014, totalAmount: 950000000, flaggedAmount: 820000000, yoyChange: '+31.9%' },
    { year: 2016, totalAmount: -650000000, flaggedAmount: 20000000, yoyChange: '-168.4%' },
    { year: 2018, totalAmount: -850000000, flaggedAmount: 120000000, yoyChange: '+30.8%' }
  ];

  // Dashboard stats
  overdue: InvoiceStats = { total: 792, flagged: 0, percentage: 0 };
  invoiceFlagged: InvoiceStats = { total: 121, flagged: 80, percentage: 66.1 };
  invLinesFlagged: InvoiceStats = { total: 122, flagged: 33, percentage: 27.0 };
  invAmtFlagged: InvoiceStats = { total: 615, flagged: 498, percentage: 80.97 };

  // Additional stats
  totalVendors = 1752;
  flaggedVendors = 1341;
  totalInvoices = 121800;
  flaggedInvoices = 65210;
  totalInvLines = 122330;
  flaggedInvLines = 66070;

  // Vendor risk data
  vendorRiskData: VendorData[] = [
    { id: '0000001816', name: 'MOBIL FUEL CAIL', totalAmount: 8447700, flaggedAmount: 7050000, riskLevel: 'High' },
    { id: '0000008640', name: 'Certrim LLC', totalAmount: 2441700, flaggedAmount: 2341550, riskLevel: 'High' },
    { id: '0740003799', name: 'Emmerton and B...', totalAmount: 6473644, flaggedAmount: 2005200, riskLevel: 'High' },
    { id: '0000078511', name: 'Fairmont, Laure...', totalAmount: 2743820, flaggedAmount: 1831500, riskLevel: 'Medium' },
    { id: '0000238677', name: 'Goldstar, Cumm...', totalAmount: 4388940, flaggedAmount: 1479800, riskLevel: 'Medium' },
    { id: '0000048479', name: 'Lens Queensbake', totalAmount: 1785000, flaggedAmount: 1344500, riskLevel: 'High' },
    { id: '0000018327', name: 'Shirmoot Realty...', totalAmount: 1556120, flaggedAmount: 1102470, riskLevel: 'Medium' },
    { id: '0000024386', name: 'Grady LLC', totalAmount: 1394200, flaggedAmount: 1074350, riskLevel: 'High' }
  ];

  geoData = [
    { region: 'North America', riskScore: 8.5, color: 'high' },
    { region: 'Europe', riskScore: 6.2, color: 'medium' },
    { region: 'Asia Pacific', riskScore: 4.8, color: 'low' },
    { region: 'Latin America', riskScore: 7.1, color: 'medium' },
    { region: 'Middle East', riskScore: 9.2, color: 'high' },
    { region: 'Africa', riskScore: 3.9, color: 'low' }
  ];

    vendorTimeSeriesData = [
    { year: 2010, totalAmount: 2700, flaggedAmount: 1950 },
    { year: 2012, totalAmount: 2200, flaggedAmount: 2100 },
    { year: 2014, totalAmount: 1750, flaggedAmount: 1700 },
    { year: 2016, totalAmount: 1650, flaggedAmount: 1100 },
    { year: 2018, totalAmount: 1850, flaggedAmount: 650 },
    { year: 2020, totalAmount: 1000, flaggedAmount: 750 },
    { year: 2022, totalAmount: 1200, flaggedAmount: 900 }
  ];

  ngOnInit(): void {
      this.createVendorChart();
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  // Toggle methods
  toggleLeftView() {
    this.leftChartView = this.leftChartView === 'chart' ? 'table' : 'chart';
    if (this.leftChartView === 'chart') {
      setTimeout(() => this.createBarChart(), 100);
    }
  }

  toggleRightView() {
    this.rightChartView = this.rightChartView === 'chart' ? 'table' : 'chart';
    if (this.rightChartView === 'chart') {
      setTimeout(() => this.createGeoChart(), 100);
    }
  }

  toggleVendorView() {
    this.vendorView = this.vendorView === 'chart' ? 'table' : 'chart';
  }

  initializeCharts(): void {
    this.createBarChart();
    this.createGeoChart();
    this.createPieChart();
  }

  createBarChart(): void {
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    const ctx = this.barChart?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.invoiceData.map(d => d.year.toString()),
        datasets: [
          {
            label: 'Total Amount',
            data: this.invoiceData.map(d => d.totalAmount / 1000000),
            backgroundColor: '#4285F4',
            borderColor: '#4285F4',
            borderWidth: 1
          },
          {
            label: 'Flagged Amount',
            data: this.invoiceData.map(d => d.flaggedAmount / 1000000),
            type: 'line',
            borderColor: '#EA4335',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: '#EA4335',
            pointBorderColor: '#EA4335',
            pointRadius: 4,
            fill: false,
            tension: 0.4
          }
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
              padding: 20
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount $'
            },
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              callback: function(value: any) {
                return value >= 0 ? `${value}B` : `-${Math.abs(value)}B`;
              }
            }
          }
        }
      }
    });
  }

  // createGeoChart(): void {
  //   if (this.geoChartInstance) {
  //     this.geoChartInstance.destroy();
  //   }

  //   const ctx = this.geoChart?.nativeElement?.getContext('2d');
  //   if (!ctx) return;

  //   this.geoChartInstance = new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       labels: this.geoData.map(d => d.region),
  //       datasets: [{
  //         data: this.geoData.map(d => d.riskScore),
  //         backgroundColor: this.geoData.map(d => {
  //           switch(d.color) {
  //             case 'high': return '#EA4335';
  //             case 'medium': return '#FBBC04';
  //             case 'low': return '#34A853';
  //             default: return '#9AA0A6';
  //           }
  //         }),
  //         borderWidth: 2,
  //         borderColor: '#fff'
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         legend: {
  //           display: false
  //         }
  //       }
  //     }
  //   });
  // }

    createVendorChart(): void {
    if (this.vendorChartInstance) {
      this.vendorChartInstance.destroy();
    }
 
    const ctx = this.vendorChart?.nativeElement?.getContext('2d');
    if (!ctx) return;
 
    this.vendorChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.vendorTimeSeriesData.map(d => d.year.toString()),
        datasets: [
          {
            label: 'Total Amount',
            data: this.vendorTimeSeriesData.map(d => d.totalAmount),
            backgroundColor: '#4A90E2',
            borderColor: '#4A90E2',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Flagged Amount',
            data: this.vendorTimeSeriesData.map(d => d.flaggedAmount),
            backgroundColor: '#DC3545',
            borderColor: '#DC3545',
            borderWidth: 1,
            borderRadius: 4
          }
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
              padding: 20
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount $'
            },
            grid: {
              color: '#E5E7EB'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

createGeoChart(): void {
  if (this.geoChartInstance) this.geoChartInstance.destroy();

  const ctx = this.geoChart?.nativeElement?.getContext('2d');
  if (!ctx) return;

  fetch('https://unpkg.com/world-atlas/countries-50m.json')
    .then(r => r.json())
    .then(world => {
      const countries = (feature(world, world.objects.countries) as any).features;

      this.geoChartInstance = new Chart(ctx, {
        type: 'choropleth',
        data: {
          labels: countries.map((d: any) => d.properties.name),
          datasets: [{
            label: 'Risk Score',
            data: this.geoData.map((d, i) => ({
              feature: countries[i],
              value: d.riskScore
            })),
            backgroundColor: (ctx: import('chart.js').ScriptableContext<'choropleth'>) => {
              const value = (ctx.raw as { value?: number } | undefined)?.value;
              if (typeof value === 'number') {
                if (value > 8) return '#EA4335';
                if (value > 5) return '#FBBC04';
                return '#34A853';
              }
              return '#9AA0A6'; // default color if value is undefined
            }
          }]
        },
        options: {
          showOutline: true,
          showGraticule: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            projection: {
              axis: 'x',
              projection: 'equalEarth'
            }
          }
        }
      });
    });
}

  createPieChart(): void {
    const ctx = this.pieChart?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['REG - Vendor invoice gross', 'ZF - BNZMT reduced', 'ML - Vendor invoices LIV', 'SIA - OIL Account Document', 'NJ - IV Non Op Bill AO'],
        datasets: [{
          data: [55.4, 20.8, 12.5, 7.7, 3.6],
          backgroundColor: [
            '#1f4788',
            '#4A90E2',
            '#7BB3F0',
            '#A8CDF0',
            '#D6E8F5'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatAmount(amount: number): string {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000000) {
      return `$${(absAmount / 1000000000).toFixed(0)}B`;
    } else {
      return `$${(absAmount / 1000000).toFixed(0)}M`;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US').format(num);
  }

  getRiskLevelClass(riskLevel: string): string {
    switch(riskLevel) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return '';
    }
  }

  // Navigation methods
  navigateToOverview(): void {
    console.log('Navigate to Overview');
  }

  navigateToTrends(): void {
    console.log('Navigate to Trends');
  }

  navigateToVendors(): void {
    console.log('Navigate to Vendors');
  }

  exportReport(): void {
    console.log('Export Report');
  }

  refreshData(): void {
    console.log('Refresh Data');
    this.initializeCharts();
  }

  onCurrencyChange(): void {
    console.log('Currency changed to:', this.selectedCurrency);
    this.reportingCurrency = this.selectedCurrency;
    // Here you would typically call an API to update the currency and refresh data
    this.refreshData();
  }

  openCurrencySettings(): void {
    console.log('Opening currency settings');
    // Here you would typically open a modal or navigate to settings page
    // For now, just log the action
  }
}