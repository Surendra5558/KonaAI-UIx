import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InsightsEntityTransComponent } from './insights-entity-trans.component';

describe('InsightsEntityTransComponent', () => {
  let component: InsightsEntityTransComponent;
  let fixture: ComponentFixture<InsightsEntityTransComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InsightsEntityTransComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InsightsEntityTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to insights when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/insights']);
  });
});
