import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveReportComponent } from './archive-report.component';

describe('ProjectsComponent', () => {
  let component: ArchiveReportComponent;
  let fixture: ComponentFixture<ArchiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
