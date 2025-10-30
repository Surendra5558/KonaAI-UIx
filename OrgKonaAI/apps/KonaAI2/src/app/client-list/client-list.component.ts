import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProjectServiceService } from '../project-service.service';
import { CreateClientComponent } from '../create-client/create-client.component';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS, SHARED_PROVIDERS } from '../shared/shared-imports';
import { TabStateService } from '../tab-switcher.service';
import { ClientAdminTabService } from '../page-layout-elements/client-admin-layout/client-admin-tab.service';
import { ProjectSelectionService } from '../page-layout-elements/client-admin-layout/project-selection.service';

interface Client {
  clientId: number;
  name: string;
  domain: string;
  modules: string[];
  licenseStatus: 'Active' | 'Expired' | 'Expiring Soon';
  projects: number;
  users: number;
}

@Component({
  selector: 'app-client-list',
  imports: [...SHARED_IMPORTS],
  providers: [SHARED_PROVIDERS],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
 isEditVisible = false;
  clients: Client[] = [];
  viewMode: 'grid' | 'list' = 'list';
  floatingMenuVisible = false;
  floatingMenuPosition = { top: 0, left: 0 };
  selectedClient: Client | null = null;
  activeTab: string = 'organisation';
  isProjectsDisabled: boolean = true;
  constructor(private router: Router, private http: HttpClient,  private clientAdminTabService: ClientAdminTabService,
    private projectSelectionService: ProjectSelectionService,
    private projectService: ProjectServiceService, private dialog: MatDialog, private tabService: TabStateService) {}

  ngOnInit(): void {
    this.loadClients();
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Expired': return 'status-expired';
      case 'Expiring Soon': return 'status-warning';
      default: return '';
    }
  }
  openClientModal() {
     const dialogRef = this.dialog.open(CreateClientComponent, {
        maxWidth: '70vw',
        width: '100%',
        height: '538px',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Project saved:', result);
        }
      });
    console.log('Add project button clicked');
  }
  closeModal() {


  }

selectTab(tab: string) {
    this.activeTab = tab;
    this.clientAdminTabService.setActiveTab(tab);
    
    // Navigate to the appropriate route based on selected tab
    if (tab === 'organisation') {
      // Clear project selection when switching to organisation
      this.projectSelectionService.clearProjectSelection();
      //this.router.navigate(['/organisation']);
    } else if (tab === 'projects') {
      return
      // Clear project selection when switching to projects tab (will be set again when specific project is selected)
      //this.projectSelectionService.clearProjectSelection();
      // Navigate to the first tab of projects menu (Home)
      //this.router.navigate(['/projects/home']);
    }
  }

  loadClients(): void {
     this.projectService.getclients().subscribe({
      next: (data: any) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error loading clients:', err);}
     });
  }

  goToClientSummary(clientId: any) {
    //this.tabService.setClientId(clientId);
    this.router.navigate(['/clientdetails', clientId]);
    //this.tabService.setClientId(clientId);
  }


  openFloatingMenu(event: MouseEvent, client: Client) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.floatingMenuPosition = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX - 130
    };

    this.floatingMenuVisible = true;
    this.selectedClient = client;
  }

  closeFloatingMenu() {
    this.floatingMenuVisible = false;
  }

  

  get filteredClients(): Client[] {
    return this.clients; // later add search/filter if needed
  }



  
  

  viewDetails() {
    this.closeFloatingMenu();
    if (this.selectedClient) {
      this.router.navigate(['/client', this.selectedClient.clientId]);
    }
  }

  editClient() {
    this.closeFloatingMenu();
    console.log('Edit client:', this.selectedClient);
  }

  deleteClient() {
    this.closeFloatingMenu();
    console.log('Delete client:', this.selectedClient);
}
// gotoClientSummary(client: any) {
//   console.log(client);
// }
}
