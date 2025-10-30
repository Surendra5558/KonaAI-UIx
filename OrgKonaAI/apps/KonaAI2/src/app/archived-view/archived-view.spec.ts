import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedViewComponent } from './archived-view.component';

describe('ProjectsComponent', () => {
  let component: ArchivedViewComponent;
  let fixture: ComponentFixture<ArchivedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
