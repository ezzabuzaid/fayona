import { CoreInjector, MakeHandlerName, Metadata } from '@fayona/core';

import { FromBodyParameterMetadata } from '../Metadata/FromBodyParameterMetadata';

export function FromBody(): ParameterDecorator {
  return (target: any, propertyKey, parameterIndex: number) => {
    const metadata = CoreInjector.GetRequiredService(Metadata);
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
