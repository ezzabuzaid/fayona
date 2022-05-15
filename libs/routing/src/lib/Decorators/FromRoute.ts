import { ArgumentNullException, Metadata } from '@fayona/core';
import { IsNullOrEmpty, MakeHandlerName } from '@fayona/core';
import { Injector } from 'tiny-injector';

import { FromRouteParameterMetadata } from '../Metadata/FromRouteParameterMetadata';

export function FromRoute(param: string): ParameterDecorator {
  if (IsNullOrEmpty(param)) {
    throw new ArgumentNullException('Must be non empty string', 'param');
  }
  return (target: any, propertyKey, parameterIndex: number) => {
    const metadata = Injector.GetRequiredService(Metadata);
    const parametersTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey
    );

    const defs = param.split(':');
    const paramDefType = defs.at(1);
    const paramNativeType = parametersTypes[parameterIndex].name.toLowerCase();
    // if the developer specified the param type in the paramDefinition then it should match the param type
    if (paramDefType && paramDefType.toLowerCase() !== paramNativeType) {
      throw new ArgumentNullException(
        `param type ${paramNativeType} should be equal to ${paramDefType}`,
        'param'
      );
    }

    metadata.RegisterParameter(
      new FromRouteParameterMetadata(
        target.constructor,
        target[propertyKey as string],
        parameterIndex,
        param,
        parametersTypes[parameterIndex],
        MakeHandlerName(target.constructor, propertyKey as string)
      )
    );
  };
}
