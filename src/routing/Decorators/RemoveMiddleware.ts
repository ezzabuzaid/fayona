import { Injector } from "tiny-injector";
import { HttpEndpointMiddlewareMetadata } from "../HttpEndpointMiddlewareMetadata";
import { Metadata } from "../Metadata";

export function RemoveMiddleware(
	middleware: (...args: any[]) => any
): MethodDecorator {
	return function (
		target: Record<string, any>,
		propertyKey,
		descriptor: PropertyDescriptor
	) {
		const metadata = Injector.GetRequiredService(Metadata);
		metadata.RegisterHttpEndpointMiddleware(
			new HttpEndpointMiddlewareMetadata(
				middleware,
				target.constructor,
				target[propertyKey as string]
			)
		);
	};
}
