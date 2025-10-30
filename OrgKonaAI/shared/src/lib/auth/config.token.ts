import { InjectionToken } from '@angular/core';
import type { AuthConfigJson } from './runtime-config.service';

export const AUTH_CONFIG_TOKEN = new InjectionToken<AuthConfigJson>('AUTH_CONFIG');