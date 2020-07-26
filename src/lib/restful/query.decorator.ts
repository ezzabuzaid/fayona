import { ParameterMetadata, ParameterType, registerParameter } from '.';
import { Type } from '@lib/utils';

export function FromQuery<T>(payload: Type<T>) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.QUERY,
                payload,
                propertyKey,
                target.constructor.name
            )
        )
    }
}

