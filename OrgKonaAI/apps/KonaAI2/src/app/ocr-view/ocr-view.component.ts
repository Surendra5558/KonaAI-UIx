import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SafePipe } from '../shared/pipes/safe.pipe';

// Interfaces for dynamic fields
interface InfoField {
  confidence: number;
  value: string;
  status: string;
}

interface InfoGroup {
  [key: string]: InfoField;
}

@Component({
  selector: 'app-ocr-view',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './ocr-view.component.html',
  styleUrls: ['./ocr-view.component.scss']
})
export class OcrViewComponent implements OnInit {
  activeTab: 'original' | 'translated' = 'original';
  currentPage = 1;
  totalPages = 3;
  selectedFieldKey: string | null = null;
  hoverFieldKey: string | null = null;
  editingFieldKey: string | null = null;

  tempEditedValue: string = '';
  isParameterExpanded = false;

  parameter1Options: Array<{ description: string; quantity: number; unitPrice: string; amount: string }> = [
    { description: 'Laura Thompson', quantity: 1, unitPrice: '5,700 INR', amount: '5,700 INR' },
    { description: 'Brian Scott', quantity: 2, unitPrice: '1,500 INR', amount: '1,500 INR' },
    { description: 'Passenger Name', quantity: 3, unitPrice: '1,100 INR', amount: '1,100 INR' }
  ];

  spanishParameter1Options = [
    { description: 'Laura Thompson', quantity: 1, unitPrice: '5,700 INR', amount: '5,700 INR' },
    { description: 'Brian Scott', quantity: 2, unitPrice: '1,500 INR', amount: '1,500 INR' },
    { description: 'Nombre del Pasajero', quantity: 3, unitPrice: '1,100 INR', amount: '1,100 INR' }
  ];

  editingDescriptionIndex: number | null = null;
  editedDescription: string = '';
  highlightedFlightIndex: number | null = null;

  // Type-safe InfoGroups
  basicInfo: InfoGroup = {
    invoicenumber: { confidence: 90, value: 'INV-FLT-0325', status: 'success' },
    invoicedate: { confidence: 90, value: '31 Mar 2025', status: 'success' },
    companyname: {
      confidence: 51,
      value: 'Global Wings Travel Solutions, 21st Floor, Skyview Tower, Business Bay, Dubai, U.A.E',
      status: 'error'
    },
    customer: { confidence: 0, value: 'YUJ Designs Pvt. Ltd., Pune, Maharashtra, India', status: 'loading' },
    gstin: { confidence: 20, value: '27AAACY1234QIZM', status: 'error' }
  };

  spanishBasicInfo: InfoGroup = {
    invoicenumber: { confidence: 90, value: 'FAC-VUELO-0325', status: 'success' },
    invoicedate: { confidence: 90, value: '31 Mar 2025', status: 'success' },
    companyname: {
      confidence: 51,
      value: 'Soluciones de Viaje Alas Globales, Piso 21, Torre Skyview, Business Bay, Dubai, E.A.U',
      status: 'error'
    },
    customer: { confidence: 0, value: 'YUJ Diseños Pvt. Ltd., Pune, Maharashtra, India', status: 'loading' },
    gstin: { confidence: 20, value: '27AAACY1234QIZM', status: 'error' }
  };

  flightDetails = [
    { sno: 1, passengerName: 'Laura Thompson', airline: 'Indigo', ticketNumber: '0987654321234', travelDate: '10 Mar 25', from: 'Pune', to: 'Delhi', fare: 4500, taxes: 1200 },
    { sno: 2, passengerName: 'Brian Scott', airline: 'Vistara', ticketNumber: '1234567890123', travelDate: '15 Mar 25', from: 'Mumbai', to: 'Bengaluru', fare: 5000, taxes: 1500 },
    { sno: 3, passengerName: 'Passenger Name', airline: 'Air India', ticketNumber: '9876543210456', travelDate: '20 Mar 25', from: 'Delhi', to: 'Hyderbad', fare: 4200, taxes: 1100 }
  ];

  spanishFlightDetails = [
    { sno: 1, passengerName: 'Laura Thompson', airline: 'Indigo', ticketNumber: '0987654321234', travelDate: '10 Mar 25', from: 'Pune', to: 'Delhi', fare: 4500, taxes: 1200 },
    { sno: 2, passengerName: 'Brian Scott', airline: 'Vistara', ticketNumber: '1234567890123', travelDate: '15 Mar 25', from: 'Mumbai', to: 'Bengaluru', fare: 5000, taxes: 1500 },
    { sno: 3, passengerName: 'Nombre del Pasajero', airline: 'Air India', ticketNumber: '9876543210456', travelDate: '20 Mar 25', from: 'Delhi', to: 'Hyderbad', fare: 4200, taxes: 1100 }
  ];

  invoiceSummary = {
    subtotal: 13700,
    totalTaxes: 3800,
    grandTotal: 17500,
    amountInWords: 'Seventeen Thousand Five Hundred Rupees Only',
    paymentTerms: 'Net 15 Days',
    bankDetails: 'Global Wings Travel Solutions\nICICI Bank, A/C No: 123456789012\nIFSC: ICIC0000123'
  };

  spanishInvoiceSummary = {
    subtotal: 13700,
    totalTaxes: 3800,
    grandTotal: 17500,
    amountInWords: 'Diecisiete Mil Quinientos Rupias Solamente',
    paymentTerms: 'Neto 15 Días',
    bankDetails: 'Soluciones de Viaje Alas Globales\nICICI Bank, Cuenta No: 123456789012\nIFSC: ICIC0000123'
  };

  documentInfo = {
    fileName: 'Flight_Invoice_March2025.pdf',
    documentType: 'OCR Document'
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['transactionId']) console.log('Transaction ID:', params['transactionId']);
      if (params['documentName']) this.documentInfo.fileName = params['documentName'];
    });
  }

  setActiveTab(tab: 'original' | 'translated'): void {
    this.activeTab = tab;
  }

  selectField(fieldKey: string): void {
    this.selectedFieldKey = fieldKey;
    this.scrollFieldIntoView(fieldKey);
  }

  isFieldHighlighted(fieldKey: string): boolean {
    return this.selectedFieldKey === fieldKey || this.editingFieldKey === fieldKey;
  }

  private scrollFieldIntoView(fieldKey: string): void {
    const el = document.getElementById(`doc-${fieldKey}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goBack(): void {
    this.router.navigate(['/alert/details/transaction']);
  }

  downloadDocument(): void {
    const link = document.createElement('a');
    link.href = '/assets/repository/project_details_folder/project_details.json';
    link.download = this.documentInfo.fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'loading': return '⟳';
      default: return '';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'success': return 'bi bi-check-circle';
      case 'error': return 'bi bi-x-circle';
      case 'loading': return 'bi bi-arrow-clockwise';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success': return '#01912a';
      case 'error': return '#b20000';
      case 'loading': return '#e5aa25';
      default: return '#65717d';
    }
  }

  addHeader(): void {
    const key = `custom_${Date.now()}`;
    const info = this.getCurrentBasicInfo();
    info[key] = { confidence: 0, value: 'New Header', status: 'loading' };
    this.editField(key);
  }

  addParameter(): void {
    console.log('Add parameter clicked');
  }

  isActionsVisible(fieldKey: string): boolean {
    return this.selectedFieldKey === fieldKey || this.hoverFieldKey === fieldKey;
  }

  verifyField(fieldKey: string): void {
    const info = this.getCurrentBasicInfo();
    if (info[fieldKey]) info[fieldKey].status = 'success';
  }

  rejectField(fieldKey: string): void {
    const info = this.getCurrentBasicInfo();
    if (info[fieldKey]) {
      delete info[fieldKey];
      if (this.selectedFieldKey === fieldKey) this.selectedFieldKey = null;
      if (this.editingFieldKey === fieldKey) this.cancelEditField();
    }
  }

  editField(fieldKey: string): void {
    const info = this.getCurrentBasicInfo();
    if (this.editingFieldKey === fieldKey) return this.cancelEditField();
    if (!info[fieldKey]) info[fieldKey] = { confidence: 0, value: '', status: 'loading' };
    this.editingFieldKey = fieldKey;
    this.tempEditedValue = info[fieldKey].value || '';
    this.selectField(fieldKey);
  }

  confirmEditField(fieldKey: string): void {
    const info = this.getCurrentBasicInfo();
    if (info[fieldKey]) {
      info[fieldKey].value = this.tempEditedValue.trim();
      info[fieldKey].status = 'success';
    }
    this.editingFieldKey = null;
    this.tempEditedValue = '';
  }

  cancelEditField(): void {
    this.editingFieldKey = null;
    this.tempEditedValue = '';
  }

  toggleParameter(): void {
    this.isParameterExpanded = !this.isParameterExpanded;
  }

  startEditDescription(index: number): void {
    this.editingDescriptionIndex = index;
    this.editedDescription = this.getCurrentParameterOptions()[index].description;
    this.highlightedFlightIndex = index;
  }

  confirmEditDescription(index: number): void {
    const trimmed = this.editedDescription.trim();
    if (trimmed.length > 0) {
      this.getCurrentParameterOptions()[index].description = trimmed;
      if (this.getCurrentFlightDetails()[index]) {
        this.getCurrentFlightDetails()[index].passengerName = trimmed;
        this.highlightedFlightIndex = index;
      }
    }
    this.cancelEditDescription();
  }

  cancelEditDescription(): void {
    this.editingDescriptionIndex = null;
    this.editedDescription = '';
  }

  getCurrentBasicInfo(): InfoGroup {
    return this.activeTab === 'original' ? this.spanishBasicInfo : this.basicInfo;
  }

  getCurrentFlightDetails() {
    return this.activeTab === 'original' ? this.spanishFlightDetails : this.flightDetails;
  }

  getCurrentInvoiceSummary() {
    return this.activeTab === 'original' ? this.spanishInvoiceSummary : this.invoiceSummary;
  }

  getCurrentParameterOptions() {
    return this.activeTab === 'original' ? this.spanishParameter1Options : this.parameter1Options;
  }

  deleteDocument(): void {
    console.log('Delete document clicked');
  }
}
