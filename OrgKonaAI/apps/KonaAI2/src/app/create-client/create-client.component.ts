import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  projectForm: FormGroup;

  p2pSources = [{ value: 'oracle', label: 'Oracle' }, { value: 'sap', label: 'SAP' }];
  o2cSources = [{ value: 'netsuite', label: 'NetSuite' }, { value: 'workday', label: 'Workday' }];
  teSources = [{ value: 'concur', label: 'Concur' }, { value: 'expensify', label: 'Expensify' }];

  modulesList = [
  { id: 'p2p', key: 'p2p', label: 'P2P', sources: this.p2pSources, tabIndex: 7, sourceControl: 'p2pSource' },
  { id: 'o2c', key: 'o2c', label: 'O2C', sources: this.o2cSources, tabIndex: 8, sourceControl: 'o2cSource' },
  { id: 'te', key: 'te', label: 'T&E', sources: this.teSources, tabIndex: 9, sourceControl: 'teSource' }
];

constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreateClientComponent>) {
    this.projectForm = this.fb.group({
  clientName: ['', [Validators.required, Validators.maxLength(100), noLeadingSpaceValidator()]],
  URL: [''],
  phone: [''],
  email: [''],
  name: [''],
  csm: [''],
  modules: this.fb.group({
    p2p: [false],
    o2c: [false],
    te: [false],
    p2pSource: [{ value: '', disabled: true }],
    o2cSource: [{ value: '', disabled: true }],
    teSource: [{ value: '', disabled: true }]  // Move this here
  }, { validators: atLeastOneModuleSelected })
});
  }

  ngOnInit(): void { }

  get f() {
    return this.projectForm.controls;
  }

  anyModuleSelected(): boolean {
    const modules = this.projectForm.get('modules')?.value || {};
    return Object.values(modules).some(v => v);
  }

  onSubmit() {
    if (this.projectForm.valid && this.anyModuleSelected()) {
      this.submitPopup(this.projectForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  submitPopup(result?: any) {
    this.dialogRef.close(result);
  }

  closePopup() {
    this.dialogRef.close();
  }

  markFormGroupTouched() {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }


onModuleChange(moduleKey: string, checked: boolean) {
  const modulesControl = this.projectForm.get('modules') as FormGroup;

  // Set the selected module checkbox value
  modulesControl.get(moduleKey)?.setValue(checked, { emitEvent: false });

  // Enable or disable only the corresponding source dropdown
  const sourceControlName = this.modulesList.find(m => m.key === moduleKey)?.sourceControl;
  if (sourceControlName) {
    if (checked) {
      modulesControl.get(sourceControlName)?.enable({ emitEvent: false });
    } else {
      modulesControl.get(sourceControlName)?.disable({ emitEvent: false });
      modulesControl.get(sourceControlName)?.setValue('', { emitEvent: false });
    }
  }
}


onClear() {
  this.projectForm.reset({
    clientName: '',
    URL: '',
    phone: '',
    email: '',
    name: '',
    csm: '',
    modules: {
      p2p: false,
      o2c: false,
      te: false,
      p2pSource: { value: '', disabled: true },
      o2cSource: { value: '', disabled: true },
      teSource: { value: '', disabled: true }
    }
  });

  const modulesControl = this.projectForm.get('modules') as FormGroup;
  this.modulesList.forEach(mod => {
    modulesControl.get(mod.key)?.enable({ emitEvent: false });
    // modulesControl.get(mod.sourceControl)?.disable({ emitEvent: false });
  });
  this.projectForm.markAsPristine();
  this.projectForm.markAsUntouched();
}
}
/* Validators */
export const atLeastOneModuleSelected: ValidatorFn = (group: AbstractControl) => {
  const selected = Object.values((group.value || {})).some(v => v);
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
