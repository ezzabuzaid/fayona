import { ServiceType } from 'tiny-injector';

import { FromServicePayloadType } from '../Metadata/FromServiceParameterMetadata';
import { ModelBinding } from './ModelBinding';

export class FromServiceModelBinding extends ModelBinding<
  FromServicePayloadType,
  ServiceType<any>
> {
  public override async Bind(): Promise<FromServicePayloadType> {
    return this.Variant;
  }
}
