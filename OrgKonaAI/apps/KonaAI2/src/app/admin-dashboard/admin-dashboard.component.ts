import { CommonModule, isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, DOCUMENT, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
import { Project, ProjectServiceService } from "../project-service.service";

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
    private isBrowser: boolean = false;
    @ViewChild('canvas', { static: false })
    canvasRef!: ElementRef<HTMLCanvasElement>;
   data = [40, 30, 20, 10];
   colors = ['#1ec7e1', '#2aa775', '#f59e0b', '#a855f7'];
   labels = ['Investigator', 'L2 Auditor', 'L1 Auditor', 'Admin'];
    isExpand = false;
      projects: Project[] = []
    viewMode = 'grid';
    constructor( @Inject(DOCUMENT) private document: Document,
     private projectService: ProjectServiceService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    }
    ngOnInit(): void {
     
      this.loadProjects();
    }
    ngAfterViewInit() {
        if (this.isBrowser) {
         //this.initializeDonutChart();
       setTimeout(() => {
       this.renderDonut();
       }) 
        this.document.addEventListener('visibilitychange', () => {
        if (this.document.visibilityState === 'visible') {
        this.renderDonut();
        }
  });

    }
    }
    toggleSection() {
      this.isExpand = !this.isExpand;     
      this.renderDonut();
    }

        loadProjects(): void {
     this.projectService.getProjects().subscribe({
      next: (data: any) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error loading projects:', err);}
     });
  }

        initializeDonutChart() {
            const canvas = this.document.getElementById('donutChart') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const centerX = 50;
                const centerY = 50;
                const outerRadius = 40;
                const innerRadius = 25;

                const data = [
                    { label: 'Investigator', value: 12, color: '#1570ef' },
                    { label: 'L2 Auditor', value: 10, color: '#12b76a' },
                    { label: 'L1 Auditor', value: 5, color: '#f79009' },
                    { label: 'Admin', value: 1, color: '#7a5af8' }
                ];

                const total = data.reduce((sum, item) => sum + item.value, 0);
                let currentAngle = -Math.PI / 2;

            ctx?.clearRect(0, 0, canvas.width, canvas.height);
          
            data.forEach(item => {
                const sliceAngle = (item.value / total) * 2 * Math.PI;

                ctx?.beginPath();
                ctx?.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
                ctx?.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
                ctx?.closePath();
                if (ctx) {
                ctx.fillStyle = item.color;
                }
                ctx?.fill();

                currentAngle += sliceAngle;
            });
        }
        
        }
    
renderDonut() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = this.data.reduce((a, b) => a + b, 0);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) * 0.9;
    const innerRadius = radius * 0.6;

    let startAngle = -0.5 * Math.PI; // start top

    this.data.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      // Draw outer arc
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = this.colors[i];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw center hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI, true);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
       
}
