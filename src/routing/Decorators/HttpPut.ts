import { RequestHandler } from "express";
import { Injector } from "tiny-injector";
import { HttpEndpointMetadata } from "../HttpEndpointMetadata";
import { Metadata } from "../Metadata";
import { METHODS } from "../Methods";

export function HttpPut(
	endpoint = "/",
	...middlewares: RequestHandler[]
): MethodDecorator {
	return function (
		target: Record<string, any>,
		propertyKey,
		descriptor: PropertyDescriptor
	) {
		const metadata = Injector.GetRequiredService(Metadata);
		metadata.RegisterHttpEndpoint(
			new HttpEndpointMetadata(
				target.constructor,
				target[propertyKey as string],
				endpoint,
				METHODS.PUT,
				middlewares
			)
		);
	};
}
