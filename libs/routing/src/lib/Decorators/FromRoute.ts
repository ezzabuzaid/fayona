import { ArgumentNullException, CoreInjector, Metadata } from '@fayona/core';
import { IsNullOrEmpty, MakeHandlerName } from '@fayona/core';

import { FromRouteParameterMetadata } from '../Metadata/FromRouteParameterMetadata';

export function FromRoute(param: string): ParameterDecorator {
  if (IsNullOrEmpty(param)) {
    throw new ArgumentNullException('Must be non empty string', 'param');
  }
  return (target: any, propertyKey, parameterIndex: number) => {
    const metadata = CoreInjector.GetRequiredService(Metadata);
    metadata.RegisterParameter(
      new FromRouteParameterMetadata(
        target.constructor,
        target[propertyKey as string],
        parameterIndex,
        param,
        MakeHandlerName(target.constructor, propertyKey as string)
      )
    );
  };
}
