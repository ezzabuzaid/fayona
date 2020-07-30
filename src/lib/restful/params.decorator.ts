import { ParameterMetadata, ParameterType, registerParameter } from '.';

export function FromParams(param: string) {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.PARAMS,
                { [propertyKey]: param } as any,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
