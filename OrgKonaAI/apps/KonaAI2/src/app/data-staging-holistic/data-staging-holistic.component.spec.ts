import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStagingHolisticComponent } from './data-staging-holistic.component';

describe('DataStagingHolisticComponent', () => {
  let component: DataStagingHolisticComponent;
  let fixture: ComponentFixture<DataStagingHolisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataStagingHolisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataStagingHolisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
