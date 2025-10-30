import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStagingComponent } from './data-staging.component';

describe('DataStagingComponent', () => {
  let component: DataStagingComponent;
  let fixture: ComponentFixture<DataStagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataStagingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataStagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
