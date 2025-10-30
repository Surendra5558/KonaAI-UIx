import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioManagerComponent } from './scenario-manager.component';

describe('ScenarioManagerComponent', () => {
  let component: ScenarioManagerComponent;
  let fixture: ComponentFixture<ScenarioManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
