import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService, LoginUser } from '../../auth/auth.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { HelpComponent } from '../../help/help.component';
import { NotificationComponent } from '../../notification/notification.component';
import { ClientAdminTabService } from '../client-admin-layout/client-admin-tab.service';
import { ProjectSelectionService } from '../client-admin-layout/project-selection.service';
import { TabStateService } from '../../tab-switcher.service';
import { RoleNavigationBase } from '../../role-base/role-base';
import { MenuService } from '../../menu.service';
import { ApiService } from '@org-kona-ai/shared';
import { SHARED_PROVIDERS } from '../../shared/shared-imports';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  subItem?: string;
  isParent?: boolean;
}

export interface ProjectTab {
  id: string;
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HelpComponent, NotificationComponent],
  providers: [...SHARED_PROVIDERS],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends RoleNavigationBase implements OnInit, OnDestroy {
  subActionItem = '';
  isCollapsed = false;
  showOrgItems = false;
  activeSection = 'audit';
  activeItem: string = '';
  activeSubItem = 'projects';
  selectedTab = '';
  id: number | null = null;
  currentUser: LoginUser | null = null;
  isProjectAdmin: boolean = false;
  isInstanceAdmin: boolean = false;
  isClientAdmin: boolean = false;
  isInvestigator: boolean = false;
  isAudit: boolean = false;
  isGuest: boolean = false;
  isDataManager: boolean = false;
  isAdmin: boolean = false;
  isL1User: boolean = false;
  isL2User: boolean = false;
  instanceAdminMenu: MenuItem[] = [
    {
      id: 'AllClients',
      label: 'All Clients',
      icon: 'grid-fill',
      isActive: true,
      subItem: '',
      isParent: true,
    },
    {
      id: 'client-details',
      label: 'Summary',
      icon: 'card-list',
      isActive: true,
      subItem: 'summary',
      isParent: false
    },
    {
      id: 'client-details',
      label: 'Members',
      icon: 'people',
      isActive: true,
      subItem: 'users',
      isParent: false
    },
    {
      id: 'client-details',
      label: 'Roles',
      icon: 'people',
      isActive: true,
      subItem: 'roles',
      isParent: false
    },
    {
      id: 'client-details',
      label: 'Connectors',
      icon: 'arrow-left-right',
      isActive: true,
      subItem: 'connectors',
      isParent: false
    },
    {
      id: 'client-details',
      label: 'Configurations',
      icon: 'gear',
      isActive: true,
      subItem: 'configurations',
      isParent: false
    },
    {
      id: 'client-details',
      label: 'License',
      icon: 'window-dock',
      isActive: true,
      subItem: 'license',
      isParent: false
    },
  ];
  adminMenu: MenuItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: 'grid-fill',
      isActive: true
    },
    {
      id: 'organisation-setup',
      label: 'Organisation Setup',
      icon: 'house-door'
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'person'
    },
    {
      id: 'members',
      label: 'Members',
      icon: 'people'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'file-earmark-text'
    },
    {
      id: 'questionnaire/list',
      label: 'Questionnaire Builder',
      icon: 'question-circle'
    },
    {
      id: 'insights',
      label: 'Insights Template',
      icon: 'activity'
    },
    {
      id: 'admin-projects',
      label: 'Projects',
      icon: 'folder'
    }
  ];

  activeTab: string = '';
  activeProjectTab: string = '';
  currentClientAdminTab: string = 'projects';
  private isNavigatingFromTabClick: boolean = false;
  isProjectSelected: boolean = false;


  // Organisation tabs for client admin
  organisationTabs: ProjectTab[] = [
  
    {
      id: 'summary',
      label: 'Summary',
      icon: 'bi-file-text',
      route: '/organisation/summary',
      isActive: false
      
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'bi-file-earmark-text',
      route: '/organisation/documents',
      isActive: false
     
    },
    {
      id: 'questionnaire-builder',
      label: 'Questionnaire Builder',
      icon: 'bi-question-circle',
      route: '/organisation/questionnaire',
      isActive: false
      
    },
    {
      id: 'insights-template',
      label: 'Insights Template',
      icon: 'bi-bar-chart',
      route: '/organisation/insights',
      isActive: false
      
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'bi-people',
      route: '/organisation/members',
      isActive: false
     
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'bi-person-badge',
      route: '/organisation/roles',
      isActive: false
     
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: 'bi-gear',
      route: '/organisation/configuration',
      isActive: false
    
    },
    {
      id: 'connectors',
      label: 'Connectors',
      icon: 'bi bi-arrow-left-right',
      route: '/organisation/connector',
      isActive: false,
      
    },

    {
      id: 'License',
      label: 'License',
      icon: 'bi bi-window-dock',
      isActive: false,
      route: '/organisation/License',
    
    },

  ];

    L1userOrganisationTabs: ProjectTab[] = [
  
    {
      id: 'summary',
      label: 'Summary',
      icon: 'bi-file-text',
      route: '/organisation/summary',
      isActive: true
     
    }
  ];

  // Project tabs for client admin
  projectTabs: ProjectTab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'bi-house',
      route: '/projects/home',
      isActive: true
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: 'bi-file-text',
      route: '/projects/summary',
      isActive: false
    },
    {
      id: 'workflow-setup',
      label: 'Workflow Set Up',
      icon: 'bi-diagram-3',
      route: '/ProjectWorkflow',
      isActive: false
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: 'bi-bar-chart',
      route: '/projects/insights',
      isActive: false
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'bi-exclamation-triangle',
      route: '/projects/alerts',
      isActive: false
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'bi-people',
      route: '/projects/members',
      isActive: false
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'bi-person-badge',
      route: '/projects/roles',
      isActive: false
    }
  ];

    L1UserprojectTabs: ProjectTab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'bi-house',
      route: '/projects/home',
      isActive: true
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'bi-exclamation-triangle',
      route: '/projects/alerts',
      isActive: false
    }
 
  ];
      L2UserprojectTabs: ProjectTab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'bi-house',
      route: '/projects/home',
      isActive: true
    },
    {
      id: 'alertsDashboard',
      label: 'Alerts Dashboard',
      icon: 'bi-bar-chart',
      route: '/alert-dashboard',
      isActive: false
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'bi-exclamation-triangle',
      route: '/projects/alerts',
      isActive: false
    }
    
 
  ];

  dataManagerMenu: MenuItem[] = [
    {
      id: 'Dashboard',
      label: 'Home',
      icon: 'grid-fill',
      isActive: true,
      subItem: 'Dashboard',
      isParent: true,
    },
    {
      id: 'client-details',
      label: 'Dashboards',
      icon: 'card-list',
      isActive: true,
      subItem: 'dashboards',
      isParent: false
    },
    {
      id: 'client-details',
      label: 'Connections',
      icon: 'people',
      isActive: true,
      subItem: 'users',
      isParent: false
    }
  ];

  private userSubscription: Subscription = new Subscription();
  private tabSubscription: Subscription = new Subscription();
  private routeSubscription: Subscription = new Subscription();
  private projectSelectionSubscription: Subscription = new Subscription();
  private topBarComponent: Subscription = new Subscription();

  @ViewChild(HelpComponent) helpComp!: HelpComponent;
  @ViewChild(NotificationComponent) notification!: NotificationComponent;
  activatedTab: ProjectTab[] = [];
  sub: any;
  isShowAll: boolean = false;
  showProjects: boolean = false;
  activateTabs: string = '';
  private destroy$ = new Subject<void>();

  currentDataManagerTab: string = 'showHome';
  currentRole: any;
  private isProjectBack: Subscription = new Subscription();
  constructor(public authService: AuthService, public menuServ: MenuService, private router: Router, private clientAdminTabService: ClientAdminTabService, private projectSelectionService: ProjectSelectionService, private tabState: TabStateService, private route: ActivatedRoute, private apiSer: ApiService) { 
    super(menuServ, authService);
  }
  submenuItems: any = {
    organisation: [
      { key: 'summary', label: 'Summary', icon: 'bi bi-card-checklist' },
      { key: 'connections', label: 'Connections', icon: 'bi bi-arrow-left-right' }
    ],
    projects: [
      { key: 'home', label: 'Home', icon: 'bi bi-house' },
      { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-grid' }
    ]
  };
  submenuItems1: any = {
    organisation: [
      { key: 'summary', label: 'Summary', icon: 'bi bi-card-checklist' },
      { key: 'connections', label: 'Connections', icon: 'bi bi-arrow-left-right' }
    ],
    projects: [
      { key: 'home', label: 'Home', icon: 'bi bi-house' },
    ]
  };
  routeActiveItem(item: string) {
    this.activeItem = '';
    if (item === 'summary') {
      this.activeItem = 'summary';
      this.router.navigate(['/organisation/summary']);
      return;
    }
    else if (item === 'connections') {
      this.activeItem = 'connections';
      this.router.navigate(['/connections']);
      return;
    } else if (item === 'dashboard') {
      this.activeItem = 'dashboard';
      this.router.navigate(['/projectsDashboard', true]);
      return;
    }
    else if(item === 'archive'){
      this.activeItem= 'archive'
      this.onArchieved();
    }
    else if(item ==='notifications'){
      this.activeItem = 'notifications'
      return;
    }
    else if(item === 'help'){
      this.activeItem ='help'
      return;
    }
    else {
      this.activeItem = 'home';
      this.router.navigate(['/projectsDashboard', true]);
      this.currentDataManagerTab='showHome'
      return;
    }
  }
  override ngOnInit(): void {
    super.ngOnInit();
    const storedUserString = sessionStorage.getItem('currentUser');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      console.log(storedUser);
      if (storedUser) {
       this.currentRole = storedUser;
       
      }
    //this.currentRole = this.authService.currentUserValue;
    this.isDataManager = this.currentRole.role === 'Data Manager';
    this.topBarComponent = this.authService.isShowOrganization$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res == 'true') {
          this.activateTabs = 'organisation';
          this.activeItem = 'summary';
          this.setActiveItem('summary');
          this.currentDataManagerTab ='showHome';
        } else if (res == 'false') {
          this.activateTabs = 'projects';
          this.activeItem = 'home';
          this.setActiveItem('home')
        } else {
          this.activateTabs = 'projects';
          this.activeItem = 'home';
          this.setActiveItem('home');
          this.currentDataManagerTab ='showHome';
        }
        this.activeSection = 'dataManager';
        return;
      });
    this.tabState.selectClientId().subscribe(res => {
      if (res) {
        this.id = res;

      }
    });
    this.sub = this.authService.isShowDashboardValue$.subscribe(val => {
      if (val === 'true') {
        this.isShowAll = true;
        this.selectedTab = 'client-details'
        this.activeItem = 'dashboards';
        this.setActiveItem(this.activeItem,this.selectedTab);
      }
      else {
        this.isShowAll = false;
      }
    });
    this.tabState.selectedTab$.subscribe(t => {
      this.selectedTab = t;
      this.activeItem = 'client-details';
    });
    this.userSubscription = this.authService.currentUser.subscribe(user => {         // Subscribe to current user changes
      this.currentUser = user;

      if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
      }
    });

    // Subscribe to client admin tab changes
    this.tabSubscription = this.clientAdminTabService.activeTab$.subscribe(tab => {
      this.currentClientAdminTab = tab;
      this.updateSidebarTabs();
    });

    // Subscribe to project selection changes
    this.projectSelectionSubscription = this.projectSelectionService.isProjectSelected$.subscribe(isSelected => {
      this.isProjectSelected = isSelected;
      // Auto-route to summary tab when project is selected for Client Admin
      if (isSelected && this.isClientAdmin && this.currentClientAdminTab === 'projects') {
        const currentUrl = this.router.url;
        const isProjectWorkflowRoute = currentUrl.includes('/ProjectWorkflow');
        const hasProjectFlowTab = currentUrl.includes('pfTab=workflow') || currentUrl.includes('pfTab=insights') || currentUrl.includes('pfTab=alert');

        // Skip auto-redirect to summary when:
        // - a tab click navigation is in progress (e.g., navigating to workflow)
        // - already on a specific ProjectWorkflow tab via pfTab query
        if (!this.isNavigatingFromTabClick && !(isProjectWorkflowRoute && hasProjectFlowTab)) {
          this.setActiveTab('summary');
        }
      }
      // For L1 users, ensure Alerts tab becomes active when a project is selected
      if (isSelected && this.currentUser?.role === 'L1 User') {
        this.clientAdminTabService.setActiveTab('projects');
        this.setActiveTab('alerts');
      }
      // For L2 users, ensure Alerts Dashboard tab becomes active when a project is selected
      if (isSelected && this.currentUser?.role === 'L2 User') {
        this.clientAdminTabService.setActiveTab('projects');
        this.setActiveTab('alertsDashboard');
      }
      if(this.isDataManager && isSelected){
        this.currentDataManagerTab='showDashboard'
        this.activeItem ='dashboard'
        this.setActiveItem('dashboard')
      }
    });

    this.isProjectBack = this.projectSelectionService.isProjectBack$.subscribe(isSelected => {
      if(isSelected){
        this.currentDataManagerTab='home'
        this.activeItem ='home'
        this.setActiveItem('home')
      }
    });


    // Initialize current tab from service
    this.currentClientAdminTab = this.clientAdminTabService.getActiveTab();

    // Subscribe to route changes to update active states
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event fired, URL:', event.url);
        console.log('isNavigatingFromTabClick flag:', this.isNavigatingFromTabClick);
        this.updateActiveStateFromRoute();
      }
    });

    // Initial route detection for client admin
    if (this.isClientAdmin) {
      this.updateActiveStateFromRoute();
    }
    // if (this.currentUser?.role === "Data Manager") {
    //   this.setActiveItem('Dashboard');
    //   this.router.navigate(['/projectsDashboard']);
    //   this.isDataManager = true;
    // }
    if (this.currentUser?.role === "Investigator") {
      this.setActiveItem('ProjectsInvestigator');
      this.router.navigate(['/projectsDashboard']);
      this.isInvestigator = true;
    }
    // if (this.currentUser?.role === "L1 User") {
    //   this.setActiveItem('myAlerts');
    //   this.router.navigateByUrl('/ProjectWorkflow/1?pfTab=alert');
    //   this.isL1User = true;
    // }
     if (this.currentUser?.role === "L1 User") {
     this.isL1User = true;
      this.setActiveItem('client-admin-home');
      this.activeSection = 'l1User';
      this.router.navigate(['/client-admin/home']);
      this.clientAdminTabService.setActiveTab('projects');
    }
    if (this.currentUser?.role === "L2 User") {
      this.isL2User = true;
      this.setActiveItem('client-admin-home');
      this.activeSection = 'l2User';
      this.router.navigate(['/client-admin/home']);
      this.clientAdminTabService.setActiveTab('projects');
    }
    if (this.currentUser?.role === "Project Admin") {
      this.setActiveItem('projects');
      this.router.navigate(['/projects']);
      this.isProjectAdmin = true;
    }
    if (this.currentUser?.role === 'Admin Settings') {
      this.setActiveItem('admin-dashboard');
      this.router.navigate(['/admin-dashboard']);
    }
    if (this.currentUser?.role == "Client Admin") {
      this.isClientAdmin = true;
      this.setActiveItem('client-admin-home');
      this.activeSection = 'clientAdmin';
      this.router.navigate(['/client-admin/home']);
      // Initialize client admin tab service
      this.clientAdminTabService.setActiveTab('projects');
    }
    if (this.currentUser?.role == 'Admin Settings') {
      this.isAdmin = true;
    }
    if (this.currentUser?.role === "Audit & Compliance") {
      this.setActiveItem('projects');
      this.router.navigate(['/projectsDashboard']);
      this.isAudit = true;
    }
    if (this.currentUser?.role == "Guest") {
      this.setActiveItem('Home');
      this.activeSection = 'Guest';
      this.activeItem = 'Home';
      this.router.navigate(['/home']);
      this.isGuest = true;
    }
    if (this.currentUser?.role == "Instance Admin") {
      this.setActiveItem('AllClients');
      this.activeSection = 'InstanceAdmin';
      this.activeItem = 'AllClients';
      this.router.navigate(['allclients']);
      this.isInstanceAdmin = true;
    }
    // if(this.currentUser?.role == "Admin"){
    //   this.isProjectAdmin = true;
    // }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.tabSubscription) {
      this.tabSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.projectSelectionSubscription) {
      this.projectSelectionSubscription.unsubscribe();
    }
    if (this.topBarComponent) {
      this.topBarComponent.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.authService.setSideBarValue(this.isCollapsed);
  }

  toggleSection(section: string): void {
    if (this.isCollapsed) {
      return;
    }
    this.activeSection = this.activeSection === section ? '' : section;
  }


  setActiveItem(item: string, subItem?: string): void {
    this.selectedTab = subItem ?? '';
    this.activeItem = item;
    if (subItem != '' && item == 'client-details') {
      this.selectedTab = subItem ?? '';
      this.navigateSelectTab(this.selectedTab);
    }
    else if (this.isDataManager) {
      this.routeActiveItem(item);
    } else {
      this.id = null;
      switch (item) {
        case 'roles': this.router.navigate(['/roles']); break;
        case 'admin-dashboard': this.router.navigate(['/admin-dashboard']); break;
        case 'organisation-setup': this.router.navigate(['/organisation-setup']); break;
        case 'members': this.router.navigate(['/members']); break;
        case 'documents': this.router.navigate(['/documents']); break;
        case 'questionnaire/list': this.router.navigate(['/questionnaire/list']); break;
        case 'insights': this.router.navigate(['/insight-template']); break;
        case 'admin-projects': this.router.navigate(['/admin-projects']); break;
        case 'archive': this.router.navigate(['/archive']); break;
        case 'billing': this.router.navigate(['/billing']); break;
        case 'account': this.router.navigate(['/account']); break;
        case 'myAlerts':
          // For L1 users, navigate to project workflow with alerts tab
       
        case 'alert-dashboard':
          this.router.navigate(['/alert-dashboard']);
          break;
        // Client Admin navigation items
        case 'client-admin-home': this.router.navigate(['/client-admin/home']); break;
        case 'client-admin-summary': this.router.navigate(['/client-admin/summary']); break;
        case 'questionnaire-builder': this.router.navigate(['/questionnaire/list']); break;
        case 'insights-template': this.router.navigate(['/insight-template']); break;
        case 'users': this.router.navigate(['/members']); break;
        case 'client-admin-configuration': this.router.navigate(['/client-admin/configuration']); break;
        case 'AllClients': this.router.navigate(['/allclients']); break;
      }
    }
    // close overlays when needed
    this.helpComp?.close();
    this.notification?.close();
  }

  getUserInitials(): string {
    if (!this.currentUser) {
      return 'U';
    }
    const firstInitial = this.currentUser.userName?.charAt(0) || '';
    const lastInitial = '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.logout();
  }
  onArchieved() {
    this.router.navigate(['/archive']);
    this.helpComp.close();
    this.notification.close();
  }
  onHelp() {
    this.setActiveItem('help');
    this.helpComp.open();
    this.notification.close();
  }
  toggleNotification() {
    this.setActiveItem('notifications');
    this.notification.isopens();
    this.helpComp.close();
  }
  onbilling() {
    this.router.navigate(['/billing'])
    this.helpComp.close();
    this.notification.close();
  }
  onAccounts() {
    this.router.navigate(['/account'])
    this.helpComp.close();
    this.notification.close();
  }
  toggleOrg() {
    this.showOrgItems = !this.showOrgItems
  }

  setActiveProjectTab(tabId: string): void {
    this.activeProjectTab = tabId;

    // Update active state for all tabs
    this.projectTabs.forEach(tab => {
      tab.isActive = tab.id === tabId;
    });

    // Navigate to the selected tab route
    const selectedTab = this.projectTabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      this.router.navigate([selectedTab.route]);
    }

    // Close overlays when needed
    this.helpComp?.close();
    this.notification?.close();
  }


  setActiveTab(tabId: string): void {
  console.log('setActiveTab called with tabId:', tabId);

  // Select correct tab array based on role + current section
  let currentTabArray: ProjectTab[];

  if (this.currentClientAdminTab === 'organisation') {
    currentTabArray = this.organisationTabs;
  } else {
    // Role-based project tabs
    if (this.currentUser?.role === 'L1 User') {
      currentTabArray = this.L1UserprojectTabs;
    } else if (this.currentUser?.role === 'L2 User') {
      currentTabArray = this.L2UserprojectTabs;
    } else {
      currentTabArray = this.projectTabs; // fallback (Client Admin / default)
    }
  }

  // Find clicked tab
  const clickedTab = currentTabArray.find(tab => tab.id === tabId);
  if (!clickedTab) {
    console.log('Tab not found for tabId:', tabId);
    return;
  }

  console.log('Found tab:', clickedTab);

  // Determine route
  let routeToNavigate = clickedTab.route;

  if (tabId === 'summary' && this.currentClientAdminTab === 'projects' && this.isProjectSelected) {
    const selectedProjectId = this.projectSelectionService.getSelectedProjectId();
    if (selectedProjectId) {
      routeToNavigate = `/ProjectWorkflow/${selectedProjectId}`;
    }
  }

  const currentUrl = this.router.url;

  // Avoid duplicate navigation (workflow setup)
  if (tabId === 'workflow-setup' && currentUrl.includes('pfTab=workflow')) {
    const selectedProjectId = this.projectSelectionService.getSelectedProjectId();
    if (selectedProjectId && currentUrl.includes(`/ProjectWorkflow/${selectedProjectId}?pfTab=workflow`)) {
      console.log('Already on workflow setup tab');
      return;
    }
  }

  // Avoid duplicate navigation (summary)
  if (tabId === 'summary' && this.currentClientAdminTab === 'projects' && this.isProjectSelected) {
    const selectedProjectId = this.projectSelectionService.getSelectedProjectId();
    if (selectedProjectId && currentUrl === `/ProjectWorkflow/${selectedProjectId}`) {
      console.log('Already on summary tab');
      return;
    }
  }

  this.isNavigatingFromTabClick = true;

  // Reset all tab states
  this.organisationTabs.forEach(tab => tab.isActive = false);
  this.projectTabs.forEach(tab => tab.isActive = false);
  this.L1UserprojectTabs.forEach(tab => tab.isActive = false);
  this.L2UserprojectTabs.forEach(tab => tab.isActive = false);

  clickedTab.isActive = true;

  let navigationPromise: Promise<boolean>;

  if (tabId === 'workflow-setup') {
    const selectedProjectId = this.projectSelectionService.getSelectedProjectId() || 1;
    navigationPromise = this.router.navigateByUrl(`/ProjectWorkflow/${selectedProjectId}?pfTab=workflow`);
  } else if (tabId === 'summary' && this.currentClientAdminTab === 'projects' && this.isProjectSelected) {
    const selectedProjectId = this.projectSelectionService.getSelectedProjectId();
    if (selectedProjectId) {
      navigationPromise = this.router.navigateByUrl(`/ProjectWorkflow/${selectedProjectId}`);
    } else {
      navigationPromise = this.router.navigate([routeToNavigate]);
    }
  } else {
    navigationPromise = this.router.navigate([routeToNavigate]);
  }

  navigationPromise.then(success => {
    console.log('Navigation success:', success, 'URL:', this.router.url);
    setTimeout(() => this.isNavigatingFromTabClick = false, 100);
  }).catch(error => {
    console.error('Navigation failed:', error);
    this.isNavigatingFromTabClick = false;
  });

  this.helpComp?.close();
  this.notification?.close();
}


  updateSidebarTabs(): void {
    // Skip if we're navigating from a tab click to prevent double activation
    if (this.isNavigatingFromTabClick) return;

    // Reset active states
    // this.organisationTabs.forEach(tab => tab.isActive = false);
    // this.projectTabs.forEach(tab => tab.isActive = false);

    // Update the current client admin tab based on the service
    this.currentClientAdminTab = this.clientAdminTabService.getActiveTab();

    // Let updateActiveStateFromRoute handle the proper tab activation based on current route
    this.updateActiveStateFromRoute();
  }

  updateActiveStateFromRoute(): void {
    // if (!this.isClientAdmin ) return;

    // Skip if we're navigating from a tab click to prevent double activation
    if (this.isNavigatingFromTabClick) {
      console.log('updateActiveStateFromRoute: Skipping due to isNavigatingFromTabClick flag');
      return;
    }

    const currentUrl = this.router.url;
    console.log('updateActiveStateFromRoute called with URL:', currentUrl);

    // Reset all active states
    // this.organisationTabs.forEach(tab => tab.isActive = false);
    // this.projectTabs.forEach(tab => tab.isActive = false);

    // Check organisation tabs with more flexible matching
    const activeOrgTab = this.organisationTabs.find(tab => {
      // Check if current URL exactly matches the tab route
      if (currentUrl === tab.route) {
        return true;
      }

      // For organisation routes, check if the current URL starts with the tab route
      if (tab.route.includes('/organisation/')) {
        return currentUrl.startsWith(tab.route);
      }

      return false;
    });

    if (activeOrgTab) {
      activeOrgTab.isActive = true;
      // Update the client admin tab service to show organisation as active
      this.clientAdminTabService.setActiveTab('organisation');
      return;
    }

    // Determine which project tab array to use based on role
    let projectTabArray: ProjectTab[] = this.projectTabs;
    if (this.currentUser?.role === 'L1 User') {
      projectTabArray = this.L1UserprojectTabs;
    } else if (this.currentUser?.role === 'L2 User') {
      projectTabArray = this.L2UserprojectTabs;
    }

    // Check project tabs with more flexible matching
    const activeProjectTab = projectTabArray.find(tab => {
      // Check if current URL exactly matches the tab route
      if (currentUrl === tab.route) {
        return true;
      }

      // For project routes, check if the current URL starts with the tab route
      if (tab.route.includes('/projects/')) {
        return currentUrl.startsWith(tab.route);
      }

      // Special handling for /projects route (which redirects to /projects/home)
      if (currentUrl === '/projects' || currentUrl === '/projects/' || currentUrl === '/projects/home') {
        return tab.id === 'home';
      }

      // Handle /projects route without trailing slash
      if (currentUrl === '/projects' && tab.id === 'home') {
        return true;
      }

      // Check for legacy project routes and map them to appropriate tabs
      if (currentUrl.includes('/projectsDashboard')) {
        return tab.id === 'summary';
      }

      if (currentUrl.includes('/ProjectWorkflow') || currentUrl.includes('/projects/workflow')) {
        // If it's a ProjectWorkflow with workflow query param, map to workflow-setup
        if (currentUrl.includes('pfTab=workflow')) {
          return tab.id === 'workflow-setup';
        }
        // If it's a ProjectWorkflow with alert query param, map to alerts
        if (currentUrl.includes('pfTab=alert')) {
          return tab.id === 'alerts';
        }
        // If it's a ProjectWorkflow with insights query param, map to insights
        if (currentUrl.includes('pfTab=insights')) {
          return tab.id === 'insights';
        }
        // Otherwise, map to summary (for Client Admin overview access)
        return tab.id === 'summary';
      }

      if (currentUrl.includes('/admin-projects')) {
        return tab.id === 'summary';
      }

      if (currentUrl.includes('/overview/')) {
        return tab.id === 'summary';
      }

      // Alerts dashboard route (specific) for L2 users
      if (currentUrl.includes('/alert-dashboard')) {
        return tab.id === 'alertsDashboard';
      }

      // Check for legacy insights and alerts routes
      if (currentUrl.includes('/insights') && !currentUrl.includes('/organisation/insights')) {
        return tab.id === 'insights';
      }

      if (currentUrl.includes('/alert') && !currentUrl.includes('/organisation/')) {
        return tab.id === 'alerts';
      }

      // Check for project members and roles routes
      if (currentUrl.includes('/projects/members') || currentUrl.includes('/members') && !currentUrl.includes('/organisation/')) {
        return tab.id === 'users';
      }

      if (currentUrl.includes('/projects/roles') || currentUrl.includes('/roles') && !currentUrl.includes('/organisation/')) {
        return tab.id === 'roles';
      }

      return false;
    });

    if (activeProjectTab) {
      console.log('Route detection found active project tab:', activeProjectTab.id, activeProjectTab.label);

      // First reset all tab states to prevent multiple active tabs
      this.organisationTabs.forEach(tab => tab.isActive = false);
      this.projectTabs.forEach(tab => tab.isActive = false);
      this.L1UserprojectTabs.forEach(tab => tab.isActive = false);
      this.L2UserprojectTabs.forEach(tab => tab.isActive = false);

      // Then set the correct tab as active
      activeProjectTab.isActive = true;
      console.log('Route detection set tab as active:', activeProjectTab.id);

      // Update the client admin tab service to show projects as active
      this.clientAdminTabService.setActiveTab('projects');
      return;
    }

    // If no specific tab matches, set home as active for organisation routes
    if (currentUrl.includes('/organisation')) {
      this.organisationTabs.forEach(tab => tab.isActive = false);
      this.projectTabs.forEach(tab => tab.isActive = false);

      const homeTab = this.organisationTabs.find(tab => tab.id === 'home');
      if (homeTab) {
        homeTab.isActive = true;
      }
      this.clientAdminTabService.setActiveTab('organisation');
      return;
    }

    // If no specific tab matches, set home as active for project routes (but exclude ProjectWorkflow routes)
    if ((currentUrl.includes('/projects') ||
      currentUrl === '/projects' ||
      currentUrl === '/projects/' ||
      currentUrl === '/projects/home' ||
      currentUrl.includes('/projectsDashboard')) &&
      !currentUrl.includes('/ProjectWorkflow')) {

      this.organisationTabs.forEach(tab => tab.isActive = false);
      this.projectTabs.forEach(tab => tab.isActive = false);

      const homeTab = this.projectTabs.find(tab => tab.id === 'home');
      if (homeTab) {
        homeTab.isActive = true;
      }
      // Update the client admin tab service to show projects as active
      this.clientAdminTabService.setActiveTab('projects');
    }
  }
  navigateSelectTab(tabName: string) {
    // Update service
    this.tabState.setTab(tabName);

    // Navigate to same route, updating query param
    this.router.navigate(['/clientdetails', this.id], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'  // preserve other query params
    });
  }

  // Get filtered project tabs based on project selection state
  // getFilteredProjectTabs(): ProjectTab[] {
  //   if (this.currentClientAdminTab === 'projects') {
  //     if (!this.isProjectSelected) {
  //       return this.projectTabs.filter(tab => tab.id === 'home');
  //     }
  //     return this.projectTabs;
  //   }
  //   return this.organisationTabs;
    
    
  // }


getFilteredProjectTabs(): ProjectTab[] {
  if (this.currentClientAdminTab === 'projects') {
    if (!this.isProjectSelected) {
      // Only show Home if no project is selected
      return this.projectTabs.filter(tab => tab.id === 'home');
    }

    if (this.currentUser?.role === 'L1 User') {
      return this.L1UserprojectTabs;
    }
    if (this.currentUser?.role === 'L2 User') {
      return this.L2UserprojectTabs;
    }

    if (this.currentUser?.role === 'Client Admin') {
      return this.projectTabs;
    }

    // Default → other roles see organisation tabs
    return this.organisationTabs;
  }

  // Organisation level  
  if (this.currentUser?.role === 'L1 User') {
    return this.L1userOrganisationTabs;
  }
  if (this.currentUser?.role === 'L2 User') {
    return this.L1userOrganisationTabs;
  }

  if (this.currentUser?.role === 'Client Admin') {
    return this.organisationTabs;
  }

  // Fallback (in case role doesn't match any)
  return [];
}
  
}