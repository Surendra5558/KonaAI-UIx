import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDetailsComponent } from './transaction-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('TransactionDetailsComponent', () => {
  let component: TransactionDetailsComponent;
  let fixture: ComponentFixture<TransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDetailsComponent, RouterTestingModule, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
