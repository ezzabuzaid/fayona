import { Type } from '../utils';
import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function FromQuery<T>(query: string | Type<T>): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.QUERY,
                query,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
