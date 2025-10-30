import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsTransactionMetricsComponent } from './insights-transaction-metrics.component';

describe('InsightsTransactionMetricsComponent', () => {
  let component: InsightsTransactionMetricsComponent;
  let fixture: ComponentFixture<InsightsTransactionMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsTransactionMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightsTransactionMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
