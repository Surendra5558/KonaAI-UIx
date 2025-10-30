import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolisticViewComponent } from './holistic-view.component';

describe('ProjectsComponent', () => {
  let component: HolisticViewComponent;
  let fixture: ComponentFixture<HolisticViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolisticViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolisticViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
