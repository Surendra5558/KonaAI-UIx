import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';


export interface Client {
  clientId: number;
  name: string;
  domain: string;
  modules: string[];
  licenseStatus: 'Active' | 'Expired' | 'Expiring Soon';
  projects: number;
  users: number;

   createdBy: string;
  createdOn: string; 
  riskAreas: string[];
  sla: string;
}


export interface Project {
   projectid: number;
  name: string;
  title: string;
  owner: string;
  audit: string;
  risk: string;
  riskArea: string;
  modules: string;
  range: string;
  status: string;
  country: string;
  businessUnit: string;
  businessDevelopment: string;
  scope: string;

  startDateDisplay?: string;
  endDateString?: string;
}
export interface Projects{
  id : number;
  name: string;
  description: string;
  ownerName: string;
  auditResponsibilityName: string;
  riskAreaName: string;
  modules: string;
  endDate: string;
  status: string;
  countryName: string;
  businessUnitName: string;
  businessDepartmentName: string;
  scope: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  private jsonUrl = 'assets/repository/project_details_folder/project_details.json';

    private ClientjsonUrl = 'assets/repository/client_details_folder/client_details.json';


  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.jsonUrl);
  }

 getclients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.ClientjsonUrl);
  }

getProjectById(id: number): Observable<Project | null> {
  return this.http.get<Project[]>(this.jsonUrl).pipe(
    map(projects => {
      const project = projects.find(p => p.projectid === id); // Note: projectid (lowercase d)
      return project ? project : null;
    })
  );
}

  addProject(newProject: any): void {
    this.getProjects().subscribe((existingProjects) => {
      const updatedProjects = [...existingProjects, newProject];
      const blob = new Blob([JSON.stringify(updatedProjects, null, 2)], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.jsonUrl;
      link.click();

      URL.revokeObjectURL(link.href);
    });
  }
}
