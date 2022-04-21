import { nanoid } from 'nanoid';
import { Injectable, ServiceLifetime } from 'tiny-injector';
import { ROUTING_COLLECTION } from '../RoutingCollection';

@Injectable({
  lifetime: ServiceLifetime.Singleton,
  provideIn: ROUTING_COLLECTION,
})
export class RequestIdOptions {
  public SetHeader = false;
  public HeaderName = 'X-Request-Id';
  public Generator = (): string => nanoid();
}
