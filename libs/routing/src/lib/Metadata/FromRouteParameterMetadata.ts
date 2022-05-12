import { ParameterMetadata, ParameterType } from '@fayona/core';

export type FromRoutePayloadType = string;

export class FromRouteParameterMetadata extends ParameterMetadata<FromRoutePayloadType> {
  public override readonly Type: ParameterType = ParameterType.FROM_ROUTE;
}
