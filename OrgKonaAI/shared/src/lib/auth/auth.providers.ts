import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor
} from '@azure/msal-angular';
import {
  MSALInstanceFactory,
  MSALGuardConfigFactory,
  MSALInterceptorConfigFactory
} from './msal-config';
import { RuntimeConfigService } from './runtime-config.service';

// export function initializeConfig(rcs: RuntimeConfigService): () => Promise<void> {
//   return () => rcs.loadConfig();
// }

export const AUTH_PROVIDERS = [
  RuntimeConfigService,
//   {
//     provide: APP_INITIALIZER,
//     useFactory:  initializeConfig,
//     deps: [RuntimeConfigService],
//     multi: true
//   },
  { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory, deps: [RuntimeConfigService] },
  { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory, deps: [RuntimeConfigService] },
  { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory, deps: [RuntimeConfigService] },
  { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
  MsalService,
  MsalGuard,
  MsalBroadcastService
];
