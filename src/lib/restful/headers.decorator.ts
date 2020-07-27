import { ParameterMetadata, ParameterType, registerParameter } from '.';

export function FromHeaders(header?: string) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.HEADERS,
                { [propertyKey]: header ?? propertyKey } as any,
                propertyKey,
                target.constructor.name
            )
        )
    }
}

