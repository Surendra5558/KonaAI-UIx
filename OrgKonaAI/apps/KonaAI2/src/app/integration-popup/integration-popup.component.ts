import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-integration-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './integration-popup.component.html',
  styleUrls: ['./integration-popup.component.scss']
})
export class IntegrationPopupComponent {
  dataForm: FormGroup;
  connectors = ['SAP', 'Oracle', 'Salesforce', 'Workday', 'Hubspot', 'Asana'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IntegrationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      connectorName: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

    // Set dialog configuration for no scroll
    this.dialogRef.updateSize('auto', 'auto');
    this.dialogRef.addPanelClass('compact-dialog');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onPullData(): void {
    if (this.dataForm.valid) {
      const formData = {
        ...this.dataForm.value,
        fromDate: this.formatDate(this.dataForm.value.fromDate),
        toDate: this.formatDate(this.dataForm.value.toDate)
      };
      this.dialogRef.close(formData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.dataForm.controls).forEach(key => {
        this.dataForm.get(key)?.markAsTouched();
      });
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
}