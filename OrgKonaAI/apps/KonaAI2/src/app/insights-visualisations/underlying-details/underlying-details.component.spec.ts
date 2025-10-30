import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingDetailsComponent } from './underlying-details.component';

describe('UnderlyingDetailsComponent', () => {
  let component: UnderlyingDetailsComponent;
  let fixture: ComponentFixture<UnderlyingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderlyingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderlyingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
