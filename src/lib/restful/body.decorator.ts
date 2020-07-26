import { ParameterMetadata, ParameterType, registerParameter } from '.';
import { Type } from '@lib/utils';

export function FromBody<T>(bodyType: Type<T>) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.BODY,
                bodyType,
                propertyKey,
                target.constructor.name
            )
        )
    }
}

