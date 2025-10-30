import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ApiService, HttpConnecrService } from '@org-kona-ai/shared';


export const SHARED_IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  RouterOutlet
];

export const SHARED_PROVIDERS = [
    ApiService, HttpConnecrService
]

