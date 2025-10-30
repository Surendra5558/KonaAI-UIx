import { Component, OnInit } from '@angular/core';
import { ProjectServiceService, Project } from '../project-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';;
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProjectSelectionService } from '../page-layout-elements/client-admin-layout/project-selection.service';
import { ProjectCreationComponent } from '../project-creation/project-creation.component';
import { TopBarComponent } from '../TopBar/top-bar.component';

interface ProjectMember {
  name: string;
  initials: string;
  color: string;
}


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, TopBarComponent],
  templateUrl: './projectDashboard.component.html',
  styleUrl: './projectDashboard.component.scss'
})
export class ProjectDashboardComponent implements OnInit {

  projects: Project[] = []
  viewMode: 'grid' | 'list' = 'list';
  isMenuOpen = false;
  activeTab: string = '';
  statuses: string[] = ['Active', 'Planning', 'Completed'];
  modules: string[] = ['O2C', 'P2P', 'T&E'];
  isShowProjectDashboard: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = '';
  filteredProject: Project[] | undefined;
  selectedModule: string = '';
  selectedStatusFilter: string = '';
  selectedProject: Project | null = null;
  floatingMenuVisible = false;
  floatingMenuPosition = { top: 0, left: 0 };
  currentRole: any;
  isDataManager: boolean = false;
   isClientAdmin: boolean = false;
  isRouteback: string = '';

  get filteredProjects(): Project[] {
    return this.projects.filter(project => {
      const matchesStatus = this.selectedStatus ? project.status === this.selectedStatus : true;
      const matchesSearch = this.searchTerm
        ? project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
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


  onFilterChange() {
    this.filteredProject = this.projects.filter(project => {
      const matchesModule =
        this.selectedModule === 'All Modules' || project.modules === this.selectedModule;
      const matchesStatus =
        this.selectedStatusFilter === 'All Statuses' || project.status === this.selectedStatusFilter;
      const matchesSearch = this.searchTerm
        ? project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      return matchesModule && matchesStatus && matchesSearch;
    });
  }

  deleteProject() {
    this.closeFloatingMenu();
    console.log('Delete project');
  }
  closeFloatingMenu() {
    this.floatingMenuVisible = false;
  }
  onCancel() {
    console.log('Cancel clicked');
    // Add your cancel logic here
  }

  // openAddProjectModal() {
  //   this.router.navigate(['/ProjectCreation']);
  //   console.log('Add project button clicked');
  // }

  editProject(project: Project) {
    console.log('Edit project:', project);
    // Implement edit functionality
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
  constructor(
    private projectService: ProjectServiceService, private authService: AuthService,
    private router: Router,
    private projectSelectionService: ProjectSelectionService, private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  ngondestory(){

  }
  activateTab : string ='projects'
  onTabChanged(tab: string) {
    console.log(tab)
    if (tab === 'organisation') {
      this.authService.setShowOrganisationValue('true');
    }
    else if (tab === 'projects') {
      this.authService.setShowOrganisationValue('false');
    }
  }

  ngOnInit(): void {
    this.currentRole = this.authService.currentUserValue;
    this.isDataManager = this.currentRole.role === 'Data Manager';
    this.isClientAdmin = this.currentRole.role === 'Client Admin';
    this.isRouteback = this.route.snapshot.paramMap.get('id') || '';
    if (this.isRouteback == "true") {
      this.loadProjects();
      this.isShowProjectDashboard = true;
      this.activeTab = 'projects';
      this.projectSelectionService.setIsProjectBack(true);
      return;
    }
    if (this.isDataManager) {
      return;
    } else {
      this.loadProjects();
      this.isShowProjectDashboard = true;
    }

  }
  selectTab(item: string) {
    this.activeTab = item;
    if (this.activeTab === 'organisation') {
      this.isShowProjectDashboard = false;
      this.authService.setShowOrganisationValue('true');
    } else {
      this.isShowProjectDashboard = true;
      this.loadProjects();
      this.authService.setShowOrganisationValue('false');
    }
  }

  sortBy = 'lastViewed';



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

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data: any) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      }
    });
  }

  isEditVisible = false;
  owner = 'John Smith';
  status = 'Approved';

  owners = ['John Smith', 'Jane Doe', 'Mark Lee'];

  closeModal(event: MouseEvent) {
    this.isEditVisible = false;
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation(); // Prevent closing when clicking inside modal
  }

  save() {
    // You can add validation or API call here
    console.log('Saved:', { owner: this.owner, status: this.status });
    this.isEditVisible = false;
  }

  goToProjectSummary(project: any) {
    var role = JSON.parse(sessionStorage.getItem('currentUser') || '{}').role;

    // Set project selection state when navigating to a specific project
    this.projectSelectionService.setProjectSelected(true, project.projectid);

    if (role == "Data Manager") {
      this.router.navigate(['/data', project.name]);
      return;
    }
    if (role == "Investigator") {
      this.router.navigate(['/ProjectWorkflow', project.projectid]);
      return;
    }
    if (role == "Audit & Compliance") {
      this.router.navigate(['/ProjectWorkflow', project.projectid]);
      return;
    }
    if (role == "L2 User") {
      this.router.navigate(['/alert-dashboard']);
      return;
    }
      if (role == "L1 User") {
      this.router.navigate(['/projects/alerts']);
      return;
    }
    else {
      this.router.navigate(['/ProjectWorkflow', project.projectid]);
      return;
    }
  }

    openAddProjectModal() {
    console.log('Opening project creation modal...'); 

    const dialogRef = this.dialog.open(ProjectCreationComponent, {
      maxWidth: '70vw',
      width: '100%',
      height: '690px',
      disableClose: true
    });

    
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
      if (result) {
      
        console.log('Dialog result:', result);
        
        this.loadProjects();
      }
    });
  }

}
