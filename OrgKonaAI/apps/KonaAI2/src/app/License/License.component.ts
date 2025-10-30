import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastNotificationComponent } from '../Toast-Notification/Toast-Notification.Component';




interface LicenseInfo {
  status: 'Active' | 'Expired' | 'Expiring Soon';
  startDate: string;
  endDate: string;
  terms: string;
  isExpired: boolean;
  expirationMessage?: string;
}

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastNotificationComponent],
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent {
    showToast: boolean = true;
  toastTimeout: any;


    ngOnInit() {
    this.showToast = true;
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  licenseInfo: LicenseInfo = {
    status: 'Expired',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    terms: 'Standard Annual License',
    isExpired: true,
    expirationMessage: "This client's license has expired. Access to platform features may be restricted. Please renew the license to restore full functionality."
  };


  onRenewLicense() {
    console.log('Renewing license...');
   
  }

  getStatusClass(): string {
    switch (this.licenseInfo.status) {
      case 'Active':
        return 'status-active';
      case 'Expired':
        return 'status-expired';
      case 'Expiring Soon':
        return 'status-expiring';
      default:
        return 'status-expired';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

    closeToast() {
        this.showToast = false;
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
    }
}