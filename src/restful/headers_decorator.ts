import { ParameterMetadata, ParameterType, registerParameter } from './index';
import 'reflect-metadata';

export function FromHeaders(header: string | ((headers: { [key: string]: any }) => any)): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.HEADERS,
                header,
                propertyKey,
                target.constructor.name,
            )
        );
    };
}
