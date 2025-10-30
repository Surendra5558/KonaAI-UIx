import { Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

export function appTestProviders(routes = []) {
  return [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
  ];
}
