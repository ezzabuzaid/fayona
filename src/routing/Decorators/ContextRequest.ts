import { Injector } from '@lib/dependency-injection';
import { Request } from 'express';
import { Metadata } from '../Metadata';
import { ParameterMetadata } from '../ParameterMetadata';
import { ParameterType } from '../ParameterType';

export function ContextRequest<T>(action?: (request: Request) => T): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerParameter(
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
