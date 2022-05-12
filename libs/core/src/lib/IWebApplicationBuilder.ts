import { ServiceCollection } from 'tiny-injector';

import { IWebApplication } from './IWebApplication';

export interface IWebApplicationBuilder {
  Services: ServiceCollection;
  Build(): IWebApplication;
}
