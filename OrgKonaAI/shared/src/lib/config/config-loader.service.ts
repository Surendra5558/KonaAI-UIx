import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';

export interface AppConfig {
  apiBaseUrl?: string;
  ODataUrl?: string;
  reportUrl?: string;
  [key: string]: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class ConfigLoaderService {
  config?: AppConfig | null = null;

  constructor(private http: HttpClient) {
    
  }

  loadConfig(): Promise<AppConfig> {
   return firstValueFrom(
      this.http.get<AppConfig>('assets/app-config.json').pipe(
        tap(cfg => {
          this.config = cfg;
          console.log('Configuration loaded:', cfg);
        })
      )
    );
  }

  get cfg(): AppConfig | null {
    // Option 1: Default fallback
    if (!this.config) {
      this.loadConfig();
    }
    return this.config ?? null;
  }

  get apiBaseUrl(): string {
    if (!this.config) {
     this.loadConfig();
    }
    return this.config?.apiBaseUrl ?? '';
  }
  getUrl<K extends keyof AppConfig>(key: K): string {
    if (!this.cfg) {
      throw new Error('Configuration not loaded yet!');
    }
    return this.cfg[key] ?? '';
  }
}
