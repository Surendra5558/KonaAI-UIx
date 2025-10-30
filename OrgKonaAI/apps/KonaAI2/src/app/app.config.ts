import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AUTH_CONFIG_TOKEN, AUTH_PROVIDERS, ConfigModule, RuntimeConfigService } from '@org-kona-ai/shared'
import { AuthConfigJson } from 'shared/src/lib/auth/runtime-config.service';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';

export function createAppConfig(config: AuthConfigJson): ApplicationConfig {
  return {
    providers: [
      provideTransloco({
      loader: TranslocoHttpLoader, // your loader
      config: {
        availableLangs: ['en', 'ja', 'es'], // languages
        defaultLang: 'en',             // default language
        reRenderOnLangChange: true
      }
    }),
      provideZoneChangeDetection({ eventCoalescing: true }), 
      provideRouter(routes), 
      provideClientHydration(),
      importProvidersFrom(ConfigModule),
      AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    //AuthGuard,
      provideRouter(routes),
      provideHttpClient(withFetch(), withInterceptorsFromDi()),
      {
        provide: AUTH_CONFIG_TOKEN,
        useValue: config
      },
      {
        provide: RuntimeConfigService,              // Ensure services get the loaded config
        useFactory: () => new RuntimeConfigService(config)
      },
      ...AUTH_PROVIDERS
    ]
  };
}