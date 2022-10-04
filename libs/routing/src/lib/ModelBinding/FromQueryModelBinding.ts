import { InvalidOperationException, IsConstructor } from '@fayona/core';
import { ClassType } from 'tiny-injector/Types';

import { FromQueryPayloadType } from '../Metadata/FromQueryParamerterMetadata';
import { ModelBinding } from './ModelBinding';
import { ValidateModel } from './ValidateModel';

export class FromQueryModelBinding extends ModelBinding<
  FromQueryPayloadType,
  Record<string, any>
> {
  public override async Bind(): Promise<any> {
    const payload = this.ParameterMetadata.Payload;
    if (IsConstructor<ClassType<any>>(payload)) {
      return ValidateModel(payload, this.Variant);
    } else if (typeof payload === 'string') {
      return this.Variant[payload];
    } else if (typeof payload === 'function') {
      return payload(this.Variant);
    } else {
      throw new InvalidOperationException(
        `${
          FromQueryModelBinding.name
        } supports function, string and class Type. Received ${typeof this
          .Variant}`
      );
    }
  }
}
