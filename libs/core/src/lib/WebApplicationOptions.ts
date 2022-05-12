import { InjectionToken } from 'tiny-injector';

export const WEB_APPLICATION_OPTIONS =
  new InjectionToken<WebApplicationOptions>('WEB_APPLICATION_OPTIONS');
export interface WebApplicationOptions {}
