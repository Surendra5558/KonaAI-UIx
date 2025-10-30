import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-list',
  imports: [CommonModule],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
})
export class ProjectsList {
  private router = inject(Router);
  onAdminClick() {
    this.router.navigate(['admin/users']);
  }
}
