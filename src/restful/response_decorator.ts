import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function ContextResponse(): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.RESPONSE,
                null,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
