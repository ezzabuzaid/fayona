import { ParameterMetadata, ParameterType } from '@fayona/core';
import { ClassType } from 'tiny-injector/Types';

export type FromBodyPayloadType = ClassType<any>;

export class FromBodyParameterMetadata extends ParameterMetadata<FromBodyPayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_BODY;
}
