import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SafePipe } from '../shared/pipes/safe.pipe';

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

  // Parameters dropdown state and data (updated to match Figma node 436:136211)
  isParameterExpanded = false;
  parameter1Options: Array<{ description: string; quantity: number; unitPrice: string; amount: string }> = [
    { description: 'Laura Thompson', quantity: 1, unitPrice: '5,700 INR', amount: '5,700 INR' },
    { description: 'Brian Scott', quantity: 2, unitPrice: '1,500 INR', amount: '1,500 INR' },
    { description: 'Passenger Name', quantity: 3, unitPrice: '1,100 INR', amount: '1,100 INR' }
  ];

  // Spanish Parameters dropdown data
  spanishParameter1Options: Array<{ description: string; quantity: number; unitPrice: string; amount: string }> = [
    { description: 'Laura Thompson', quantity: 1, unitPrice: '5,700 INR', amount: '5,700 INR' },
    { description: 'Brian Scott', quantity: 2, unitPrice: '1,500 INR', amount: '1,500 INR' },
    { description: 'Nombre del Pasajero', quantity: 3, unitPrice: '1,100 INR', amount: '1,100 INR' }
  ];

  // Inline edit state for Description column
  editingDescriptionIndex: number | null = null;
  editedDescription: string = '';
  highlightedFlightIndex: number | null = null;
  
  // OCR Analysis Data - Updated to match Figma design exactly
  basicInfo = {
    invoicenumber: { confidence: 90, value: 'INV-FLT-0325', status: 'success' },
    invoicedate: { confidence: 90, value: '31 Mar 2025', status: 'success' },
    companyname: { confidence: 51, value: 'Global Wings Travel Solutions', status: 'error' },
    customer: { confidence: 0, value: 'YUJ Designs Pvt. Ltd.', status: 'loading' },
    gstin: { confidence: 20, value: '', status: 'error' }
  };

  // Spanish OCR Analysis Data for Original Document Tab
  spanishBasicInfo = {
    invoicenumber: { confidence: 90, value: 'FAC-VUELO-0325', status: 'success' },
    invoicedate: { confidence: 90, value: '31 Mar 2025', status: 'success' },
    companyname: { confidence: 51, value: 'Soluciones de Viaje Alas Globales', status: 'error' },
    customer: { confidence: 0, value: 'YUJ Diseños Pvt. Ltd.', status: 'loading' },
    gstin: { confidence: 20, value: '', status: 'error' }
  };

  // Flight booking details
  flightDetails = [
    {
      sno: 1,
      passengerName: 'Laura Thompson',
      airline: 'Indigo',
      ticketNumber: '0987654321234',
      travelDate: '10 Mar 25',
      from: 'Pune',
      to: 'Delhi',
      fare: 4500,
      taxes: 1200
    },
    {
      sno: 2,
      passengerName: 'Brian Scott',
      airline: 'Vistara',
      ticketNumber: '1234567890123',
      travelDate: '15 Mar 25',
      from: 'Mumbai',
      to: 'Bengaluru',
      fare: 5000,
      taxes: 1500
    },
    {
      sno: 3,
      passengerName: 'Passenger Name',
      airline: 'Air India',
      ticketNumber: '9876543210456',
      travelDate: '20 Mar 25',
      from: 'Delhi',
      to: 'Hyderbad',
      fare: 4200,
      taxes: 1100
    }
  ];

  // Spanish Flight booking details
  spanishFlightDetails = [
    {
      sno: 1,
      passengerName: 'Laura Thompson',
      airline: 'Indigo',
      ticketNumber: '0987654321234',
      travelDate: '10 Mar 25',
      from: 'Pune',
      to: 'Delhi',
      fare: 4500,
      taxes: 1200
    },
    {
      sno: 2,
      passengerName: 'Brian Scott',
      airline: 'Vistara',
      ticketNumber: '1234567890123',
      travelDate: '15 Mar 25',
      from: 'Mumbai',
      to: 'Bengaluru',
      fare: 5000,
      taxes: 1500
    },
    {
      sno: 3,
      passengerName: 'Nombre del Pasajero',
      airline: 'Air India',
      ticketNumber: '9876543210456',
      travelDate: '20 Mar 25',
      from: 'Delhi',
      to: 'Hyderbad',
      fare: 4200,
      taxes: 1100
    }
  ];

  // Invoice summary
  invoiceSummary = {
    subtotal: 13700,
    totalTaxes: 3800,
    grandTotal: 17500,
    amountInWords: 'Seventeen Thousand Five Hundred Rupees Only',
    paymentTerms: 'Net 15 Days',
    bankDetails: 'Global Wings Travel Solutions\nICICI Bank, A/C No: 123456789012\nIFSC: ICIC0000123'
  };

  // Spanish Invoice summary
  spanishInvoiceSummary = {
    subtotal: 13700,
    totalTaxes: 3800,
    grandTotal: 17500,
    amountInWords: 'Diecisiete Mil Quinientos Rupias Solamente',
    paymentTerms: 'Neto 15 Días',
    bankDetails: 'Soluciones de Viaje Alas Globales\nICICI Bank, Cuenta No: 123456789012\nIFSC: ICIC0000123'
  };

  // Document information
  documentInfo = {
    fileName: 'Flight_Invoice_March2025.pdf',
    documentType: 'OCR Document'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get any parameters passed from the transaction alert component
    this.route.queryParams.subscribe(params => {
      if (params['transactionId']) {
        // Handle transaction ID if needed
        console.log('Transaction ID:', params['transactionId']);
      }
      if (params['documentName']) {
        // Update document info with the actual document name
        this.documentInfo.fileName = params['documentName'];
      }
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
    // Only highlight when explicitly selected (not on hover)
    return this.selectedFieldKey === fieldKey;
  }

  private scrollFieldIntoView(fieldKey: string): void {
    const elementId = `doc-${fieldKey}`;
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
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
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'loading':
        return '⟳';
      default:
        return '';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'error':
        return 'bi bi-x-circle-fill';
      case 'loading':
        return 'bi bi-arrow-clockwise';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success':
        return '#01912a';
      case 'error':
        return '#b20000';
      case 'loading':
        return '#e5aa25';
      default:
        return '#65717d';
    }
  }

  addHeader(): void {
    // Implementation for adding header
    console.log('Add header clicked');
  }

  addParameter(): void {
    // Implementation for adding parameter
    console.log('Add parameter clicked');
  }

  isActionsVisible(fieldKey: string): boolean {
    return this.selectedFieldKey === fieldKey || this.hoverFieldKey === fieldKey;
  }

  verifyField(fieldKey: string): void {
    const currentInfo = this.getCurrentBasicInfo();
    if (currentInfo[fieldKey as keyof typeof currentInfo]) {
      currentInfo[fieldKey as keyof typeof currentInfo].status = 'success';
    }
  }

  rejectField(fieldKey: string): void {
    const currentInfo = this.getCurrentBasicInfo();
    if (currentInfo[fieldKey as keyof typeof currentInfo]) {
      currentInfo[fieldKey as keyof typeof currentInfo].status = 'error';
    }
  }

  editField(fieldKey: string): void {
    // Toggle edit on same field; when turning off, also clear highlight/selection
    if (this.editingFieldKey === fieldKey) {
      this.editingFieldKey = null;
      if (this.selectedFieldKey === fieldKey) {
        this.selectedFieldKey = null;
      }
    } else {
      this.editingFieldKey = fieldKey;
      this.selectField(fieldKey);
    }
    console.log('Edit toggle for field:', fieldKey, 'active:', this.editingFieldKey === fieldKey);
  }

  // Parameter 1 interactions
  toggleParameter(): void {
    this.isParameterExpanded = !this.isParameterExpanded;
  }

  startEditDescription(index: number): void {
    this.editingDescriptionIndex = index;
    const currentOptions = this.getCurrentParameterOptions();
    this.editedDescription = currentOptions[index].description;
    this.highlightedFlightIndex = index;
  }

  confirmEditDescription(index: number): void {
    const trimmed = this.editedDescription.trim();
    if (trimmed.length > 0) {
      const currentOptions = this.getCurrentParameterOptions();
      const currentFlights = this.getCurrentFlightDetails();
      
      currentOptions[index].description = trimmed;
      // Keep flight booking table in sync and highlight updated row
      if (currentFlights[index]) {
        currentFlights[index].passengerName = trimmed;
        this.highlightedFlightIndex = index;
      }
    }
    this.cancelEditDescription();
  }

  cancelEditDescription(): void {
    this.editingDescriptionIndex = null;
    this.editedDescription = '';
  }

  // Helper methods to get appropriate data based on active tab
  getCurrentBasicInfo() {
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
}
