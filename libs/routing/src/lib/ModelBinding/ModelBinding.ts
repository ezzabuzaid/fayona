import { ParameterMetadata } from '@fayona/core';

export abstract class ModelBinding<TPayloadType, TVariant> {
  protected ParameterMetadata: ParameterMetadata<TPayloadType>;
  constructor(
    parameterMetadata: ParameterMetadata<TPayloadType>,
    protected Variant: TVariant
  ) {
    this.ParameterMetadata = parameterMetadata;
  }

  public abstract Bind(): any;
}
