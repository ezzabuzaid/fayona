import { ParameterMetadata, ParameterType } from '@fayona/core';

export type FromBodyPayloadType = Record<string, any>;

export class FromBodyParameterMetadata extends ParameterMetadata<FromBodyPayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_BODY;
}
