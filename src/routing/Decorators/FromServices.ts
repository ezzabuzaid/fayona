import { Injector } from "tiny-injector";
import { Metadata } from "../Metadata";
import { ParameterMetadata } from "../ParameterMetadata";
import { ParameterType } from "../ParameterType";

export function FromServices(): ParameterDecorator {
    return (target: any, propertyKey, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const parameterMetadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.FROM_SERVICES,
            null,
            propertyKey as string,
            target.constructor.name
        );
        parameterMetadata.setExpectedType(parametersTypes[parameterIndex]);
        metadata.registerParameter(parameterMetadata);
    };
}
