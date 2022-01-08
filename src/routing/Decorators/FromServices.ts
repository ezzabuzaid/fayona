import { Injector } from "@lib/dependency-injection";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

export function FromServices(): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const parameterMetadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.FROM_SERVICES,
            null,
            propertyKey,
            target.constructor.name
        );
        parameterMetadata.setExpectedType(parametersTypes[parameterIndex]);
        metadata.registerParameter(parameterMetadata);
    };
}
