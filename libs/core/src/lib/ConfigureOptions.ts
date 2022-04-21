import { InjectionToken } from 'tiny-injector';

export const CONFIGURE_OPTIONS = new InjectionToken<ConfigureOptions>(
  'CONFIGURE_OPTIONS'
);
export interface ConfigureOptions {
  Controllers: string[];
  ApiAdaptar: ReturnType<typeof import('express')>;
}
