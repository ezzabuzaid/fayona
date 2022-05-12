import { FromRoutePayloadType } from '../Metadata/FromRouteParameterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromRouteModelBinding extends ModelBinding<
  FromRoutePayloadType,
  Record<string, string>
> {
  public Bind(): any {
    return this.Variant[this.ParameterMetadata.Payload];
  }
}
