import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-accounts',
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  profileImage: string | null = null;
  uploadState: 'initial' | 'uploading' | 'done' = 'initial';
  showPasswordPopup = false;
  showDeletePopup = false;
  newPassword = '';
  confirmPassword = '';
  deleteConfirm = '';

  form = {
    name: 'John Doe',
    countryCode: '+91',
    phone: '7588322988',
    language: 'English',
    email: 'john.doe@example.com',
  };
  
  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.form.name = `${user.firstName} ${user.lastName}`;
      this.form.email = user.email;
    }
  }

  changePassword() {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      alert('Password changed successfully.');
      this.showPasswordPopup = false;
    } else {
      alert('Passwords do not match.');
    }
  }

  confirmDelete() {
    if (this.deleteConfirm === 'delete my account') {
      alert('Account deleted.');
      this.showDeletePopup = false;
    } else {
      alert('Incorrect confirmation phrase.');
    }
  }


  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      this.uploadState = 'uploading';

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;

        // Simulate a short delay for upload
        setTimeout(() => {
          this.uploadState = 'done';
        }, 1000); 
      };
      reader.readAsDataURL(file);
    }
  }

  openChangePasswordPopup() {
    this.showPasswordPopup = true;
  }


  openDeletePopup() {
    this.deleteConfirm = this.form.name;
    this.showDeletePopup = true;
  }

}
