import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-billing',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  isEditing = false;
  showPaymentModal = false;
  selectedRow: any;
  cardForm: FormGroup;
  card = {
    last4: '1234',
    expiry: '05/26'
  };
  editForm !: FormGroup;


  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      name: [''],
      number: [''],
      cvv: [''],
      expiry: [''],
      address: [''],
      state: [''],
      country: ['US'],
    });

  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.cardForm.patchValue({
        number: `**** **** **** ${this.card.last4}`,
        expiry: this.card.expiry
      });
    }
  }

  saveCard() {
    if (this.cardForm.valid) {
      const { number, expiry } = this.cardForm.value;
      this.card = {
        last4: number.slice(-4),
        expiry
      };
      this.isEditing = false;
    }
  }

  invoices = [
    { number: 'INV-2021005', amount: '$8,500.00', type: 'Additional Users', status: 'Accepted', date: '1 Jan 2024' },
    { number: 'INV-2022004', amount: '$10,000.00', type: 'Subscription', status: 'Completed', date: '1 Jan 2024' },
    { number: 'INV-2023003', amount: '$9,500.00', type: 'Subscription', status: 'Completed', date: '1 Jan 2024' },
    { number: 'INV-2024002', amount: '$8,500.00', type: 'Additional Users', status: 'Accepted', date: '1 Jan 2024' },
    { number: 'INV-2025001', amount: '$8,500.00', type: 'Subscription', status: 'Completed', date: '1 Jan 2024' }
  ];
  openPaymentModal() {
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }
}