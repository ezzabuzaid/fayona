import { ParameterMetadata, ParameterType } from '@fayona/core';
import { InjectionToken, ServiceType } from 'tiny-injector';

export class FromServiceParameterMetadata extends ParameterMetadata<FromServicePayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_SERVICES;
}
export type FromServicePayloadType = ServiceType<any> | InjectionToken<any>;
