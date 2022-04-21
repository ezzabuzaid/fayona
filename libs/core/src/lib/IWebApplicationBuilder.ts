import { ServiceCollection } from 'tiny-injector';
import { RequestIdOptions } from './RequestId';
import { WebApplication } from './WebApplication';

export interface IWebApplicationBuilder {
  Services: ServiceCollection;
  Build(): WebApplication;
  AddRequestId(optFn: (options: RequestIdOptions) => void): void;
  AddHsts(): void;
}
