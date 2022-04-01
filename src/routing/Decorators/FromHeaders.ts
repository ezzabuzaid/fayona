import "reflect-metadata";
import { Injector } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

export function FromHeader(
	header: string | ((headers: { [key: string]: any }) => any)
): ParameterDecorator {
	return (target: any, propertyKey, parameterIndex: number) => {
		const metadata = Injector.GetRequiredService(Metadata);
		metadata.RegisterParameter(
			new ParameterMetadata(
				parameterIndex,
				ParameterType.FROM_HEADER,
				header,
				propertyKey as string,
				target.constructor.name
			)
		);
	};
}
