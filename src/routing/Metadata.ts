import { RequestHandler } from "express";
import { AuthorizationPolicyBuilder } from "Identity/Authorize/AuthorizationPolicyBuilder";
import { Injectable, ServiceLifetime } from "tiny-injector";
import { Logger } from "tslog";
import { generateAlphabeticString, notEmpty, Type } from "../utils";
import { HttpEndpointMetadata } from "./HttpEndpointMetadata";
import { HttpEndpointMiddlewareMetadata } from "./HttpEndpointMiddlewareMetadata";
import { HttpRouteMetadata } from "./HttpRouteMetadata";
import { ParameterMetadata } from "./ParameterMetadata";
import { makeHandlerName } from "./Utils";

const logger = new Logger({ name: "Routing", minLevel: "error" });

@Injectable({ lifetime: ServiceLifetime.Singleton })
export class Metadata {
	#endpointToPolicy: Record<string, AuthorizationPolicyBuilder[]> = {};
	#routes: HttpRouteMetadata[] = [];
	#parameters = new Map<string, ParameterMetadata[]>();
	#middlewares = new Map<string, HttpEndpointMiddlewareMetadata[]>();
	#endpoints: HttpEndpointMetadata[] = [];
	static MetadataKey = generateAlphabeticString();
	private metadataKey(methodName: string, endpoint: string | RegExp) {
		return `${Metadata.MetadataKey}:${methodName}:${endpoint}`;
	}

	public RegisterHttpEndpointMiddleware(
		httpEndpointMiddlewareMetadata: HttpEndpointMiddlewareMetadata
	) {
		// FIXME: to be removed - each HttpEndpointMetadata should hold array of middlewares and not added to metadata state
		logger.debug(
			"Registering Endpoint Middleware",
			httpEndpointMiddlewareMetadata.getHandlerName()
		);
		const middlewares =
			this.#middlewares.get(httpEndpointMiddlewareMetadata.getHandlerName()) ??
			[];
		middlewares.push(httpEndpointMiddlewareMetadata);
		this.#middlewares.set(
			httpEndpointMiddlewareMetadata.getHandlerName(),
			middlewares
		);
	}

	public RegisterHttpEndpointMiddlewareV2(
		httpEndpointMetadata: HttpEndpointMetadata,
		...middlewares: RequestHandler[]
	) {
		httpEndpointMetadata.middlewares.push(...middlewares);
	}

	public RegisterParameter(parameterMetadata: ParameterMetadata) {
		logger.debug(
			"Registering Parameter for ",
			parameterMetadata.getHandlerName(),
			" at index ",
			parameterMetadata.index
		);
		const parameters =
			this.#parameters.get(parameterMetadata.getHandlerName()) ?? [];
		parameters.push(parameterMetadata);
		this.#parameters.set(parameterMetadata.getHandlerName(), parameters);
	}

	public RegisterHttpEndpoint(httpEndpointMetadata: HttpEndpointMetadata) {
		logger.debug("Registering Endpoint", httpEndpointMetadata.getHandlerName());
		const { endpoint, method, controller } = httpEndpointMetadata;
		const key = this.metadataKey(method, endpoint);
		Reflect.defineMetadata(key, httpEndpointMetadata, controller);
		this.#endpoints.push(httpEndpointMetadata);
	}

	public RegisterHttpRoute(httpRouteMetadata: HttpRouteMetadata) {
		logger.debug("Registering Route", httpRouteMetadata.controller.name);
		this.#routes.push(httpRouteMetadata);
	}

	public GetHttpRoutes() {
		return Array.from(this.#routes);
	}

	public GetHttpEndpoint(methodName: string, endpoint: string | RegExp) {}

	public RegisterPolicy(
		controller: Function,
		propertyKey: string,
		policy: AuthorizationPolicyBuilder
	) {
		const key = makeHandlerName(controller, propertyKey);
		logger.debug("Registering Policy", key);
		if (!Array.isArray(this.#endpointToPolicy[key])) {
			this.#endpointToPolicy[key] = [];
		}
		this.#endpointToPolicy[key].push(policy);
	}

	public GetPolices(httpEndpointMetadata: HttpEndpointMetadata) {
		return this.#endpointToPolicy[httpEndpointMetadata.getHandlerName()];
	}

	public RegisterAuthorize(
		controller: Function,
		propertyKey: string,
		middleware: any
	) {
		// FIXME: should use registerHttpEndpointMiddleware
		const key = makeHandlerName(controller, propertyKey);
		logger.debug("Registering Authorize", key);
		const middlewares = Reflect.getMetadata(key, controller) ?? [];
		middlewares.push(middleware);
		Reflect.defineMetadata(key, middlewares, controller);
	}

	public GetAuthorizeMiddlewares(
		httpEndpointMetadata: HttpEndpointMetadata
	): any[] {
		const key = httpEndpointMetadata.getHandlerName();
		return Reflect.getMetadata(key, httpEndpointMetadata.controller) ?? [];
	}

	public GetHttpRoute(child: any) {
		return this.#routes.find((route) => route.controller === child);
	}

	public GetEndpoints(constructor: Type<any>) {
		return (Reflect.getMetadataKeys(constructor) as string[])
			.filter((it) => it.startsWith(Metadata.MetadataKey))
			.map(
				(it) =>
					[Reflect.getMetadata, Reflect.deleteMetadata].map((_) =>
						_(it, constructor)
					)[0]
			)
			.filter(notEmpty) as HttpEndpointMetadata[];
	}

	public getHttpEndpointParameters(handlerName: string) {
		return this.#parameters.get(handlerName) ?? [];
	}

	public GetHttpEndpointMiddlewares(handlerName: string) {
		return this.#middlewares.get(handlerName) ?? [];
	}
}
