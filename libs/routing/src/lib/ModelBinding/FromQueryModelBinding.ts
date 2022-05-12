import { InvalidOperationException, IsConstructor } from '@fayona/core';

import { FromQueryPayloadType } from '../Metadata/FromQueryParamerterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromQueryModelBinding extends ModelBinding<
  FromQueryPayloadType,
  Record<string, any>
> {
  public Bind(): any {
    const payload = this.ParameterMetadata.Payload;
    let query = null;
    if (typeof payload === 'function') {
      query = payload(this.Variant);
    } else if (typeof payload === 'string') {
      query = this.Variant[payload];
    } else if (IsConstructor(payload)) {
      // FIXME construct the type
      query = this.Variant;
    } else {
      throw new InvalidOperationException(
        `${
          FromQueryModelBinding.name
        } supports function, string and class Type. Received ${typeof this
          .Variant}`
      );
    }
    return query;
  }
}
