import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { createAppConfig } from './app/app.config';

fetch('/assets/msal-configuration.json')
  .then(async resp => {
    if (!resp.ok) throw new Error(`Config load failed: ${resp.status}`);
    return resp.json();
  })
  .then(configJson => {
    const appAuthConfig = createAppConfig(configJson);

    bootstrapApplication(AppComponent, appAuthConfig)
      .catch(err => console.error(err));
  })
  .catch(err => {
    console.error('Configuration load failed; app will not bootstrap.', err);
  });
  
// bootstrapApplication(AppComponent,appConfig) 
// .catch(err => console.error(err));