import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router'
import { ProjectServiceService,Client } from '../project-service.service';
import { MembersComponent } from "../members/members.component";
import { RolesComponent } from '../roles/roles.component';
import { TabStateService } from '../tab-switcher.service';
import { Subscription } from 'rxjs';
import { LicenseComponent } from '../License/License.component';
import { ClientConfigurationComponent } from '../clientConfiguration/clientConfiguration.component';
import { ConnectionsComponent } from '../connections/connections.component';
import { ProjectWorkflowComponent } from '../project-workflow/project-workflow.component';
import { ProjectSelectionService } from '../page-layout-elements/client-admin-layout/project-selection.service';
import { AuthService } from '../auth/auth.service';
import { TopBarComponent } from '../TopBar/top-bar.component';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MembersComponent,TopBarComponent,
     RolesComponent,LicenseComponent,ClientConfigurationComponent,ConnectionsComponent,ProjectWorkflowComponent],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();
   selectedTab = 'summary'
   clientId!: number;
   client: Client | undefined;
  activeTab: string = 'organisation'; // default tab
  isClientAdmin: boolean = false;
  isProjectSelected: boolean = false;
  selectedProjectId: number | null = null;
  isShowOrganisation: boolean= true;
isProjectsDisabled: boolean = true;
  isDataManager : boolean= false;
  isInstanceAdmin: boolean = true;
  activateTab: string ='';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tabState: TabStateService,
    private cd: ChangeDetectorRef,
    private projectService: ProjectServiceService,
    private projectSelectionService: ProjectSelectionService,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state) {
      // nav.extras.state is typed as any, so we cast
      const state = nav.extras.state;
      this.selectedTab = state['selectedTab'] ?? 'summary';
      console.log(this.selectedTab);
    }
    this.activateTab = 'organisation';
  }
  
  onTabChanged(tab: string) {
    console.log(tab)
      this.activateTab = tab;

    if (tab === 'organisation') {
      this.authService.setShowOrganisationValue('true');
    }
    else if (tab === 'projects') {
      this.authService.setShowOrganisationValue('false');
    }
  }
  ngOnInit(): void {
    // Check if user is Client Admin
    const currentUser = this.authService.currentUserValue;
    this.isClientAdmin = currentUser?.role === 'Client Admin';
    this.isDataManager = currentUser?.role === 'Data Manager';
    this.isInstanceAdmin = currentUser?.role === 'Instance Admin';
    if(this.isClientAdmin){
      this.isShowOrganisation=false;
    }

    // Subscribe to project selection state
    const projectSelectionSub = this.projectSelectionService.isProjectSelected$.subscribe(isSelected => {
      this.isProjectSelected = isSelected;
    });
    this.subs.add(projectSelectionSub);

    const selectedProjectSub = this.projectSelectionService.selectedProjectId$.subscribe(projectId => {
      this.selectedProjectId = projectId;
    });
    this.subs.add(selectedProjectSub);

    const sp = this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.tabState.setTab(tab);
      } else {
        // optionally set default
        this.tabState.setTab('summary');
      }
    });
    this.subs.add(sp)
    const sv = this.tabState.selectedTab$.subscribe(t => {
      this.selectedTab = t;
    });
    this.subs.add(sv);

    // Get clientId from route params, or use default client for summary tab
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    
    // If no clientId in route, load the first client or current user's client for summary
    if (!this.clientId || isNaN(this.clientId)) {
      this.loadDefaultClientData();
    } else {
      this.tabState.setClientId(this.clientId);
      this.projectService.getclients().subscribe((clients) => {
        this.client = clients.find(c => c.clientId === this.clientId);
      });
    }
  }
  selectTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'organisation') {
      // Clear project selection when switching to organisation
      this.projectSelectionService.clearProjectSelection();
      this.router.navigate(['/organisation']);
    } else if (tab === 'projects') {
      // Clear project selection when switching to projects tab (will be set again when specific project is selected)
      this.projectSelectionService.clearProjectSelection();
      // Navigate to the first tab of projects menu (Home)
      this.router.navigate(['/projects/home']);
    }
  }
  private loadDefaultClientData(): void {
    // Load clients and use the first one or current user's client for summary display
    this.projectService.getclients().subscribe((clients) => {
      if (clients && clients.length > 0) {
        // Use the first client or you can implement logic to get current user's client
        this.client = clients[0];
        this.clientId = clients[0].clientId;
        this.tabState.setClientId(this.clientId);
      } else {
        // Create a default client object if no clients are available
        this.client = {
          clientId: 1,
          name: 'Demo Client',
          domain: 'https://client-demo.konaai.com',
          sla: '99.9%',
          licenseStatus: 'Active',
          createdBy: 'System Admin',
          createdOn: new Date().toDateString(),
          riskAreas: ['Compliance', 'Risk Management'],
          modules: ['Risk Assessment', 'Compliance', 'Audit Management', 'Reporting'],
          projects: 0,
          users: 0
        };
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
   ngOnDestroy() {
    this.subs.unsubscribe();
  }
}