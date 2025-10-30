import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { SidebarComponent } from './page-layout-elements/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { LoaderComponent } from './loader/loader.component';
import { SHARED_PROVIDERS } from './shared/shared-imports';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, LoaderComponent],
    providers: [...SHARED_PROVIDERS],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'konaAINew';
  private userSubscription: Subscription = new Subscription();
  
  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      // Component will automatically re-render based on isUserLoggedIn()
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isSidebarCollapsed(): boolean {
    return this.sidebarComponent?.isCollapsed || false;
  }
}