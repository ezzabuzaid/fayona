import { NextFunction, Request, Response } from 'express';
import type { RequestHandler } from 'express';
import * as glob from 'fast-glob';
import { StatusCodes } from 'http-status-codes';
import * as path from 'path';
import { Injector, ServiceType } from 'tiny-injector';

import { ConfigureOptions } from './ConfigureOptions';
import { requestIdMiddleware } from './RequestId';
// import { ErrorResponse, HttpResponse, SuccessResponse } from './Response';
// import { autoHandler } from './Routing/AutoHandler';
// import { Metadata } from './Routing/Metadata';
import { WebApplicationBuilder, logger } from './WebApplicationBuilder';

export class WebApplication {
  #Application = this.Options.ApiAdaptar;
  // FIXME: create custom service collection for metadata
  #Metadata = Injector.GetRequiredService(Metadata);
  #BasePath = '';

  constructor(private Options: ConfigureOptions) {}

  public static CreateBuilder(
    options: ConfigureOptions
  ): WebApplicationBuilder {
    return new WebApplicationBuilder(options);
  }

  private static Create(options: ConfigureOptions): WebApplicationBuilder {
    throw new Error('Not Implemented.');
  }

  public LogEndpoints(): void {
    // console.log(require('express-list-endpoints')(this.#Application));
  }

  public AddControllers(): void {
    glob
      .sync(this.Options.Controllers, { absolute: true })
      .forEach((filePath) => {
        require(filePath);
      });
  }

  public UseRouting(): void {
    this.#Metadata.GetHttpRoutes().forEach(({ router, endpoint }) => {
      const prefixedEndpoint = path.join(this.#BasePath ?? '/', endpoint);
      logger.info('register endpoint', prefixedEndpoint);
      this.#Application.use(
        process.env.SKIP_REGISTERING_ROUTE ? '' : prefixedEndpoint,
        router
      );
    });
  }

  public UseEndpoints(): void {
    this.#Application.use(this.DIMiddleware());
  }

  public Run(): void {
    // will block the thread till the server shutdown
  }
  public RunAsync(): void {
    // will return promise that resolved when the server is terminated
  }

  /**
   * Prepends base path before each request path
   */
  public UseBasePath(path: string): void {
    this.#BasePath = path;
  }

  /**
   * All uncaught errors related to express will be bubbled up to this handler.
   *
   * It's benfical if you don't want to handle the same error again and again
   *
   * e.g getByIdOrFail() will fail in case the item is not there hence you need to wrap it in try catch or use then().catch(),
   * thus, you need to find a way to let the error fly to this handler so you can handle it in one place
   */
  public UseErrorHandler(action: (error: any) => HttpResponse): void {
    this.#Application.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
          return next(error);
        }
        const response = action(error);
        res.status(response.statusCode).json(response.toJson());
      }
    );
  }

  /**
   * FIXME: refactor to .net use exception handler
   */
  public UseNotFoundHandler(): void {
    this.#Application.use(
      autoHandler((req: Request) => {
        throw new ErrorResponse(
          `${req.originalUrl} => ${'endpoint_not_found'}`,
          StatusCodes.NOT_FOUND,
          'not-found'
        );
      })
    );
  }

  /**
   * Add unique id to each request to make them distinguishable.
   *
   * @param headerName to add with request id. 'X-Request-Id' as common name.
   */
  public UseRequestId(): void {
    this.#Application.use(requestIdMiddleware);
  }

  public IgnoreFavIcon(): void {
    this.#Application.use((req, res, next) => {
      if (
        req.originalUrl &&
        req.originalUrl.split('/').pop() === 'favicon.ico'
      ) {
        return SuccessResponse.NoContent();
      }
      next();
      return;
    });
  }

  private UseHsts(): void {
    this.#Application.use((req, res, next) => {
      if (req.secure) {
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload'
        );
      }
      next();
    });
  }

  private DIMiddleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const context = RoutingInjector.Create();
      const dispose = (): void => RoutingInjector.Destroy(context);
      context.setExtra('request', req);
      ['error', 'end'].forEach((eventName) => {
        req.on(eventName, dispose);
      });
      req.__InjectionContext = context;
      req.inject = <T>(serviceType: ServiceType<T>): T =>
        RoutingInjector.GetRequiredService(serviceType, context);
      next();
    };
  }

  private UseWelcomePage(): WebApplicationBuilder {
    throw new Error('Not Implemented.');
  }
  private UseExceptionHandler(): WebApplicationBuilder {
    throw new Error('Not Implemented.');
  }
}

// type Middleware = (req: Request, res: Response, next: NextFunction) => void;
