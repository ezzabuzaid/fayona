import { ParameterMetadata, ParameterType } from '@fayona/core';

export type FromHeadersPayloadType =
  | string
  | ((headers: Record<string, any>) => void);

export class FromHeaderParameterMetadata extends ParameterMetadata<FromHeadersPayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_HEADER;
}
