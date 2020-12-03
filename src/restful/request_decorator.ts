import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function ContextRequest(): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.REQUEST,
                null,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
