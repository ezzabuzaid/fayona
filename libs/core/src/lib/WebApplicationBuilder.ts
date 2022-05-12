import { Logger } from 'tslog';

import { CORE_SERVICE_COLLECTION } from './CoreInjector';
import { Environment } from './Environment';
import { IWebApplicationBuilder } from './IWebApplicationBuilder';
import { WebApplication } from './WebApplication';

export const logger = new Logger({ name: 'WebApplication' });

export class WebApplicationBuilder implements IWebApplicationBuilder {
  public Environment = new Environment();
  public Services = CORE_SERVICE_COLLECTION;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public Build(): WebApplication {
    return new WebApplication();
  }
}
