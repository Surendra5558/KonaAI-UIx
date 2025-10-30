import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsKnowYourVendorComponent } from './insights-know-your-vendor.component';

describe('InsightsKnowYourVendorComponent', () => {
  let component: InsightsKnowYourVendorComponent;
  let fixture: ComponentFixture<InsightsKnowYourVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsKnowYourVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightsKnowYourVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
