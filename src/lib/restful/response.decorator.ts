import { ParameterMetadata, ParameterType, registerParameter } from '.';

export function ContextResponse() {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.RESPONSE,
                null,
                propertyKey,
                target.constructor.name
            )
        )
    }
}

