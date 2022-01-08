import { Injector } from '@lib/dependency-injection';
import 'reflect-metadata';
import { Metadata } from '../Metadata';
import { ParameterMetadata } from '../ParameterMetadata';
import { ParameterType } from '../ParameterType';

// FIXME: rename it to FromHeader
export function FromHeaders(header: string | ((headers: { [key: string]: any }) => any)): ParameterDecorator {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const metadata = Injector.GetRequiredService(Metadata);
        metadata.registerParameter(
            new ParameterMetadata(
                parameterIndex,
                ParameterType.FROM_HEADER,
                header,
                propertyKey,
                target.constructor.name,
            )
        );
    };
}
