import { Request } from 'express';
import { ParameterMetadata, ParameterType, registerParameter } from './index';

export function ContextRequest<T>(action?: (request: Request) => T): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.REQUEST,
                action,
                propertyKey,
                target.constructor.name
            )
        );
    };
}
