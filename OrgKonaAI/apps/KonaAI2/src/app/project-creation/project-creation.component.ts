import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@org-kona-ai/shared';
import { APITypes,MetaData } from '../models/common-models';
import { SHARED_IMPORTS, SHARED_PROVIDERS } from '../shared/shared-imports';


@Component({
  selector: 'app-project-creation',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  providers: [...SHARED_PROVIDERS],
  templateUrl: './project-creation.component.html',
  styleUrl: './project-creation.component.scss'
})

export class ProjectCreationComponent implements OnInit {
  projectForm: FormGroup;
  defenceLines = [
    { value: 'first', label: 'First Line of Defence' },
    { value: 'second', label: 'Second Line of Defence' },
    { value: 'third', label: 'Third Line of Defence' }
  ];

  // riskAreas = [
  //   { value: 'operational', label: 'Operational Risk' },
  //   { value: 'financial', label: 'Financial Risk' },
  //   { value: 'compliance', label: 'Compliance Risk' },
  //   { value: 'strategic', label: 'Strategic Risk' }
  // ];

  riskAreas: MetaData[] =[];
  auditResponsibility: MetaData[] =[];
   departments: MetaData[] =[];
    businessUnits: MetaData[] =[];

  sources = [
    { value: 'internal', label: 'Internal Audit' },
    { value: 'external', label: 'External Audit' },
    { value: 'regulatory', label: 'Regulatory Review' },
    { value: 'management', label: 'Management Review' }
  ];

  countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ];

  // businessUnits = [
  //   { value: 'finance', label: 'Finance' },
  //   { value: 'operations', label: 'Operations' },
  //   { value: 'technology', label: 'Technology' },
  //   { value: 'hr', label: 'Human Resources' }
  // ];

  // departments = [
  //   { value: 'accounting', label: 'Accounting' },
  //   { value: 'treasury', label: 'Treasury' },
  //   { value: 'risk', label: 'Risk Management' },
  //   { value: 'compliance', label: 'Compliance' }
  // ];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProjectCreationComponent>, private apiService: ApiService) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(200), noLeadingSpaceValidator()]],
      projectScope: [''],
      auditResponsibility: ['', Validators.required],
      riskArea: ['', Validators.required],
      startDate: ['', [Validators.required, startDateValidator('endDate')]],
      endDate: ['', [Validators.required, endDateValidator('startDate')]],
      modules: this.fb.group({
        pci: [false],
        soc: [false],
        tms: [false]
      }, { validators: atLeastOneModuleSelected }),
      country: [''],
      businessUnit: [''],
      businessDepartment: ['']
      //    sources: this.fb.group({
      //   pciSource: [''],
      //   socSource: [''],
      //   tmsSource: ['']
      // }),
    });
  }
  get f() {
    return this.projectForm.controls;
  }

  ngOnInit(): void {
    this.apiService.get('/v1/ClientProjectAuditResponsibility').subscribe((res: any) => {
      if (res && res.value) {
        console.log('auditResponsibility:', res.value);
        this.auditResponsibility = res.value;
      }
    });

    this.apiService.get('/v1/ClientProjectRiskArea').subscribe((res: any) => {
      if (res && res.value) {
        this.riskAreas = res.value; 
        console.log('riskAreas:', this.riskAreas);
      }
    });
    this.apiService.get('/v1/ClientProjectDepartment').subscribe((res: any) => {
      if (res && res.value) {
        this.departments = res.value; 
        console.log('ClientProjectDepartment:', this.departments);
      }
    });
     this.apiService.get('/v1/ClientProjectUnit').subscribe((res: any) => {
      if (res && res.value) {
       this.businessUnits = res.value; 
        console.log('businessUnits:', this.businessUnits);
      }
    });


    // this.apiService.get('/v1/Country', '').subscribe((res) => {
    //   if (res) {
    //     console.log(res);
    //     this.countries = res;
    //   }
    // });
    // this.apiService.get('/v1/BusinessUnit', '').subscribe((res) => {
    //   if (res) {
    //     console.log(res);
    //     this.businessUnits = res;
    //   }
    // });
    this.projectForm.valueChanges.subscribe(() => {
      // Trigger validation on related controls (especially for custom validators)
      const startDateControl = this.projectForm.get('startDate');
      const endDateControl = this.projectForm.get('endDate');

      if (startDateControl && endDateControl) {
        startDateControl.updateValueAndValidity({ onlySelf: true });
        endDateControl.updateValueAndValidity({ onlySelf: true });
      }
    });
    //sample for test the api
    this.apiService.get('/documents', APITypes.auth).subscribe(res => {

    }, err => {

    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Form submitted:', this.projectForm.value);
      // var payload = {
      //   name: this.projectForm.value.projectName,
      //   Description: this.projectForm.value.projectScope,
      //   auditResponsibilityId: this.projectForm.value.auditResponsibility,
      //   riskAreaId: this.projectForm.value.riskArea,
      //   countryId: this.projectForm.value.country,
      //   businessUnitId: this.projectForm.value.businessUnit,
      //   businessDepartmentId: this.projectForm.value.businessDepartment,
      //   startDate: this.projectForm.value.startDate,
      //   endDate: this.projectForm.value.endDate,
      //   modules: []
      // }
      // this.apiService.post('/v1/ClientProject', payload).subscribe((res) => {
      //   if (res) {
      //     this.submitPopup(this.projectForm.value);
      //   }
      // }, (err) => {

      // })
      this.submitPopup(this.projectForm.value);


    }
    else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }
  submitPopup(result?: any) {
    this.dialogRef.close(result);
  }
  closePopup() {
    this.dialogRef.close();
  }

  private markFormGroupTouched() {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();

      if (control && typeof control.value === 'object' && control.value !== null) {
        Object.keys(control.value).forEach(nestedKey => {
          const nestedControl = control.get(nestedKey);
          nestedControl?.markAsTouched();
        });
      }
    });
  }

  onClear() {
    // Reset the entire form including nested FormGroups
    this.projectForm.reset({
      projectName: '',
      projectScope: '',
      auditResponsibility: '',
      riskArea: '',
      startDate: '',
      endDate: '',
      modules: {
        pci: false,
        soc: false,
        tms: false
      },
      country: '',
      businessUnit: '',
      businessDepartment: ''
    });

    // Update validity for nested groups so validators run again
    this.projectForm.get('modules')?.updateValueAndValidity();

    // Mark the entire form as untouched and pristine
    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();

    // Also mark nested form groups as untouched
    this.projectForm.get('modules')?.markAsUntouched();
    this.projectForm.get('modules')?.markAsPristine();

    console.log('Form cleared');
  }



onModuleChange(module: string, checked: boolean) {
  const modulesControl = this.projectForm.get('modules');
  if (modulesControl) {
    modulesControl.patchValue({
      [module]: checked
    });
    // Trigger validation
    modulesControl.updateValueAndValidity();
  }
}
}
export function startDateValidator(endDateControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const startDate = control.value ? new Date(control.value) : null;
    const endDateControl = control.parent?.get(endDateControlName);
    const endDate = endDateControl?.value ? new Date(endDateControl.value) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time for comparison

    if (!startDate) return null; // no value yet

    if (startDate < today) {
      return { startDatePast: true };
    }
    if (endDate && startDate >= endDate) {
      return { startDateAfterEndDate: true };
    }
    return null;
  };
}

// Custom validator to check if end date is after start date
export function endDateValidator(startDateControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const endDate = control.value ? new Date(control.value) : null;
    const startDateControl = control.parent?.get(startDateControlName);
    const startDate = startDateControl?.value ? new Date(startDateControl.value) : null;

    if (!endDate) return null; // no value yet

    if (startDate && endDate <= startDate) {
      return { endDateBeforeStartDate: true };
    }
    return null;
  };
}
export const atLeastOneModuleSelected: ValidatorFn = (group: AbstractControl) => {
  const selected = Object.values(group.value).some(v => v);
  return selected ? null : { noModuleSelected: true };
};
export function noLeadingSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value as string;
    if (value && value.startsWith(' ')) {
      return { leadingSpace: true };
    }
    return null;
  };
}