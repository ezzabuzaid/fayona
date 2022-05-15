import { MakeHandlerName, Metadata } from '@fayona/core';
import 'reflect-metadata';
import { Injector } from 'tiny-injector';

import { FromHeaderParameterMetadata } from '../Metadata/FromHeaderParameterMetadata';

export function FromHeader(
  header: string | ((headers: { [key: string]: any }) => any)
): ParameterDecorator {
  return (target: any, propertyKey, parameterIndex: number) => {
    const metadata = Injector.GetRequiredService(Metadata);
    const parametersTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey
    );
    metadata.RegisterParameter(
      new FromHeaderParameterMetadata(
        target.constructor,
        target[propertyKey as string],
        parameterIndex,
        header,
        parametersTypes[parameterIndex],
        MakeHandlerName(target.constructor, propertyKey as string)
      )
    );
  };
}
