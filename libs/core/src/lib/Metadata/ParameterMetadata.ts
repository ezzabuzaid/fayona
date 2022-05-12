import { ParameterType } from './ParameterType';

export abstract class ParameterMetadata<T> {
  public abstract readonly Type: ParameterType;
  constructor(
    public readonly controller: Function,
    public readonly handler: Function,
    public readonly Index: number,
    public readonly Payload: T,
    public readonly HandlerName: string
  ) {}
}
