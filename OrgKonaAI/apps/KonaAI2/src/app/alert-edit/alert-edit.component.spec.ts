import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertEditComponent } from './alert-edit.component';

describe('CreateAlertComponent', () => {
  let component: AlertEditComponent;
  let fixture: ComponentFixture<AlertEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
