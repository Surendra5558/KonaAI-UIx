import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectServiceService } from '../project-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { OverviewComponent } from '../overview/overview.component';
import { FormsModule } from '@angular/forms';
import { WorkflowSetupComponent } from '../workflow-setup/workflow-setup.component';
import { AlertComponent } from '../Alerts-Component/alert.component';
import { InsightsComponent } from "apps/KonaAI2/src/app/insights/insights.component";
import { ProjectSelectionService } from '../page-layout-elements/client-admin-layout/project-selection.service';
import { CreateAlertComponent } from '../create-alert/create-alert.component';


@Component({
  selector: 'app-project-workflow',
  standalone: true,
  imports: [CommonModule, OverviewComponent, WorkflowSetupComponent, FormsModule, InsightsComponent, AlertComponent],
  templateUrl: './project-workflow.component.html',
  styleUrl: './project-workflow.component.scss'
})
export class ProjectWorkflowComponent implements OnInit {

  @Input() inputProjectId?: number; // Input property for project ID
  @Input() inputActiveTab?: string; // Input property for active tab

  projectData: Project | null = null;
  projectId!: number;
  activeTab: string = '';
  roleAssigned: string | null = null;
  userRole: string | null = null;


  constructor(
    private projectService: ProjectServiceService,
    private router: Router, private location: Location,
    private projectSelectionService: ProjectSelectionService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    // Use input project ID if provided, otherwise get from route
    if (this.inputProjectId) {
      this.projectId = this.inputProjectId;
    } else {
      this.projectId = Number(this.route.snapshot.paramMap.get('projectid'));
    }
    const id = this.projectId;
    
    // Set project selection state when entering project workflow
    this.projectSelectionService.setProjectSelected(true, id);
    
    // Handle case where project ID is 1 (default for L1 users)
    if (id === 1) {
      // Create a default project data for L1 users
      this.projectData = {
        projectid: 1,
        name: 'My Alerts Dashboard',
        title: 'My Alerts Dashboard',
        owner: 'System',
        audit: 'Active',
        risk: 'Medium',
        riskArea: 'General',
        modules: 'Alerts',
        range: 'All',
        status: 'Active',
        country: 'Global',
        businessUnit: 'Compliance',
        businessDevelopment: 'Internal',
        scope: 'Alert Management'
      };
    } else {
      this.projectService.getProjectById(id).subscribe(project => {
        this.projectData = project;
      });
    }
    
    this.roleAssigned = sessionStorage.getItem('currentUser');
    
    // Parse the role from session storage if it's a JSON string
    this.userRole = this.roleAssigned;
    if (this.roleAssigned) {
      try {
        const userData = JSON.parse(this.roleAssigned);
        this.userRole = userData.role;
      } catch (e) {
        // If parsing fails, use the original value
        this.userRole = this.roleAssigned;
      }
    }
    
    // Set default active tab based on user role
    if (this.userRole === 'Investigator' || this.userRole === 'L1 User') {
      this.activeTab = 'alert';
    } else {
      this.activeTab = 'overview';
    }

    // Prioritize input active tab (for component embedding)
    if (this.inputActiveTab) {
      this.activeTab = this.inputActiveTab;
    } else {
      // Allow external navigation to open a specific tab (e.g., Insights)
      const requestedTab = this.route.snapshot.queryParamMap.get('pfTab');
      if (requestedTab) {
        this.activeTab = requestedTab;
      }
    }

    // Subscribe to query parameter changes to handle tab switches on same route
    this.route.queryParams.subscribe(params => {
      console.log('ProjectWorkflow received query params:', params);
      console.log('Current activeTab before change:', this.activeTab);
      console.log('inputActiveTab:', this.inputActiveTab);
      
      if (params['pfTab'] && !this.inputActiveTab) {
        console.log('Setting activeTab to:', params['pfTab']);
        this.activeTab = params['pfTab'];
        console.log('activeTab after setting:', this.activeTab);
      } else if (!params['pfTab'] && !this.inputActiveTab) {
        // If no pfTab query param, default to overview for summary navigation
        console.log('No pfTab param, setting activeTab to overview');
        this.activeTab = 'overview';
        console.log('activeTab after setting to overview:', this.activeTab);
      }
    });
  }

  getProjectData(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.projectData = data;
      },
      error: (err) => {
        console.error('Failed to fetch project:', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    // No routing here — just switching local state
  }

}