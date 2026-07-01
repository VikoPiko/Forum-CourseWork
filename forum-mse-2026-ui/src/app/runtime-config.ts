import { InjectionToken } from '@angular/core';

export interface RuntimeConfig {
  backendBaseUrl: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<RuntimeConfig>;
  }
}

export const RUNTIME_CONFIG = new InjectionToken<RuntimeConfig>('RUNTIME_CONFIG');

export function loadRuntimeConfig(): RuntimeConfig {
  const fromWindow = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};
  return {
    backendBaseUrl: fromWindow.backendBaseUrl ?? '',
  };
}
