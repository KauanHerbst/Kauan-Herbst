import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideI18n } from './i18n/i18n';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideI18n(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};
