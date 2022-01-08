import { Injector } from "@lib/dependency-injection";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

// FIXME: create another override that takes only options
export function FromQuery(queryParamName?: string, options?: { queryPolluted: boolean }): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const parameterMetadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.FROM_QUERY,
            queryParamName,
            propertyKey,
            target.constructor.name,
            options
        );
        parameterMetadata.setExpectedType(parametersTypes[parameterIndex]);
        metadata.registerParameter(parameterMetadata);
    };
}
