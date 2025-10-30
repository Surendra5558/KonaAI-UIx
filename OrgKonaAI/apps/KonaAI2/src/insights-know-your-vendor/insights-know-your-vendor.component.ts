import { Component } from '@angular/core';

@Component({
  selector: 'app-insights-know-your-vendor',
  imports: [],
  templateUrl: './insights-know-your-vendor.component.html',
  styleUrl: './insights-know-your-vendor.component.scss'
})
export class InsightsKnowYourVendorComponent {

  isFiltered = false;

  showFilteredView() {
    if (this.isFiltered) return;

    this.isFiltered = true;

    document.getElementById('filterHeader')?.classList.add('show');
    document.getElementById('selectionImpact')?.classList.add('show');

    document.getElementById('businessDefault')!.style.display = 'none';
    document.getElementById('businessFiltered')!.style.display = 'block';

    document.getElementById('vendorDefault')!.style.display = 'none';
    document.getElementById('vendorFiltered')!.style.display = 'block';

    document.getElementById('transactionDefault')!.style.display = 'none';
    document.getElementById('transactionFiltered')!.style.display = 'block';

    document.getElementById('barsDefault')!.style.display = 'none';
    document.getElementById('barsFiltered')!.style.display = 'block';

    console.log('Switched to filtered view');
  }

  showDefaultView() {
    if (!this.isFiltered) return;

    this.isFiltered = false;

    document.getElementById('filterHeader')?.classList.remove('show');
    document.getElementById('selectionImpact')?.classList.remove('show');

    document.getElementById('businessDefault')!.style.display = 'block';
    document.getElementById('businessFiltered')!.style.display = 'none';

    document.getElementById('vendorDefault')!.style.display = 'block';
    document.getElementById('vendorFiltered')!.style.display = 'none';

    document.getElementById('transactionDefault')!.style.display = 'block';
    document.getElementById('transactionFiltered')!.style.display = 'none';

    document.getElementById('barsDefault')!.style.display = 'block';
    document.getElementById('barsFiltered')!.style.display = 'none';

    console.log('Switched to default view');
  }

  clearAllFilters() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    this.showDefaultView();
  }

  toggleDemo() {
    if (this.isFiltered) {
      this.showDefaultView();
    } else {
      this.showFilteredView();
    }
  }

  ngOnInit() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e: any) => {
        const searchValue = e.target.value.trim();
        console.log('Search input:', searchValue);

        if (searchValue.length > 0) {
          console.log('Triggering filtered view');
          this.showFilteredView();
        } else {
          console.log('Clearing filters');
          this.showDefaultView();
        }
      });
    }

    // Region dropdown
    const regionSelect = document.getElementById('regionSelect');
    if (regionSelect) {
      regionSelect.addEventListener('change', (e: any) => {
        console.log('Region selected:', e.target.value);
      });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Dashboard loaded - try typing in the search box!');
      this.showDefaultView(); // Start with default view
    });
  }
}
