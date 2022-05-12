import { CORE_SERVICE_COLLECTION } from '@fayona/core';
import { nanoid } from 'nanoid';
import { Injectable, ServiceLifetime } from 'tiny-injector';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
  provideIn: CORE_SERVICE_COLLECTION,
})
export class RequestIdOptions {
  public SetHeader = false;
  public HeaderName = 'X-Request-Id';
  public Generator = (): string => nanoid();
}
