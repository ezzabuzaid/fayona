import { Logger } from 'tslog';

import { ConfigureOptions } from './ConfigureOptions';
import { Environment } from './Environment';
import { IWebApplicationBuilder } from './IWebApplicationBuilder';
import { RequestIdOptions } from './RequestId';
import { ROUTING_COLLECTION } from './RoutingCollection';
import { WebApplication } from './WebApplication';

export const logger = new Logger({ name: 'WebApplication' });

export class WebApplicationBuilder implements IWebApplicationBuilder {
  public Environment = new Environment();
  public Services = ROUTING_COLLECTION;

  constructor(private Options: ConfigureOptions) {}

  public AddHsts(): void {
    throw new Error('Not Implemented.');
  }

  public AddRequestId(optFn: (options: RequestIdOptions) => void): void {
    // FIXME to be moved to routing project
    const options = new RequestIdOptions();
    optFn(options);
    this.Services.TryAddTransient(RequestIdOptions, () => options);
  }

  public Build(): WebApplication {
    return new WebApplication(this.Options);
  }
}
