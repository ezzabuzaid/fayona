import { NextFunction, Request, Response } from "express";
import glob from "fast-glob";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import path from "path";
import { Injector } from "tiny-injector";
import { Logger } from "tslog";
import { ConfigureOptions } from "./ConfigureOptions";
import { Environment } from "./Environment";
import { AuthenticationOptions, AuthorizationEvaluator, AuthorizationOptions, AuthorizationService, IAuthorizationHandler, PassThroughAuthorizationHandler } from "./Identity";
import { requestIdMiddleware, RequestIdOptions } from "./RequestId";
import { ErrorResponse, HttpResponse, SuccessResponse } from "./Response";
import { autoHandler } from "./Routing/AutoHandler";
import { Metadata } from "./Routing/Metadata";
import { RoutingCollection, RoutingInjector } from "./utils/Collections";
const logger = new Logger({ name: 'WebApplication' })

declare module 'tiny-injector' {
    export interface AbstractServiceCollection {
    }
}

export class WebApplicationBuilder {
    public Environment = new Environment();
    public Services = RoutingCollection;

    constructor(
        private options: ConfigureOptions
    ) { }

    AddHsts() { }

    AddRequestId(optFn: (options: RequestIdOptions) => void) {
        const options = new RequestIdOptions();
        optFn(options);
        this.Services.TryAddTransient(RequestIdOptions, () => options);
    }

    AddAuthorization(optFn: (options: AuthorizationOptions) => void) {
        const options = new AuthorizationOptions();
        optFn(options);
        // Add auth related services here and not using "Injectable"
        // https://github.com/dotnet/aspnetcore/blob/main/src/Security/Authorization/Core/src/AuthorizationServiceCollectionExtensions.cs
        this.Services.TryAddTransient(AuthorizationService);
        this.Services.TryAddTransient(AuthorizationEvaluator);
        this.Services.AppendTransient(IAuthorizationHandler, PassThroughAuthorizationHandler)
        this.Services.AddSingleton(AuthorizationOptions, () => options);
    }

    AddAuthentication(optFn: (options: AuthenticationOptions) => void) {
        const options = new AuthenticationOptions();
        optFn(options);
        this.Services.AddSingleton(AuthenticationOptions, () => options);
    }

    Build() {
        return new WebApplication(this.options);
    }
}

export class WebApplication {
    // private Services = _RootServicesCollection;
    #application = this.options.apiAdaptar;
    // FIXME: create custom service collection for metadata
    #metadata = Injector.GetRequiredService(Metadata);
    #basePath: string = '';

    constructor(
        private options: ConfigureOptions
    ) { }

    static CreateBuilder(
        options: ConfigureOptions
    ) {
        return new WebApplicationBuilder(options);
    }

    private static Create(
        options: ConfigureOptions
    ) {
        return new WebApplicationBuilder(options);
    }

    public UseAuthentication() {
        const authenticationOptions = RoutingInjector.GetRequiredService(AuthenticationOptions);
        const strategy = authenticationOptions.Strategies.find((it) => it.Name === authenticationOptions.DefaultStrategyName);
        if (!strategy) {
            throw new Error(`${authenticationOptions.DefaultStrategyName} is not configured.`);
        }
        passport.use(authenticationOptions.DefaultStrategyName, strategy.Strategy);
    }

    public UseAuthorization() {
    }

    LogEndpoints() {
        console.log(require('express-list-endpoints')(this.#application))
    }

    AddControllers() {
        glob.sync(this.options.controllers, { absolute: true })
            .forEach(filePath => {
                require(filePath);
            });
    }

    UseRouting() {
        this.#metadata.GetHttpRoutes()
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
            const context = RoutingInjector.Create();
            const dispose = () => RoutingInjector.Destroy(context);
            context.setExtra('request', req);
            ['error', 'end'].forEach((eventName) => {
                req.on(eventName, dispose);
            });
            req.__InjectionContext = context;
            req.inject = (serviceType) => RoutingInjector.GetRequiredService(serviceType, context);
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

