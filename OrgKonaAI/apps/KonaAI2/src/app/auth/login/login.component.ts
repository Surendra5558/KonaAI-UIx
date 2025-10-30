import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MsalService } from '@azure/msal-angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LoaderService } from '../../loader.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, CommonModule, RouterLink, TranslocoModule],
    providers: [MsalService, TranslocoService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  availableLangs = ['en', 'de', 'es', 'ja'];
  activeLangugae = 'English';
  currentLanguage = 'en';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  loginForm = {
    email: 'kkona@konaai.com',
    password: 'Testing@12345'
  };

  constructor(private authService: AuthService, private router: Router, private msal: MsalService, public translate: TranslocoService, public loader: LoaderService) {
    this.translate.setDefaultLang('en');
    //this.loader.show();
      //this.translate.use('en');
    this.translate.setAvailableLangs(this.availableLangs);
  }

  ngOnInit(): void {
    this.msal.instance.initialize();
    // If user is already logged in, redirect to projects
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/projects']);
    }
    
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loader.show();
    if (this.loginForm.email && this.loginForm.password) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authenticateUser();
    } else {
      this.errorMessage = 'Please fill in all fields';
      console.log('Please fill in all fields');
    }
  }

  private authenticateUser(): void {
    this.authService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          console.log('Login successful:', user);
          this.loader.hide();
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.isLoading = false;
           this.loader.hide();
          this.errorMessage = error.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): any {
    return this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
  }
  switchLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement?.value;
    this.currentLanguage = lang;
    this.translate.setActiveLang(lang);
    if (lang == 'en') {
      this.activeLangugae = 'English'
    } else if (lang == 'es') {
      this.activeLangugae = 'Spanish'
    } else if (lang == 'de') {
      this.activeLangugae = 'German'
    } else if (lang == 'ja') {
      this.activeLangugae = 'Japanese'
    }
  }
}