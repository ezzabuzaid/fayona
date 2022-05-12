import { CoreInjector, MakeHandlerName, Metadata } from '@fayona/core';

import { FromQueryParamerterMetadata } from '../Metadata/FromQueryParamerterMetadata';

export function FromQuery(): ParameterDecorator;
export function FromQuery(queryParamName?: string): ParameterDecorator;
export function FromQuery(
  queryParamFn?: (query: Record<string, string>) => void
): ParameterDecorator;
export function FromQuery(
  queryParamFnOrName?: ((query: Record<string, string>) => void) | string
): ParameterDecorator {
  return (target: any, propertyKey, parameterIndex: number) => {
    // FIXME: throw an error if queryParamFnOrName and the type parametersTypes[parameterIndex] is not user defined type
    const metadata = CoreInjector.GetRequiredService(Metadata);
    const parametersTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey
    );
    const parameterMetadata = new FromQueryParamerterMetadata(
      target.constructor,
      target[propertyKey as string],
      parameterIndex,
      queryParamFnOrName ?? parametersTypes[parameterIndex],
      MakeHandlerName(target.constructor, propertyKey as string)
    );
    metadata.RegisterParameter(parameterMetadata);
  };
}
