import { InvalidOperationException } from '@fayona/core';

import { FromHeadersPayloadType } from '../Metadata/FromHeaderParameterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromHeaderModelBinding extends ModelBinding<
  FromHeadersPayloadType,
  Record<string, any>
> {
  public override async Bind(): Promise<FromHeadersPayloadType> {
    const payload = this.ParameterMetadata.Payload;
    let header = null;
    if (typeof payload === 'function') {
      header = payload(this.Variant);
    } else if (typeof payload === 'string') {
      header = this.Variant[payload];
    } else {
      throw new InvalidOperationException(
        `${
          FromHeaderModelBinding.name
        } supports only function or string. Received ${typeof this.Variant}`
      );
    }
    return header;
  }
}
