import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightDuplicatecheckComponent } from './insight-duplicatecheck.component';

describe('InsightDuplicatecheckComponent', () => {
  let component: InsightDuplicatecheckComponent;
  let fixture: ComponentFixture<InsightDuplicatecheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightDuplicatecheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightDuplicatecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
