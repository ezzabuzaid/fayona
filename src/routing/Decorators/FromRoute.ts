import { Injector } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

export function FromRoute(param: string): ParameterDecorator {
	return (target: any, propertyKey, parameterIndex: number) => {
		const metadata = Injector.GetRequiredService(Metadata);
		metadata.RegisterParameter(
			new ParameterMetadata(
				parameterIndex,
				ParameterType.FROM_ROUTE,
				param,
				propertyKey as string,
				target.constructor.name
			)
		);
	};
}
