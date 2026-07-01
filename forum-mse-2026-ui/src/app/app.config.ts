import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RUNTIME_CONFIG, loadRuntimeConfig } from './runtime-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    { provide: RUNTIME_CONFIG, useFactory: loadRuntimeConfig },
  ],
};
