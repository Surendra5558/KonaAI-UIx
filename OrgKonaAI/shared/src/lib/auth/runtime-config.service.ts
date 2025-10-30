import { Inject, Injectable } from '@angular/core';
import { AUTH_CONFIG_TOKEN } from './config.token';

export interface AuthConfigJson {
  msal: any;
  guard: any;
  interceptor: any;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  //Real api services are available following code should be enable.
  //private config?: AuthConfigJson;
//   constructor(private http: HttpClient) {}
  
//   loadConfig(): Promise<void> {
//     return this.http.get<AuthConfigJson>('/assets/msal-configuration.json')
//       .toPromise()
//       .then(cfg => { this.config = cfg; })
//       .catch(() => {
//         console.warn('Failed to load config; using fallback defaults.');
//         this.config = this.getFallbackConfig();
//       });
//   }

//   get configData(): AuthConfigJson {
//     if (!this.config) throw new Error('Runtime config not loaded');
//     return this.config;
//   }
//   private getFallbackConfig(): AuthConfigJson {
//     return {
//       msal: { auth: { clientId: '', authority: '', redirectUri: '/' }, cache: { cacheLocation: 'sessionStorage' } },
//       guard: { interactionType: 'redirect', authRequest: { scopes: [] }, loginFailedRoute: '/' },
//       interceptor: { interactionType: 'redirect', protectedResourceMap: [] }
//     };
//   }
  constructor(@Inject(AUTH_CONFIG_TOKEN) private config: AuthConfigJson) {}
  getConfig(): AuthConfigJson {
    return this.config;
  }
    get configData(): AuthConfigJson {
    if (!this.config) throw new Error('Runtime config not loaded');
    return this.config;
  }
}
