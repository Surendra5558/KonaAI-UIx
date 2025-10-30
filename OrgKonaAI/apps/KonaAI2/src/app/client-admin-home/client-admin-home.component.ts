import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDashboardComponent } from '../ProjectDashboard/projectDashboard.component';
import { ClientDetailsComponent } from '../client-details/client-details.component';




@Component({
  selector: 'app-client-admin-home',
  standalone: true,
  imports: [CommonModule, ProjectDashboardComponent,ClientDetailsComponent],
  templateUrl: './client-admin-home.component.html',
  styleUrls: ['./client-admin-home.component.scss']
})
export class ClientAdminHomeComponent {

  constructor() { }

  activeTab: string = 'projects'; 


}