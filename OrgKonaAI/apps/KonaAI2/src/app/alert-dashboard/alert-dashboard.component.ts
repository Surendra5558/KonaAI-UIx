import { Component, ElementRef, ViewChild, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import * as pbi from 'powerbi-client';
import { PowerbiService } from '../powerbi.service';
import { HttpClient } from '@angular/common/http';
import { POWERBI_CONFIG } from '../config/powerbi-config';


@Component({
  selector: 'app-alert-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-dashboard.component.html',
  styleUrl: './alert-dashboard.component.scss'
})
export class AlertDashboardComponent implements OnInit, OnDestroy {
  activeTab: string = 'alert-dashboard';
  @ViewChild('reportContainer', { static: true }) reportContainer!: ElementRef;
  
  report?: pbi.Report;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  pages: pbi.Page[] = [];
  activePage: pbi.Page | null = null;
  isDisplay = false;
  private pageFilters: Map<string, any[]> = new Map();
  private globalFilters: any[] = [];
  private isApplyingFilters = false;


  constructor(
    private location: Location,
    private powerbiService: PowerbiService,
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  private readonly reportId = POWERBI_CONFIG.reports.alerts.reportId;
  private readonly embedUrl = POWERBI_CONFIG.reports.alerts.embedUrl;
  private readonly accessToken = POWERBI_CONFIG.accessToken;


  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    if (this.report) {
      this.powerbiService.destroy(this.report);
    }
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.hasError = false;
    this.embedReport({});
  }

  private embedReport(embedInfo: any): void {
    try {
      const models = pbi.models;
      const config: pbi.IEmbedConfiguration = {
        type: 'report',
        id: embedInfo.reportId || this.reportId,
        embedUrl: embedInfo.embedUrl || this.embedUrl,
        accessToken: embedInfo.accessToken || this.accessToken,
        tokenType: models.TokenType.Embed,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: true
        }
      };

      const powerbiService = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );

      this.report = powerbiService.embed(this.reportContainer.nativeElement, config) as pbi.Report;
      
      // Listen for load event
      this.report.on('loaded', () => {
        this.isLoading = false;
        this.hasError = false;
      });

      // Listen for error event
      this.report.on('error', (event: any) => {
        console.error('PowerBI report error:', event);
        this.hasError = true;
        this.errorMessage = 'Failed to load dashboard content.';
        this.isLoading = false;
      });

    } catch (error) {
      console.error('Error embedding report:', error);
      this.hasError = true;
      this.errorMessage = 'Failed to initialize dashboard.';
      this.isLoading = false;
    }
  }

  retryLoad(): void {
    this.loadDashboard();
  }

  applyFilter(column: string, values: string[]): void {
    if (!this.report) return;

    const models = pbi.models;
    const filter: pbi.models.IBasicFilter = {
      $schema: "http://powerbi.com/product/schema#basic",
      target: { table: "YourTable", column },
      operator: "In",
      values,
      filterType: models.FilterType.Basic
    };

    this.report.setFilters([filter])
      .catch((err: any) => console.error("Filter error:", err));
  }

  goBack() {
    this.location.back();
  }
  
  ngAfterViewInit() {
    const models = pbi.models;
    const config: pbi.IReportEmbedConfiguration = {
      type: 'report',
      id: this.reportId,
      embedUrl: this.embedUrl,
      accessToken: this.accessToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: false },
        },
        filterPaneEnabled: true, // enable filter pane if needed
      },
    };

    //});

    const powerbiService = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );

    // cast to any here to use Report-specific APIs without TS complaints
    this.report = powerbiService.embed(this.reportContainer.nativeElement, config) as any;

    // Setup event handlers after embedding
    this.setupEventHandlers();
  }  
  private setupEventHandlers() {
    if (!this.report) return;

    // Use 'rendered' to be sure pages are ready
    this.report.on('rendered', async () => {
      try {
        // getPages is available on the Report at runtime; cast to any to avoid TS issues
        const pages: pbi.Page[] = await this.report?.getPages?.() ?? [];
        this.zone.run(() => {
          this.pages = pages;

          // Look for overview page first, otherwise use the first page
          const overviewPage = this.pages.find(page =>
            page.displayName.toLowerCase().includes('overview') ||
            page.name.toLowerCase().includes('overview')
          );

          this.activePage = overviewPage || this.pages.find((p: pbi.Page) => (p as any).isActive) || this.pages[0] || null;
          this.isDisplay = this.pages.length > 0;

          // initialize pageFilters entries
          this.pages.forEach(page => {
            if (!this.pageFilters.has(page.name)) {
              this.pageFilters.set(page.name, []);
            }
          });

          this.cdr.detectChanges();
          console.log('Pages loaded:', this.pages.map(p => p.displayName));
          console.log('Active page set to:', this.activePage?.displayName);

          // Emit pages loaded event

          // Navigate to the overview page if it's set as active
          if (this.activePage) {
            setTimeout(() => {
              this.goToPage(this.activePage!);
            }, 100);
          }
        });
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    });

    // pageChanged: update activePage
    // use any casting to access event.detail safely
    this.report.on('pageChanged', (event: any) => {
      try {
        this.zone.run(() => {
          const newPageName = event?.detail?.newPage?.name;
          if (!newPageName) return;
          const newActive = this.pages.find(p => p.name === newPageName);
          if (newActive) {
            this.activePage = newActive;
            this.cdr.detectChanges();

            // Emit page changed event
          }
        });
      } catch (err) {
        console.error('pageChanged handler error:', err);
      }
    });

    // Listen for filters applied - store filters for the active page
    // Note: using 'filtersApplied' event if available; different embed modes may require listening to different events
    this.report.on('filtersApplied', async () => {
      if (this.isApplyingFilters) return;
      try {
        // getFilters on report returns report-level filters; pages might have page-level filters as well.
        // For safety, attempt to read page-level filters from activePage if method exists.
        let currentFilters: any[] = [];
        try {
          // try page-level filters first
          if (this.activePage && typeof this.activePage.getFilters === 'function') {
            currentFilters = await this.activePage.getFilters();
          } else if (typeof this?.report?.getFilters === 'function') {
            currentFilters = await this?.report?.getFilters?.();
          }
        } catch (innerErr) {
          console.warn('Could not read page/report filters:', innerErr);
        }

        this.zone.run(() => {
          if (this.activePage) {
            this.pageFilters.set(this.activePage.name, [...(currentFilters || [])]);
            console.log(`Filters stored for page ${this.activePage.displayName}:`, currentFilters);
          }
        });
      } catch (err) {
        console.error('filtersApplied handler error:', err);
      }
    });

    // Optionally listen for report errors
    this.report.on('error', (ev: any) => {
      console.error('Power BI embed error:', ev);
    });
  }

  trackByName(index: number, page: pbi.Page) {
    return page.name;
  }

  async goToPage(page: pbi.Page) {
    if (!this.report) return;
    if (this.activePage && this.activePage.name === page.name) return;

    try {
      // prevent recursive filter storing/applying while we navigate
      this.isApplyingFilters = true;

      // Save current filters for the active page
      if (this.activePage) {
        try {
          let currentFilters: any[] = [];
          if (typeof this.activePage.getFilters === 'function') {
            currentFilters = await this.activePage.getFilters();
          } else if (typeof this.report.getFilters === 'function') {
            currentFilters = await this.report.getFilters();
          }
          this.pageFilters.set(this.activePage.name, [...(currentFilters || [])]);
        } catch (err) {
          console.warn('Could not save current page filters:', err);
        }
      }

      // Navigate
      await page.setActive();

      // Apply stored filters for target page (if present)
      const stored = this.pageFilters.get(page.name) || [];
      if (stored.length > 0) {
        // setFilters on report will apply filters at report scope; some pages support page-level filters
        if (typeof this.report.setFilters === 'function') {
          await this.report.setFilters(stored);
        } else if (typeof page.setFilters === 'function') {
          await page.setFilters(stored);
        }
        console.log(`Applied stored filters to page ${page.displayName}:`, stored);
      }

      // update UI state
      this.zone.run(() => {
        this.activePage = page;
        this.cdr.detectChanges();
      });

    } catch (err) {
      console.error('Error switching page:', err);
    } finally {
      // small delay to avoid immediate recursive events
      setTimeout(() => {
        this.zone.run(() => {
          this.isApplyingFilters = false;
        });
      }, 250);
    }
  }

  async clearAllFilters() {
    if (!this.report) return;

    try {
      // Clear filters by setting empty filters array
      if (typeof this.report.setFilters === 'function') {
        await this.report.setFilters([]);
      } else {
        // fallback: try page-level clearing
        for (const p of this.pages) {
          if (typeof p.setFilters === 'function') {
            await p.setFilters([]);
          }
        }
      }

      // Clear stored filters for pages
      this.pageFilters.clear();
      this.pages.forEach(page => this.pageFilters.set(page.name, []));

      this.globalFilters = [];

      console.log('All filters cleared');
    } catch (err) {
      console.error('Error clearing filters:', err);
    }
  }

  async saveGlobalFilters() {
    if (!this.report) return;

    try {
      let currentFilters: any[] = [];
      if (typeof this.report.getFilters === 'function') {
        currentFilters = await this.report.getFilters();
      } else if (this.activePage && typeof this.activePage.getFilters === 'function') {
        currentFilters = await this.activePage.getFilters();
      }

      this.globalFilters = [...(currentFilters || [])];

      // copy to every page storage
      this.pages.forEach(page => {
        this.pageFilters.set(page.name, [...this.globalFilters]);
      });

      console.log('Global filters saved and applied to all pages:', this.globalFilters);
    } catch (err) {
      console.error('Error saving global filters:', err);
    }
  }
}




