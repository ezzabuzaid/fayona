import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function FromParams(param: string): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.PARAMS,
                param,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
