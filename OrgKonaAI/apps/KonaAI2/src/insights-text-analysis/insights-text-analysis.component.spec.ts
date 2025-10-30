import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsTextAnalysisComponent } from './insights-text-analysis.component';

describe('InsightsTextAnalysisComponent', () => {
  let component: InsightsTextAnalysisComponent;
  let fixture: ComponentFixture<InsightsTextAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsTextAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightsTextAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
