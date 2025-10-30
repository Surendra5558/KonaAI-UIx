import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  currentRole: any;
  @Output() tabChanged = new EventEmitter<string>();
  @Input() activeTab: string = 'organisation';
  isInstanceAdmin: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute, private authService: AuthService
  ) { }
  isDataManager: boolean = false;
  ngOnInit(): void {
    this.currentRole = this.authService.currentUserValue;
    this.isDataManager = this.currentRole.role === 'Data Manager';
    this.isInstanceAdmin = this.currentRole.role === 'Instance Admin';
    if (this.isInstanceAdmin) {
      this.activeTab = 'organisation';
    }
  }
  selectTab(value: string) {
    console.log(value);
    this.activeTab = value;
    this.tabChanged.emit(value);
    if (value === 'organisation' && this.isInstanceAdmin) {
      this.router.navigate(['/allclients']);
    }
  }

}
