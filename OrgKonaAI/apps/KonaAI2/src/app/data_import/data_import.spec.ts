import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataImportComponent } from './data_import.component';
import { IntegrationPopupComponent } from '../integration-popup/integration-popup.component';

describe('DataImportComponent', () => {
  let component: DataImportComponent;
  let fixture: ComponentFixture<DataImportComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({})
    });

    await TestBed.configureTestingModule({
      imports: [DataImportComponent, IntegrationPopupComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to data quality when quality step is clicked', () => {
    // Arrange
    const qualityStep = {
      id: 'quality',
      title: 'Data Quality',
      description: 'Reviews The Data',
      icon: 'quality',
      isActive: false,
      route: '/data-quality'
    };
    component.projectName = 'Test Project';

    // Act
    component.goToStep(qualityStep);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/data-quality'], {
      queryParams: { projectName: 'Test Project' }
    });
  });

  it('should not navigate when non-quality step is clicked', () => {
    // Arrange
    const importStep = {
      id: 'import',
      title: 'Data Import',
      description: 'Import Your Data Here',
      icon: 'import',
      isActive: true,
      route: '/data'
    };

    // Act
    component.goToStep(importStep);

    // Assert
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.isImport).toBe(true);
    expect(component.isQuality).toBe(false);
  });
});
