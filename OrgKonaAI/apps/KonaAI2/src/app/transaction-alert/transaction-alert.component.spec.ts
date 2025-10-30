import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAlertComponent } from './transaction-alert.component';

describe('CreateAlertComponent', () => {
  let component: TransactionAlertComponent;
  let fixture: ComponentFixture<TransactionAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
