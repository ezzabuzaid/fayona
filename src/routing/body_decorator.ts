import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function FromBody(): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const parametersTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const metadata = new ParameterMetadata(
            parameterIndex,
            ParameterType.BODY,
            null,
            propertyKey,
            target.constructor.name
        );
        metadata.setExpectedType(parametersTypes[parameterIndex]);
        registerParameter(metadata);
    };
}
