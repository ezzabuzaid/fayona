import { Injector } from 'tiny-injector';
import { Metadata } from '../Metadata';
import { ParameterMetadata } from '../ParameterMetadata';
import { ParameterType } from '../ParameterType';

export function FromBody(): ParameterDecorator {
    return (target: any, propertyKey, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const parameterMetadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.FROM_BODY,
            null,
            propertyKey as string,
            target.constructor.name
        );
        parameterMetadata.setExpectedType(parametersTypes[parameterIndex]);
        metadata.registerParameter(parameterMetadata);
    };
}
