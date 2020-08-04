import { ParameterMetadata, ParameterType, registerParameter } from '.';

export function ContextRequest() {
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
