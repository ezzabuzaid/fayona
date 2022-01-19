import { NextFunction, Request, Response } from "express";
import glob from "fast-glob";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { Injector } from "tiny-injector";
import { Logger } from "tslog";
import { ConfigureOptions, CONFIGURE_OPTIONS } from "./ConfigureOptions";
import { Environment } from "./Environment";
import { requestIdMiddleware, RequestIdOptions } from "./RequestId";
import { ErrorResponse, HttpResponse, SuccessResponse } from "./Response";
import { autoHandler } from "./Routing/AutoHandler";
import { Metadata } from "./Routing/Metadata";
const logger = new Logger({ name: 'WebApplication' })

export class WebApplicationBuilder {
    public Environment = new Environment();

    AddHsts() { }

    AddRequestId(optFn: (options: RequestIdOptions) => void) {
        const options = new RequestIdOptions();
        optFn(options);
        Injector.ReplaceScoped(RequestIdOptions, () => options);
    }

    Build() {
        return new WebApplication();
    }
}

export class WebApplication {
    #application = this.#options.apiAdaptar;
    #metadata = Injector.GetRequiredService(Metadata);
    #basePath: string = '';

    get #options() {
        return Injector.GetRequiredService(CONFIGURE_OPTIONS);
    }

    static CreateBuilder(
        options: ConfigureOptions
    ) {
        Injector.AddSingleton(CONFIGURE_OPTIONS, () => options);
        return new WebApplicationBuilder();
    }

    private static Create(
        options: ConfigureOptions
    ) {
        Injector.AddSingleton(CONFIGURE_OPTIONS, () => options);
        return new WebApplicationBuilder();
    }

    LogEndpoints() {
        console.log(require('express-list-endpoints')(this.#application))
    }

    AddControllers() {
        glob.sync(this.#options.controllers, { absolute: true })
            .forEach(filePath => {
                require(filePath);
            });
    }

    UseRouting() {
        this.#metadata.getHttpRoutes()
            .forEach(({ router, endpoint }) => {
                const prefixedEndpoint = path.join(this.#basePath ?? '/', endpoint);
                logger.info('register endpoint', prefixedEndpoint);
                this.#application.use(process.env.SKIP_REGISTERING_ROUTE ? '' : prefixedEndpoint, router);
            });
    }

    UseEndpoints() {
        this.#application.use(this.DIMiddleware());
    }

    Run() {

    }

    /**
     * Prepends base path before each request path
     */
    UseBasePath(path: string) {
        this.#basePath = path;
    }

    /**
     * All uncaught errors related to express will be bubbled up to this handler.
     *
     * It's benfical if you don't want to handle the same error again and again
     *
     * e.g getByIdOrFail() will fail in case the item is not there hence you need to wrap it in try catch or use then().catch(),
     * thus, you need to find a way to let the error fly to this handler so you can handle it in one place
     */
    UseErrorHandler(action: (error: any) => HttpResponse) {
        this.#application.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            if (res.headersSent) {
                return next(error);
            }
            const response = action(error);
            res.status(response.statusCode).json(response.toJson());
        });
    }

    /**
     * FIXME: refactor to .net use exception handler
     */
    UseNotFoundHandler() {
        this.#application.use(autoHandler((req: Request) => {
            throw new ErrorResponse(`${req.originalUrl} => ${'endpoint_not_found'}`, StatusCodes.NOT_FOUND, 'not-found');
        }));
    }

    private UseHsts() {
        this.#application.use((req, res, next) => {
            if (req.secure) {
                res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            }
            next();
        });
    }

    /**
     * Add unique id to each request to make them distinguishable.
     *
     * @param headerName to add with request id. 'X-Request-Id' as common name.
     */
    UseRequestId() {
        this.#application.use(requestIdMiddleware)
    }

    private DIMiddleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            const context = Injector.Create();
            const dispose = () => Injector.Destroy(context);
            context.setExtra('request', req);
            ['error', 'end'].forEach((eventName) => {
                req.on(eventName, dispose);
            });
            req.inject = (serviceType) => Injector.GetRequiredService(serviceType, context);
            next();
        }
    }

    private UseWelcomePage() { }
    private UseExceptionHandler() { }

    public IgnoreFavIcon() {
        this.#application.use((req, res, next) => {
            if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
                return SuccessResponse.NoContent()
            }
            next();
            return;
        });
    }

}
