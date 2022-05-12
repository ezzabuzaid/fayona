import { ClassType } from 'tiny-injector/Types';

import {
  FromBodyParameterMetadata,
  FromBodyPayloadType,
} from '../Metadata/FromBodyParameterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromBodyModelBinding extends ModelBinding<
  FromBodyPayloadType,
  ClassType<any>
> {
  public Bind(): FromBodyPayloadType {
    //   this.IsUserDefinedType(
    //   this.Variant
    // )
    // FIXME: implement model state validation
    return this.Variant;
  }

  private IsUserDefinedType(type: any): boolean {
    return ![String, Number, Object, Symbol, Date, Promise, Proxy].includes(
      type
    );
  }
}
