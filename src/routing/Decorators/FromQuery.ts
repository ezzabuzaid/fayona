import { Injector } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

interface IFromQueryOptions {
	queryPolluted: boolean;
}

export function FromQuery(): ParameterDecorator;
export function FromQuery(options?: IFromQueryOptions): ParameterDecorator;
export function FromQuery(queryParamName?: string): ParameterDecorator;
export function FromQuery(
	queryParamNameOrOptions?: string | IFromQueryOptions,
	options?: IFromQueryOptions
): ParameterDecorator {
	let queryParamName: string;
	let queryParamNameOptions: IFromQueryOptions | undefined;
	if (typeof queryParamNameOrOptions === "string") {
		queryParamName = queryParamNameOrOptions;
		queryParamNameOptions = options;
	} else if (new Object(queryParamNameOrOptions) === queryParamNameOrOptions) {
		options = queryParamNameOrOptions;
	}
	return (target: any, propertyKey, parameterIndex: number) => {
		const metadata = Injector.GetRequiredService(Metadata);
		const parametersTypes = Reflect.getMetadata(
			"design:paramtypes",
			target,
			propertyKey
		);
		const parameterMetadata = new ParameterMetadata(
			parameterIndex,
			ParameterType.FROM_QUERY,
			queryParamName,
			propertyKey as string,
			target.constructor.name,
			queryParamNameOptions
		);
		parameterMetadata.setExpectedType(parametersTypes[parameterIndex]);
		metadata.RegisterParameter(parameterMetadata);
	};
}
