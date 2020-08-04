import { ParameterMetadata, ParameterType, registerParameter } from '.';
import 'reflect-metadata';
import { Type } from '@lib/utils';

export function FromHeaders<T>(header: string | Type<T>) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.HEADERS,
                typeof header === 'string' ? { [propertyKey]: header } as any : header,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
