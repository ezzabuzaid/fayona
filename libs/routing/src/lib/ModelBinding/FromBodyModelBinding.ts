import { FromBodyPayloadType } from '../Metadata/FromBodyParameterMetadata';
import { ModelBinding } from './ModelBinding';
import { ValidateModel } from './ValidateModel';

export class FromBodyModelBinding extends ModelBinding<
  FromBodyPayloadType,
  Record<string, any>
> {
  public override async Bind(): Promise<FromBodyPayloadType> {
    return ValidateModel(this.ParameterMetadata.Payload, this.Variant);
  }

  private IsUserDefinedType(type: any): boolean {
    return ![String, Number, Object, Symbol, Date, Promise, Proxy].includes(
      type
    );
  }
}
