import { Request } from "express";
import { Injector } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

export function ContextRequest<T>(
	action?: (request: Request) => T
): ParameterDecorator {
	return (target: any, propertyKey, parameterIndex: number) => {
		const metadata = Injector.GetRequiredService(Metadata);
		metadata.RegisterParameter(
			new ParameterMetadata(
				parameterIndex,
				ParameterType.REQUEST,
				action,
				propertyKey as string,
				target.constructor.name
			)
		);
	};
}
