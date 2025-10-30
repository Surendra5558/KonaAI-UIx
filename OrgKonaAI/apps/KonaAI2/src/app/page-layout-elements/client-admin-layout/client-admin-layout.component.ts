import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ClientAdminTabService } from './client-admin-tab.service';
import { ProjectSelectionService } from './project-selection.service';
import { filter } from 'rxjs/operators';
import { ProjectServiceService, Project } from '../../project-service.service';
import { ProjectTab } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-client-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './client-admin-layout.component.html',
  styleUrls: ['./client-admin-layout.component.scss']
})
export class ClientAdminLayoutComponent implements OnInit {
  activeTab: string = 'projects';
  roleAssigned: string | null = null;
  userRole: string | null = null;

  isClientAdmin: boolean = false;
  isOnProjectsHome: boolean = false;
  projectName: string | null = null;
  isL1User: boolean = false;
  isL2User: boolean = false;
  isDataManager: boolean = false;
  isInstanceAdmin : boolean = false;

  // Tabs visible for the current role
  visibleTabs: { key: string, label: string, icon: string }[] = [];
  organisationTabs: ProjectTab[] = [];


  constructor(
    private clientAdminTabService: ClientAdminTabService,
    private projectSelectionService: ProjectSelectionService,
    private router: Router,
    private projectService: ProjectServiceService
  ) { }

  ngOnInit(): void {
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

    // Check if user is Client Admin
    this.isClientAdmin = this.userRole === 'Client Admin';
    this.isL1User = this.userRole === 'L1 User';
    this.isL2User = this.userRole === 'L2 User';
    this.isInstanceAdmin = this.userRole === 'Instance Admin';

    if (this.isClientAdmin) {
      this.visibleTabs = [
        { key: 'organisation', label: 'Organisation', icon: 'bi-diagram-3' },
        { key: 'projects', label: 'Projects', icon: 'bi-bar-chart' }
      ];

    }

    else if (this.isL1User || this.isL2User) {
      this.visibleTabs = [
        { key: 'organisation', label: 'Organisation', icon: 'bi-diagram-3' },
        { key: 'projects', label: 'Projects', icon: 'bi-bar-chart' }
      ];

    }
    this.isDataManager = this.userRole === 'Data Manager';

    if (this.visibleTabs.length > 0) {
      this.activeTab = this.visibleTabs[1].key;
      this.clientAdminTabService.setActiveTab(this.activeTab);
      this.isDataManager = this.userRole === 'Data Manager';
      // Set default tab for Client Admin
      if (this.isClientAdmin) {
        this.activeTab = 'projects';
        this.clientAdminTabService.setActiveTab('projects');
      }
      if (this.isDataManager) {
        this.activeTab = 'organisation'
          ;
      }

      // Listen to route changes to update active tab
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateActiveTabFromRoute(event.url);
        });

      // Set initial active tab based on current route
      this.updateActiveTabFromRoute(this.router.url);

      // Subscribe to selected project id and fetch project name
      this.projectSelectionService.selectedProjectId$.subscribe((projectId) => {
        if (projectId) {
          this.projectService.getProjectById(projectId).subscribe((proj: Project | null) => {
            this.projectName = proj?.name || null;
          });
        } else {
          this.projectName = null;
        }
      });
    }
  }
  goBackToProjectsHome(): void {
    // Navigate back to Projects Home tab
    this.activeTab = 'projects';
    this.clientAdminTabService.setActiveTab('projects');
    this.router.navigate(['/projects/home']);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.clientAdminTabService.setActiveTab(tab);

    if (tab === 'organisation') {
      this.projectSelectionService.clearProjectSelection();
      this.router.navigate(['/organisation/summary']);
    } else if (tab === 'projects') {
      this.projectSelectionService.clearProjectSelection();
      this.router.navigate(['/projects/home']);
    }
  }
  private updateActiveTabFromRoute(url: string): void {
    if (url.startsWith('/organisation')) {
      this.activeTab = 'organisation';
      this.clientAdminTabService.setActiveTab('organisation');
      // Clear project selection when navigating to organisation routes
      this.projectSelectionService.clearProjectSelection();
      this.isOnProjectsHome = false;
    } else if (url.startsWith('/projects') ||
      url === '/projects' ||
      url === '/projects/' ||
      url.includes('/projectsDashboard') ||
      url.includes('/ProjectWorkflow') ||
      url.includes('/projects/workflow') ||
      url.includes('/admin-projects') ||
      url.includes('/overview/') ||
      (url.includes('/insights') && !url.includes('/organisation/insights')) ||
      (url.includes('/alert') && !url.includes('/organisation/')) ||
      (url.includes('/members') && !url.includes('/organisation/')) ||
      (url.includes('/roles') && !url.includes('/organisation/'))) {
      this.activeTab = 'projects';
      this.clientAdminTabService.setActiveTab('projects');
      // Clear project selection for general projects routes (will be set when specific project is accessed)
      if (url.includes('/projects/home') || url.includes('/projectsDashboard')) {
        this.projectSelectionService.clearProjectSelection();
      }
      this.isOnProjectsHome = url.includes('/projects/home') || url === '/projects' || url === '/projects/';
    }
  }


}