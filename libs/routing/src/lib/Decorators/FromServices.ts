import { CoreInjector, MakeHandlerName, Metadata } from '@fayona/core';
import { InjectionToken, Injector, ServiceType } from 'tiny-injector';

import { FromServiceParameterMetadata } from '../Metadata/FromServiceParameterMetadata';

export function FromServices(
  serviceType?: ServiceType<any>
): ParameterDecorator;
export function FromServices(
  injectionToken: InjectionToken<any>
): ParameterDecorator;
export function FromServices(
  serviceTypeOrInjectionToken?: any
): ParameterDecorator {
  return (target: any, propertyKey, parameterIndex: number) => {
    const metadata = CoreInjector.GetRequiredService(Metadata);
    const parametersTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey
    );
    const parameterMetadata = new FromServiceParameterMetadata(
      target.constructor,
      target[propertyKey as string],
      parameterIndex,
      serviceTypeOrInjectionToken ?? parametersTypes[parameterIndex],
      parametersTypes[parameterIndex],
      MakeHandlerName(target.constructor, propertyKey as string)
    );
    metadata.RegisterParameter(parameterMetadata);
  };
}
