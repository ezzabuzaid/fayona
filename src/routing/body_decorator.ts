import { Type } from '../utils';
import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function FromBody<T>(bodyType?: Type<T>): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.BODY,
                bodyType,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
