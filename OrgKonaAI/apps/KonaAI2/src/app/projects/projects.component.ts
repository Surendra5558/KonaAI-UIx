import { Component, OnInit } from '@angular/core';
import { ProjectServiceService, Project, Projects } from '../project-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';;
import { FormsModule } from '@angular/forms';
import { ProjectCreationComponent } from '../project-creation/project-creation.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@org-kona-ai/shared';
import { SHARED_IMPORTS, SHARED_PROVIDERS } from '../shared/shared-imports';

interface ProjectMember {
  name: string;
  initials: string;
  color: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_IMPORTS],
  providers: [...SHARED_PROVIDERS,DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = []
  viewMode: 'grid' | 'list' = 'list';
  isMenuOpen = false;
  endDate: string = '';
  scope: string = '';
  statuses: string[] = ['Active', 'Planning', 'Completed'];
  searchTerm: string = '';
  selectedStatus: string = '';
  filteredProject: Project[] | undefined;
  menuOpen: boolean[] = [];
  clickedIndex: number | null = null;
  floatingMenuVisible = false;
  floatingMenuPosition = { top: 0, left: 0 };
  sortBy = 'lastViewed';
  selectedProject: Project | null = null;

  constructor(
    private projectService: ProjectServiceService,
    private router: Router,
    private dialog: MatDialog, private datePipe: DatePipe, private apiservice: ApiService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  get filteredProjects(): Project[] {
    return this.projects.filter(project => {
      const matchesStatus = this.selectedStatus ? project.status === this.selectedStatus : true;
      const matchesSearch = this.searchTerm
        ? project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }
  
  onCancel() {
    console.log('Cancel clicked');
    // Add your cancel logic here
  }

  openAddProjectModal() {
    const dialogRef = this.dialog.open(ProjectCreationComponent, {
      maxWidth: '70vw',
      width: '100%',
      height: '690px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Project saved:', result);
      }
    });
    console.log('Add project button clicked');
  }

  openFloatingMenu(event: MouseEvent, project: Project) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.floatingMenuPosition = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX - 130
    };

    this.floatingMenuVisible = true;
    this.selectedProject = { ...project }; // store the clicked project
  }

  closeFloatingMenu() {
    this.floatingMenuVisible = false;
  }

  viewOwner() {
    this.closeFloatingMenu();
    alert('Owner profile clicked');

  }

  deleteProject() {
    this.closeFloatingMenu();
    console.log('Delete project');
  }

  editDetails() {
    this.closeFloatingMenu();
    if (this.selectedProject) {
      if (this.selectedProject.range?.includes(' - ')) {
        const [start = '', end = ''] = this.selectedProject.range.split(' - ');
        this.selectedProject.startDateDisplay = start.trim();
        this.selectedProject.endDateString = end.trim(); // editable end date
      } else {
        this.selectedProject.startDateDisplay = '';
        this.selectedProject.endDateString = '';
      }
      this.isEditVisible = true;
    }
  }

  updateRange() {
    if (this.selectedProject) {
      // optional: validate date here
      this.selectedProject.range = `${this.selectedProject.startDateDisplay} - ${this.selectedProject.endDateString}`;
    }
  }

  // Format for display like "1 Sep 25"
  formatDateForDisplay(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear().toString().slice(-2); // last 2 digits
    return `${day} ${month} ${year}`;
  }

  filterProjects() {
    if (!this.searchTerm.trim()) {
      this.filteredProject = [...this.projects];
    } else {
      this.filteredProject = this.projects.filter(project =>
        project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.owner.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.riskArea.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sortProjects() {
    switch (this.sortBy) {
      case 'title':
        this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'created':
        this.filteredProjects.sort((a, b) => new Date(a.range).getTime() - new Date(b.range).getTime());
        break;
      default:
        this.filterProjects();
    }
  }
  toggleMenu(index: number) {
    this.menuOpen[index] = !this.menuOpen[index];
  }

  showMenu(index: number) {
    this.menuOpen[index] = true;
  }

  hideMenu(index: number) {
    this.menuOpen[index] = false;
  }

  viewProfile(project: any) {
    console.log("Profile", project);
  }

  openOwnerProfile(project: any) {
    console.log("Owner profile for:", project);
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

  isEditVisible = false;

  closeModal(event: MouseEvent) {
    this.isEditVisible = false;
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation(); // Prevent closing when clicking inside modal
  }

  save() {
    if (this.selectedProject) {
      this.selectedProject.range = `${this.selectedProject.startDateDisplay} - ${this.selectedProject.endDateString}`;
    }
    console.log('Updated project:', this.selectedProject);
    this.isEditVisible = false;
  }

  goToProjectSummary(id: number) {
    this.router.navigate(['/ProjectWorkflow', id]);
  }
}
