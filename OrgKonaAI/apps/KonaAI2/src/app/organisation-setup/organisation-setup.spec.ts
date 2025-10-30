import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSetupComponent } from './organisation-setup.component';

describe('ProjectsComponent', () => {
  let component: OrganisationSetupComponent;
  let fixture: ComponentFixture<OrganisationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
