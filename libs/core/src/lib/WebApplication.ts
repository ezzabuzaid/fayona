import { CoreInjector } from './CoreInjector';
import { IWebApplication } from './IWebApplication';
import { IWebApplicationBuilder } from './IWebApplicationBuilder';
import { Middleware } from './Middleware';
import { WebApplicationBuilder } from './WebApplicationBuilder';
import {
  WEB_APPLICATION_OPTIONS,
  WebApplicationOptions,
} from './WebApplicationOptions';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class WebApplication implements IWebApplication {
  public static CreateBuilder(
    options: WebApplicationOptions
  ): IWebApplicationBuilder {
    CoreInjector.AddSingleton(WEB_APPLICATION_OPTIONS, () => options);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new WebApplicationBuilder();
  }

  public UseMiddleware(middleware: new (...args: any) => Middleware): void {
    CoreInjector.AppendScoped(Middleware, middleware);
  }
}
