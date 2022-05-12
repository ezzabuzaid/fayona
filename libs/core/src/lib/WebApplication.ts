import { CoreInjector } from './CoreInjector';
import { IWebApplication } from './IWebApplication';
import { IWebApplicationBuilder } from './IWebApplicationBuilder';
import { Metadata } from './Metadata';
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

  private static Create(options: WebApplicationOptions): WebApplicationBuilder {
    throw new Error('Not Implemented.');
  }

  public Run(): void {
    //
  }

  public UseMiddleware(middleware: new (...args: any) => Middleware): void {
    CoreInjector.AppendScoped(Middleware, middleware);
  }

  private UseWelcomePage(): WebApplicationBuilder {
    throw new Error('Not Implemented.');
  }

  /**
   * All uncaught errors related to express will be bubbled up to this handler.
   *
   * It's benfical if you don't want to handle the same error again and again
   *
   * e.g getByIdOrFail() will fail in case the item is not there hence you need to wrap it in try catch or use then().catch(),
   * thus, you need to find a way to let the error fly to this handler so you can handle it in one place
   */
  private UseExceptionHandler(): WebApplicationBuilder {
    throw new Error('Not Implemented.');
  }
}
