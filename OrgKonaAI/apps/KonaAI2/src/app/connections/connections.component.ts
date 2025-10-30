  import { CommonModule } from '@angular/common';
  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
  import { AuthService } from '../auth/auth.service';
  import { TopBarComponent } from '../TopBar/top-bar.component';
  NgModel

  @Component({
    selector: 'app-connections',
    imports: [CommonModule,FormsModule,ReactiveFormsModule,TopBarComponent],
    templateUrl: './connections.component.html',
    styleUrl: './connections.component.scss'
  })
  export class ConnectionsComponent {
  connections = [
      { provider: 'Oracle', name: 'Oracle_GL_Reports', createdBy: 'User1', createdAt: new Date(), testStatus: 'Success' },
      { provider: 'Salesforce', name: 'SF_CustomerData', createdBy: 'User2', createdAt: new Date(), testStatus: 'Failed' },
      { provider: 'Workday', name: 'Workday_Employee', createdBy: 'User3', createdAt: new Date(), testStatus: 'Success' }
    ];

  providers = [
    { name: 'SAP', icon: 'https://cdn.simpleicons.org/sap/0FAAFF' },
    { name: 'Oracle', icon: 'https://cdn.simpleicons.org/oracle/F80000' },
    { name: 'Salesforce', icon: 'https://cdn.simpleicons.org/salesforce/00A1E0' },
    { name: 'Workday', icon: 'https://cdn.simpleicons.org/workday/FF6F00' },
    { name: 'MuleSoft', icon: 'https://cdn.simpleicons.org/mulesoft/0073E6' },
    { name: 'Azure', icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4' }
  ];


    sapForm!: FormGroup;
    isModalOpen = false;
    isSapModalOpen = false;
    searchQuery: any;
    isDataManager: boolean= false;
    currentRole:any;
    activateTab: string ='projects';
    constructor(private fb: FormBuilder,public authService :AuthService) {}

    ngOnInit(): void {
      this.sapForm = this.fb.group({
        connectionName: ['', Validators.required],
        sapHost: ['', Validators.required],
        sapPort: ['', Validators.required],
        sapClient: ['', Validators.required],
        sapUser: ['', Validators.required],
        sapPassword: ['', Validators.required]
      });
      this.currentRole = this.authService.currentUserValue;
      this.isDataManager = this.currentRole.role === 'Data Manager';
      if (this.isDataManager) {
        this.activateTab = 'organisation';
      }else{
        this.isDataManager = false;
      }

    }

  openNewConnectionModal() {
      this.isModalOpen = true;
    }

    closeModal() {
      this.isModalOpen = false;
    }

    selectProvider(provider: any) {
      if (provider.name === 'SAP') {
        this.isModalOpen = false;
        this.isSapModalOpen = true;
      }
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
    closeSapModal() {
      this.isSapModalOpen = false;
    }

  createSapConnection() {
    if (this.sapForm.valid) {
      const newConnection = {
        provider: 'SAP',
        name: this.sapForm.value.connectionName,
        createdBy: 'CurrentUser', // You can replace with actual logged-in user
        createdAt: new Date(),
        testStatus: 'Pending'
      };

      this.connections.push(newConnection); // Add to list
      console.log('New SAP Connection', newConnection);

      this.sapForm.reset();
      this.isSapModalOpen = false;
    }
  }
  onSearchChange(): void {
      // Handle search functionality
      console.log('Search query:', this.searchQuery);
    }



  }

