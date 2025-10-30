import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectCreationComponent } from './project-creation.component';

describe('ProjectCreationComponent Form Validation', () => {
  let component: ProjectCreationComponent;
  let fixture: ComponentFixture<ProjectCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ProjectCreationComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form with all controls', () => {
    expect(component.projectForm.contains('projectName')).toBeTruthy();
    expect(component.projectForm.contains('auditResponsibility')).toBeTruthy();
    expect(component.projectForm.contains('riskArea')).toBeTruthy();
    expect(component.projectForm.contains('startDate')).toBeTruthy();
    expect(component.projectForm.contains('endDate')).toBeTruthy();
    expect(component.projectForm.contains('modules')).toBeTruthy();
    expect(component.projectForm.contains('sources')).toBeTruthy();
    expect(component.projectForm.contains('country')).toBeTruthy();
    expect(component.projectForm.contains('businessUnit')).toBeTruthy();
    expect(component.projectForm.contains('businessDepartment')).toBeTruthy();
  });

  // --- Project Name ---
  it('should require projectName', () => {
    const control = component.f['projectName'];
    control.setValue('');
    expect(control.hasError('required')).toBeTruthy();
  });

  it('should not allow leading spaces in projectName', () => {
    const control = component.f['projectName'];
    control.setValue(' Leading');
    expect(control.hasError('leadingSpace')).toBeTruthy();
  });

  it('should enforce maxlength on projectName', () => {
    const control = component.f['projectName'];
    control.setValue('a'.repeat(201));
    expect(control.hasError('maxlength')).toBeTruthy();
  });

  // --- Required dropdowns ---
  it('should require auditResponsibility', () => {
    const control = component.f['auditResponsibility'];
    control.setValue('');
    expect(control.hasError('required')).toBeTruthy();
  });

  it('should require riskArea', () => {
    const control = component.f['riskArea'];
    control.setValue('');
    expect(control.hasError('required')).toBeTruthy();
  });

  // --- Date Validators ---
  it('should invalidate startDate if in the past', () => {
    const startDate = component.f['startDate'];
    startDate.setValue('2000-01-01');
    expect(startDate.hasError('startDatePast')).toBeTruthy();
  });
  
  it('should invalidate startDate if >= endDate', () => {
    component.f['endDate'].setValue('2025-01-01');
    component.f['startDate'].setValue('2025-01-02');

    component.f['startDate'].updateValueAndValidity();
    component.f['endDate'].updateValueAndValidity();

    // ✅ Check endDate for consistency as well
    expect(
      component.f['startDate'].hasError('startDateAfterEndDate') ||
      component.f['endDate'].hasError('endDateBeforeStartDate')
    ).toBeTruthy();
  });

  it('should invalidate endDate if <= startDate', () => {
    component.f['startDate'].setValue('2025-01-05');
    component.f['endDate'].setValue('2025-01-04');

    // 🔑 Force revalidation
    component.f['startDate'].updateValueAndValidity();
    component.f['endDate'].updateValueAndValidity();

    expect(component.f['endDate'].hasError('endDateBeforeStartDate')).toBeTruthy();
  });

  // --- Modules ---
  it('should require at least one module selected', () => {
    const modules = component.projectForm.get('modules');
    modules?.setValue({ pci: false, soc: false, tms: false });
    expect(modules?.hasError('noModuleSelected')).toBeTruthy();
  });

  it('should be valid when one module is selected', () => {
    const modules = component.projectForm.get('modules');
    modules?.setValue({ pci: true, soc: false, tms: false });
    expect(modules?.valid).toBeTruthy();
  });

  // --- Sources ---
  it('should not require sources (optional)', () => {
    const sources = component.projectForm.get('sources');
    sources?.setValue({ pciSource: '', socSource: '', tmsSource: '' });
    expect(sources?.valid).toBeTruthy();
  });

  // --- Whole Form ---
  it('should make the whole form valid with correct values', () => {
    component.projectForm.patchValue({
      projectName: 'Valid Project',
      auditResponsibility: 'first',
      riskArea: 'operational',
      startDate: '2025-09-03',
      endDate: '2025-09-04',
      modules: { pci: true, soc: false, tms: false },
      country: 'us',
      businessUnit: 'finance',
      businessDepartment: 'accounting'
    });
    expect(component.projectForm.valid).toBeTruthy();
  });
});
