import { Injector } from "@lib/dependency-injection";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

// FIXME: rename it to FromRoute
export function FromParams(param: string): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.FROM_ROUTE,
                param,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
