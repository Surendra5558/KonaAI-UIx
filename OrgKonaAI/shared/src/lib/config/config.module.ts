import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ConfigLoaderService } from './config-loader.service';

export function initApp(config: ConfigLoaderService) {
  return () => config.loadConfig();
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    ConfigLoaderService,
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [ConfigLoaderService], multi: true }
  ]
})
export class ConfigModule {}