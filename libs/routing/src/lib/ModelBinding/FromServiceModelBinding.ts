import { ServiceType } from 'tiny-injector';

import { FromServicePayloadType } from '../Metadata/FromServiceParameterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromServiceModelBinding extends ModelBinding<
  FromServicePayloadType,
  ServiceType<any>
> {
  public Bind(): FromServicePayloadType {
    return this.Variant;
  }
}
