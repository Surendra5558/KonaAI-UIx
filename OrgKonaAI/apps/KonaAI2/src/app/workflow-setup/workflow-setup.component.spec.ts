import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSetupComponent } from './workflow-setup.component';

describe('WorkflowSetupComponent', () => {
  let component: WorkflowSetupComponent;
  let fixture: ComponentFixture<WorkflowSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
