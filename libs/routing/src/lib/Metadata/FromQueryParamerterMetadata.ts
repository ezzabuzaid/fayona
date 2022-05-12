import { ParameterMetadata, ParameterType } from '@fayona/core';

export class FromQueryParamerterMetadata extends ParameterMetadata<FromQueryPayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_QUERY;
}

export type FromQueryPayloadType =
  | string
  | ((query: Record<string, any>) => void);
