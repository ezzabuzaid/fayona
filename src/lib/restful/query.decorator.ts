import { ParameterMetadata, ParameterType, registerParameter } from '.';
import { Type, isNullOrUndefined } from '@lib/utils';

export function FromQuery<T>(query: string | Type<T>) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.QUERY,
                typeof query === 'string' ? { [propertyKey]: query } as any : query,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
