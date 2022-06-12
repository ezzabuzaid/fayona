import { MakeHandlerName, Metadata } from '@fayona/core';
import { Injector } from 'tiny-injector';

import { FromBodyParameterMetadata } from '../Metadata/FromBodyParameterMetadata';

export function FromBody(): ParameterDecorator {
  return (target: any, propertyKey, parameterIndex: number) => {
    // FIXME: throw an error if more than one FromBody used on an action - build step
    const metadata = Injector.GetRequiredService(Metadata);
    const parametersTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey
    );
    const parameterMetadata = new FromBodyParameterMetadata(
      target.constructor,
      target[propertyKey as string],
      parameterIndex,
      parametersTypes[parameterIndex],
      parametersTypes[parameterIndex],
      MakeHandlerName(target.constructor, propertyKey as string)
    );
    metadata.RegisterParameter(parameterMetadata);
  };
}
