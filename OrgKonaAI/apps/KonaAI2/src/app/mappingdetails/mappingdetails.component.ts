import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-mappingdetails',
  imports: [TitleCasePipe, CommonModule],
  templateUrl: './mappingdetails.component.html',
  styleUrl: './mappingdetails.component.scss'
})
export class MappingdetailsComponent implements AfterViewInit { // Implement AfterViewInit
  
  // Reference the SVG element in the HTML
  @ViewChild('mappingLinesOverlay') svgElementRef!: ElementRef<SVGElement>;

  @Output() backtoIntial = new EventEmitter<any>();
  submodule: string = '';
  recordCount = 0;
  excludeCount = 0;
  sourceColumns: string[] = [];
  targetColumns: string[] = [];
  
  // 1. Define the Mapping Data (Source Index -> Target Index)
  // This needs to be dynamically loaded in a real application, but for now, it matches your visual.
  mappingData = [
    { source: 0, target: 0 }, // Order Id -> Order Id
    { source: 1, target: 1 }, // Full Name -> First Name
    { source: 2, target: 3 }, // Email -> Email Address
    { source: 3, target: 4 }, // DOB -> Birth Date
    { source: 4, target: 5 }, // Ordered Date -> Ordered Date
    { source: 5, target: 6 }, // Address -> Address
    { source: 6, target: 8 }, // Region -> Region
    { source: 7, target: 7 }, // Zip Code -> City (assuming Pincode/Zip Code -> City)
    { source: 8, target: 9 }, // Country code -> Country code
    { source: 9, target: 10 }, // Mobile phone -> Home phone
    
    // Add the rest of the visible mappings from the screenshot:
    { source: 10, target: 11 }, // Uploaded at -> Uploaded at
    { source: 11, target: 13 }, // Customer Id -> Customer Id
    { source: 12, target: 14 }, // Shipping Address -> Shipping Address
    { source: 13, target: 15 }, // Delivery Address -> Delivery Address
    { source: 14, target: 16 }, // Product SKU -> Product SKU
    { source: 15, target: 17 }, // Uploaded at -> Uploaded at
    { source: 16, target: 18 }, // Updated at -> Updated at
    { source: 17, target: 12 }, // Customer ID -> Updated at (assuming a complex/misaligned connection)
    // Add more as needed for the full list...
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // ... (Your existing ngOnInit logic to load columns and counts) ...
    let param = this.route.snapshot.paramMap.get('submodule');
    this.submodule = param ? param.replace('-', ' ') : '';
    if (!param) {
      param = 'invoices';
    }
    // Hardcoded logic based on submodule
    if (param === 'invoices') {
      this.recordCount = 129;
      this.excludeCount = 129;
      this.sourceColumns = [
        'Order Id / LIFNR', 'Full Name / Name 1', 'Email / ZBUKR', 'DOB / ZPSTL',
        'Ordered Date / XBLNR', 'Address / BUZEI', 'Region / GJAHR', 'Zip Code / LIFNR',
        'Country code / SGTXT', 'Mobile phone / BUDAT', 'Uploadd at / WAERS', 
        'Customer Id / WRBTR_MWSTS', 'Shipping Address / ZUONR', 'Delivery Address / ZREGI',
        'Product SKU / ZBNKS', 'Uploadd at / ZBNKL', 'Updated at / HBKID', 'Customer ID / HKTID'
      ];
      this.targetColumns = [
        'Order Id', 'First Name', 'Last Name', 'Email Address', 'Birth Date', 
        'Ordered Date', 'Address', 'City', 'Region', 'Pincode', 
        'Country code', 'Home phone', 'Uploadd at', 'Updated at', 'Customer Id', 
        'Shipping Address', 'Delivery Address', 'Product SKU', 'Uploadd at'
      ];
    }
  }

  // 2. Implement ngAfterViewInit to draw lines after the template is rendered
  ngAfterViewInit(): void {
    // Need a slight delay to ensure all CSS and rendering is finalized
    setTimeout(() => {
        this.drawMappings();
    }, 100); 
  }

  // 3. Line Drawing Logic
  drawMappings(): void {
    const svgEl = this.svgElementRef.nativeElement;
    
    // Clear any previous lines
    svgEl.innerHTML = ''; 

    // Get the container element to calculate relative positions
    const containerEl = svgEl.parentElement!;
    const containerRect = containerEl.getBoundingClientRect();
    const containerScrollTop = containerEl.scrollTop;
    
    // Select all list items (using data attributes for safety)
    const sourceItems = containerEl.querySelectorAll<HTMLElement>('.source-column li');
    const targetItems = containerEl.querySelectorAll<HTMLElement>('.target-column li');

    this.mappingData.forEach(mapping => {
      const sourceItem = sourceItems[mapping.source];
      const targetItem = targetItems[mapping.target];

      if (sourceItem && targetItem) {
        const sourceRect = sourceItem.getBoundingClientRect();
        const targetRect = targetItem.getBoundingClientRect();

        // Calculate connection point coordinates relative to the SVG container (mapping-box)
        
        // Start X: Right edge of source item + 15px (dot position, based on SCSS right: 15px)
        const x1 = sourceRect.right - containerRect.left - 15;
        // Start Y: Center of source item
        const y1 = sourceRect.top + (sourceRect.height / 2) - containerRect.top + containerScrollTop; 

        // End X: Left edge of target item + 15px (dot position, based on SCSS left: 15px)
        const x2 = targetRect.left - containerRect.left + 15;
        // End Y: Center of target item
        const y2 = targetRect.top + (targetRect.height / 2) - containerRect.top + containerScrollTop;
        
        // Use a cubic Bézier curve for smooth connections (like in the image)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const middleX = (x2 - x1) / 2;
        
        // M: Move to start (x1, y1)
        // C: Cubic Bézier Curve: (control1, control2, end)
        const d = `M${x1} ${y1} C ${x1 + middleX} ${y1}, ${x2 - middleX} ${y2}, ${x2} ${y2}`;

        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#bbdefb'); // Light blue line color
        path.setAttribute('stroke-width', '2');

        svgEl.appendChild(path);
      }
    });
  }

  back() {
    this.backtoIntial.emit("back");
  }
}