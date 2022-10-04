import { ParameterMetadata, ParameterType } from '@fayona/core';
import { ClassType } from 'tiny-injector/Types';

export class FromQueryParamerterMetadata extends ParameterMetadata<FromQueryPayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_QUERY;
}

export type FromQueryPayloadType =
  | ClassType<any>
  | string
  | ((query: Record<string, any>) => void);
